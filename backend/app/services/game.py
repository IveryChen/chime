import random
import string
from typing import Dict, List, Optional
from app.schemas.game import GameRoom, Player
import uuid
import spotipy
import requests
import aiohttp
import asyncio

class GameService:
    def __init__(self):
        self.rooms: Dict[str, GameRoom] = {}

    def generate_room_code(self) -> str:
        return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

    def generate_color(self) -> str:
            return f"#{random.randint(0, 0xFFFFFF):06x}"

    def create_player(self, name: str, spotify_token: str = None, is_host: bool = False) -> Player:
        return Player(
            name=name,
            spotify_token=spotify_token,
            is_host=is_host,
            avatar=self.generate_color(),
            id=str(uuid.uuid4())  # Explicitly generate the ID here
        )

    def create_room(self, host_name: str, spotify_token: str) -> GameRoom:
        room_code = self.generate_room_code()
        host = self.create_player(name=host_name, spotify_token=spotify_token, is_host=True)
        room = GameRoom(
            room_code=room_code,
            host=host,
            players=[host]
        )
        self.rooms[room_code] = room
        return room

    def join_room(self, room_code: str, player_name: str) -> GameRoom:
        if room_code not in self.rooms:
            raise ValueError("Room not found")

        room = self.rooms[room_code]
        if room.status != "waiting":
            raise ValueError("Game already in progress")

        for existing_player in room.players:
            if existing_player.name == player_name:
                return room

        new_player = self.create_player(name=player_name)
        room.players.append(new_player)
        return room

    def get_room(self, room_code: str) -> GameRoom:
        if room_code not in self.rooms:
            raise ValueError(f"Room with code {room_code} not found")
        return self.rooms[room_code]

    async def select_songs_for_game(self, room_code: str, num_rounds: int = 5) -> List[Dict]:
        room = self.get_room(room_code)
        num_songs_needed = len(room.players) * num_rounds
        all_tracks = []

        for player in room.players:
            if not player.selected_playlists:
                continue

            sp = spotipy.Spotify(auth=player.spotify_token)

            # Check if user has Premium
            try:
                user_info = sp.current_user()
                is_premium = user_info['product'] == 'premium'
                print(f"User {player.name} premium status: {is_premium}")
            except Exception as e:
                print(f"Error checking premium status: {str(e)}")
                is_premium = False

            for playlist_id in player.selected_playlists:
                try:
                    print(f"Fetching tracks from playlist {playlist_id}")
                    results = sp.playlist_tracks(playlist_id)
                    tracks = results['items']

                    while results['next']:
                        results = sp.next(results)
                        tracks.extend(results['items'])

                    track_ids = [
                        track['track']['id'] for track in tracks
                        if track.get('track') and track['track'].get('id')
                    ]

                    # Fetch full track details in batches
                    for i in range(0, len(track_ids), 50):
                        batch_ids = track_ids[i:i + 50]
                        full_tracks = sp.tracks(batch_ids)['tracks']

                        tracks_info = []
                        for track in full_tracks:
                            playback_info = {
                                'id': track['id'],
                                'name': track['name'],
                                'artists': track['artists'],
                                'popularity': track.get('popularity', 0),
                                'album_image': track['album']['images'][0]['url'] if track['album']['images'] else None  # Add this
                            }
                            tracks_info.append(playback_info)

                        preview_urls = await self.get_deezer_previews_batch(tracks_info)

                        for track_info, preview_url in zip(tracks_info, preview_urls):
                            if preview_url:
                                track_info['preview_type'] = 'deezer'
                                track_info['preview_url'] = preview_url
                                all_tracks.append({'track': track_info})
                            elif is_premium:
                                # Fallback to Spotify SDK for premium users
                                track_info['preview_type'] = 'spotify_sdk'
                                track_info['uri'] = track['uri']
                                all_tracks.append({'track': track_info})

                except Exception as e:
                    print(f"Error fetching playlist {playlist_id}: {str(e)}")
                    continue

        if not all_tracks:
            raise ValueError("No tracks with previews found in playlists")

        print(f"Total playable tracks: {len(all_tracks)}")

        # Try different popularity thresholds until we get enough songs
        thresholds = [60, 40, 20, 0]
        filtered_songs = []

        for threshold in thresholds:
            filtered_songs = [
                track for track in all_tracks
                if track['track'].get('popularity', 0) >= threshold
            ]

            print(f"Found {len(filtered_songs)} songs with popularity >= {threshold}")

            if len(filtered_songs) >= num_songs_needed:
                print(f"Using popularity threshold of {threshold}")
                break

        if len(filtered_songs) < num_songs_needed:
            raise ValueError(f"Not enough songs with previews. Need {num_songs_needed}, found {len(filtered_songs)}")

        selected_songs = random.sample(filtered_songs, num_songs_needed)

        artist_ids = list(set(
            song['track']['artists'][0]['id']
            for song in selected_songs
        ))

        artist_images = {}
        for i in range(0, len(artist_ids), 50):
            batch_ids = artist_ids[i:i + 50]
            artists_info = sp.artists(batch_ids)['artists']
            for artist in artists_info:
                artist_images[artist['id']] = (
                    artist['images'][0]['url'] if artist['images'] else None
                )

        formatted_songs = [{
            'id': song['track']['id'],
            'title': song['track']['name'],
            'artists': [artist['name'] for artist in song['track']['artists']],
            'artist_ids': [artist['id'] for artist in song['track']['artists']],
            'preview_type': song['track']['preview_type'],
            'preview_url': song['track'].get('preview_url'),
            'uri': song['track'].get('uri'),
            'popularity': song['track']['popularity'],
            'album_image': song['track']['album_image'],
            'artist_image': artist_images.get(song['track']['artists'][0]['id'])
        } for song in selected_songs]

        room.selected_songs = formatted_songs
        return formatted_songs

    async def get_deezer_previews_batch(self, tracks: List[Dict]) -> List[Optional[str]]:
        """Fetch multiple Deezer previews concurrently"""
        async def fetch_single_preview(title: str, artist: str) -> Optional[str]:
            try:
                search_query = f"{title} {artist}".replace(' ', '+')
                async with aiohttp.ClientSession() as session:
                    async with session.get(f"https://api.deezer.com/search?q={search_query}") as response:
                        if response.status == 200:
                            data = await response.json()
                            if data.get('data') and len(data['data']) > 0:
                                return data['data'][0].get('preview')
            except Exception as e:
                print(f"Deezer API error for {title} - {artist}: {str(e)}")
            return None

        tasks = [
            fetch_single_preview(track['name'], track['artists'][0]['name'])
            for track in tracks
        ]
        return await asyncio.gather(*tasks)

game_service = GameService()