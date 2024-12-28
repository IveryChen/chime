import random
import string
from typing import Dict, List, Optional
from app.schemas.game import GameRoom, Player
import uuid
import spotipy
import requests

class GameService:
    def __init__(self):
        self.rooms: Dict[str, GameRoom] = {}

    def generate_room_code(self) -> str:
        return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

    def generate_color(self) -> str:
            return f"#{random.randint(0, 0xFFFFFF):06x}"

    def create_player(self, name: str, spotify_token: str, is_host: bool = False) -> Player:
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

    def join_room(self, room_code: str, player_name: str, spotify_token: str) -> GameRoom:
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

                        for track in full_tracks:
                            playback_info = {
                                'id': track['id'],
                                'name': track['name'],
                                'artists': [artist['name'] for artist in track['artists']],
                                'popularity': track.get('popularity', 0)
                            }

                            # Try Spotify preview first
                            if track.get('preview_url'):
                                playback_info['preview_type'] = 'spotify_preview'
                                playback_info['preview_url'] = track['preview_url']
                                all_tracks.append({'track': playback_info})
                                continue

                            # If Premium, add track for SDK playback
                            if is_premium:
                                playback_info['preview_type'] = 'spotify_sdk'
                                playback_info['uri'] = track['uri']
                                all_tracks.append({'track': playback_info})
                                continue

                            # Try Deezer as last resort
                            try:
                                deezer_preview = await self.get_deezer_preview(
                                    track['name'],
                                    track['artists'][0]['name']
                                )
                                if deezer_preview:
                                    playback_info['preview_type'] = 'deezer'
                                    playback_info['preview_url'] = deezer_preview
                                    all_tracks.append({'track': playback_info})
                            except Exception as e:
                                print(f"Deezer lookup failed for {track['name']}: {str(e)}")

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

        formatted_songs = [{
            'id': song['track']['id'],
            'name': song['track']['name'],
            'artists': song['track']['artists'],
            'preview_type': song['track']['preview_type'],
            'preview_url': song['track'].get('preview_url'),
            'uri': song['track'].get('uri'),
            'popularity': song['track']['popularity']
        } for song in selected_songs]

        room.selected_songs = formatted_songs
        return formatted_songs

    def get_deezer_preview(self, title: str, artist: str) -> Optional[str]:
        """
        Search for a track on Deezer and return its preview URL.
        """
        try:
            search_query = f"{title} {artist}".replace(' ', '+')
            response = requests.get(f"https://api.deezer.com/search?q={search_query}")
            if response.status_code == 200:
                data = response.json()
                if data.get('data') and len(data['data']) > 0:
                    return data['data'][0].get('preview')
        except Exception as e:
            print(f"Deezer API error: {str(e)}")
        return None

game_service = GameService()