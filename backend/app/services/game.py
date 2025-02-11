import random
import string
from typing import Dict, List, Optional
from app.schemas.game import GameRoom, Player
import uuid
import spotipy
import requests
import aiohttp
import asyncio
import re
from fuzzywuzzy import fuzz

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

    def join_room(self, room_code: str, player_name: str, spotify_token: str = None) -> GameRoom:
        if room_code not in self.rooms:
            raise ValueError("Room not found")

        room = self.rooms[room_code]
        if room.status != "waiting":
            raise ValueError("Game already in progress")

        for existing_player in room.players:
            if existing_player.name == player_name:
                return room

        new_player = self.create_player(name=player_name, spotify_token=spotify_token)
        room.players.append(new_player)
        return room

    def get_room(self, room_code: str) -> GameRoom:
        if room_code not in self.rooms:
            raise ValueError(f"Room with code {room_code} not found")
        return self.rooms[room_code]

    async def select_songs_for_game(self, room_code: str, num_rounds: int = 5) -> List[Dict]:
        room = self.get_room(room_code)
        num_songs_needed = len(room.players) * num_rounds

        filtered_songs = await self.get_filtered_tracks(room)

        valid_songs = [song for song in filtered_songs if song['track'].get('preview_url')]
        assert len(valid_songs) >= num_songs_needed, "Not enough songs - this should have been caught earlier"

        selected_songs = random.sample(valid_songs, num_songs_needed)

        sp = spotipy.Spotify(auth=room.players[0].spotify_token)

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
            'preview_type': 'deezer',
            'preview_url': song['track'].get('preview_url'),
            'uri': song['track'].get('uri'),
            'popularity': song['track']['popularity'],
            'album_image': song['track']['album_image'],
            'artist_image': artist_images.get(song['track']['artists'][0]['id'])
        } for song in selected_songs]

        room.selected_songs = formatted_songs
        return formatted_songs

    async def get_deezer_previews_batch(self, tracks: List[Dict]) -> List[Optional[str]]:
        async def fetch_single_preview(title: str, artist: str) -> Optional[str]:
            try:
                # Clean title and artist
                clean_title = re.sub(r'\([^)]*\)|feat\.[^,]*', '', title).strip()
                clean_artist = re.sub(r'\([^)]*\)', '', artist).strip()

                search_query = f"{clean_title} {clean_artist}".replace(' ', '+')

                async with aiohttp.ClientSession() as session:
                    async with session.get(f"https://api.deezer.com/search?q={search_query}") as response:
                        if response.status == 200:
                            data = await response.json()
                            if data.get('data'):
                                # Find best match using fuzzy matching
                                best_match = None
                                highest_score = 0

                                for track in data['data'][:5]:  # Check top 5 results
                                    title_score = fuzz.ratio(clean_title.lower(), track['title'].lower())
                                    artist_score = fuzz.ratio(clean_artist.lower(), track['artist']['name'].lower())
                                    avg_score = (title_score + artist_score) / 2

                                    if avg_score > highest_score and avg_score > 75:  # Threshold of 75%
                                        highest_score = avg_score
                                        best_match = track

                                return best_match['preview'] if best_match else None

            except Exception as e:
                print(f"Deezer API error for {title} - {artist}: {str(e)}")
            return None

        tasks = [
            fetch_single_preview(track['name'], track['artists'][0]['name'])
            for track in tracks
        ]
        return await asyncio.gather(*tasks)

    async def count_available_songs(self, room_code: str) -> int:
        """Count how many playable songs are available"""
        room = self.get_room(room_code)
        filtered_songs = await self.get_filtered_tracks(room)
        seen_ids = set()
        valid_songs = 0
        for song in filtered_songs:
            song_id = song['track']['id']
            if song['track'].get('preview_url') and song_id not in seen_ids:
                seen_ids.add(song_id)
                valid_songs += 1

        return valid_songs


    async def get_filtered_tracks(self, room: GameRoom) -> List[Dict]:
        all_tracks = []
        min_songs_needed = len(room.players) * 5
        batch_size = 50  # Spotify's limit per request

        for player in room.players:
            if not player.selected_playlists:
                continue

            sp = spotipy.Spotify(auth=player.spotify_token)

            for playlist_id in player.selected_playlists:
                try:
                    offset = 0
                    while True:
                        # Fetch tracks in smaller batches
                        if playlist_id == "liked_songs":
                            results = sp.current_user_saved_tracks(limit=batch_size, offset=offset)
                        else:
                            results = sp.playlist_tracks(playlist_id, limit=batch_size, offset=offset)
                        
                        tracks = results['items']
                        track_ids = [
                            track['track']['id'] for track in tracks
                            if track.get('track') and track['track'].get('id')
                        ]

                        # Get track details and previews for this batch
                        if track_ids:
                            full_tracks = sp.tracks(track_ids)['tracks']
                            tracks_info = []
                            for track in full_tracks:
                                if track['popularity'] >= 20:  # Initial filter
                                    tracks_info.append({
                                        'id': track['id'],
                                        'name': track['name'],
                                        'artists': track['artists'],
                                        'popularity': track.get('popularity', 0),
                                        'album_image': track['album']['images'][0]['url'] if track['album']['images'] else None
                                    })

                        # Only get Deezer previews if we need more songs
                        if len(all_tracks) < min_songs_needed:
                            preview_urls = await self.get_deezer_previews_batch(tracks_info)
                            
                            for track_info, preview_url in zip(tracks_info, preview_urls):
                                if preview_url:
                                    track_info['preview_type'] = 'deezer'
                                    track_info['preview_url'] = preview_url
                                    all_tracks.append({'track': track_info})
                                    
                                    # If we have enough songs, stop fetching
                                    if len(all_tracks) >= min_songs_needed * 1.5:  # Get a few extra for safety
                                        return all_tracks

                        # Check if we need to fetch more
                        if not results['next'] or len(all_tracks) >= min_songs_needed * 1.5:
                            break
                        
                        offset += batch_size

                except Exception as e:
                    print(f"Error fetching playlist {playlist_id}: {str(e)}")
                    continue

        return all_tracks

game_service = GameService()