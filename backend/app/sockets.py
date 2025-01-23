from app.services.game import game_service
from app.schemas.game import Player, GameState
from datetime import datetime
import random
from fuzzywuzzy import fuzz
from typing import Dict, Tuple, List

def to_camel_case(snake_str):
    components = snake_str.split('_')
    return components[0] + ''.join(x.title() for x in components[1:])

def convert_to_camel_case(obj):
    if isinstance(obj, dict):
        return {to_camel_case(k): convert_to_camel_case(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_to_camel_case(item) for item in obj]
    return obj

def register_sio_events(sio):
    @sio.event
    async def connect(sid, environ):
        print(f"Client connected: {sid}")

    @sio.event
    async def disconnect(sid):
        print(f"Client disconnected: {sid}")
        # Find the room and player associated with this sid
        for room_code, room in game_service.rooms.items():
            for player in room.players:
                if player.socket_id == sid:
                    room.players.remove(player)
                    await sio.emit('players-update', {'players': [p.dict() for p in room.players]}, room=room_code)
                    break

    async def join_room_handler(sid, data):
        try:
            room_code = data['roomCode']
            player = data['player']

            room = game_service.join_room(room_code, player['name'], player['spotify_token'])
            print("Room joined successfully")

            for p in room.players:
                if p.name == player['name']:
                    p.socket_id = sid
                    break

            await sio.enter_room(sid, room_code)
            await sio.emit('players-update',
                {'players': [p.dict() for p in room.players]},
                room=room_code
            )

        except ValueError as e:
            print(f"Game error: {str(e)}")
            await sio.emit('error', {'message': str(e)}, room=sid)

    sio.on('join-room', join_room_handler)

    def validate_guess(guess: str, current_song: Dict) -> Tuple[bool, bool]:
        """
        Validate a guess against the current song.
        Returns tuple of (is_artist_correct, is_title_correct)
        """
        threshold = 70  # Equivalent to 0.7 in frontend

        # Check artist match
        artist_scores = [
            fuzz.ratio(guess.lower(), artist.lower())
            for artist in current_song['artists']
        ]
        is_artist_correct = max(artist_scores, default=0) >= threshold

        # Check title match
        title_score = fuzz.ratio(guess.lower(), current_song['title'].lower())
        is_title_correct = title_score >= threshold

        return is_artist_correct, is_title_correct

    def calculate_match_scores(text: str, artist_names: list, title: str) -> Tuple[float, float]:
        """
        Calculates similarity scores of input text against artist names and song title.
        Returns the highest match score for each category.
        """
        artist_score = max(
            (fuzz.ratio(text.lower(), artist.lower()) for artist in artist_names),
            default=0  # Ensure it doesn't break if artist_names is empty
        )
        title_score = fuzz.ratio(text.lower(), title.lower())

        return artist_score, title_score

    def find_matching_phrases(text: str, current_song: Dict) -> List[str]:
        """
        Find phrases in the input that match parts of the song title or artist names
        """
        # Get all possible phrases to match against
        phrases_to_match = [current_song['title']] + current_song['artists']

        # Normalize everything for comparison
        text = text.lower()
        phrases_to_match = [p.lower() for p in phrases_to_match]

        # Find any matching substrings
        matches = []
        words = text.split()

        # Try different word combinations
        for i in range(len(words)):
            for j in range(i + 1, len(words) + 1):
                phrase = " ".join(words[i:j])
                # Check if this phrase is similar to any song title or artist name
                for target in phrases_to_match:
                    if fuzz.ratio(phrase, target) > 80:  # High threshold for matches
                        matches.append(phrase)

        return sorted(set(matches), key=len, reverse=True)

    def validate_voice_guess(voice_input: str, current_song: Dict) -> Tuple[str, str, bool, bool]:
        print(f"Processing voice input: '{voice_input}'")
        print(f"Actual song - Artists: {current_song['artists']}, Title: {current_song['title']}")

        matching_phrases = find_matching_phrases(voice_input, current_song)
        print(f"Found matching phrases: {matching_phrases}")

        threshold = 85
        best_artist_match = None
        best_title_match = None
        best_artist_score = 0
        best_title_score = 0

        for phrase in matching_phrases:
            artist_score, title_score = calculate_match_scores(
                phrase,
                current_song['artists'],
                current_song['title']
            )

            # Track best artist match
            if artist_score > best_artist_score:
                best_artist_score = artist_score
                best_artist_match = phrase

            # Track best title match
            if title_score > best_title_score:
                best_title_score = title_score
                best_title_match = phrase

        # If no good match is found, fall back to the entire voice input
        final_artist = best_artist_match if best_artist_score >= threshold else voice_input
        final_title = best_title_match if best_title_score >= threshold else voice_input

        return final_artist, final_title, best_artist_score >= threshold, best_title_score >= threshold

    @sio.event
    async def submit_score(sid, data):
        try:
            room_code = data['roomCode']
            player_id = data['playerId']
            guess = data.get('guess', {})

            room = game_service.get_room(room_code)
            current_song = room.game_state.current_song

            artist_correct, _ = validate_guess(guess.get('artist', ''), current_song)
            _, title_correct = validate_guess(guess.get('title', ''), current_song)

            score = (artist_correct + title_correct) * 100

            room.game_state.scores[player_id] += score
            room.game_state.show_answer = True

            await sio.emit('score_update', {
                'scores': room.game_state.scores,
                'lastGuess': {
                    'playerId': player_id,
                    'guess': {
                        'artist': guess.get('artist', ''),
                        'title': guess.get('title', ''),
                        'isArtistCorrect': artist_correct,
                        'isTitleCorrect': title_correct
                    }
                },
                'showAnswer': True
            }, room=room_code)

        except Exception as e:
            print(f"Error submitting score: {e}")
            await sio.emit('error', {'message': str(e)}, room=sid)

    @sio.event
    async def submit_voice_guess(sid, data):
        try:
            room_code = data['roomCode']
            player_id = data['playerId']
            voice_input = data['voiceInput']

            room = game_service.get_room(room_code)
            current_song = room.game_state.current_song

            artist_guess, title_guess, artist_correct, title_correct = validate_voice_guess(
                voice_input,
                current_song
            )

            print( artist_guess, title_guess, artist_correct, title_correct )

            # Calculate score
            score = 0
            if artist_correct:
                score += 100
            if title_correct:
                score += 100

            # Format guess data
            formatted_guess = {
                'artist': artist_guess,
                'title': title_guess,
                'isArtistCorrect': artist_correct,
                'isTitleCorrect': title_correct,
            }

            # Update player's score
            room.game_state.scores[player_id] += score

            # Emit score update to all players
            await sio.emit('score_update', {
                'scores': room.game_state.scores,
                'lastGuess': {
                    'playerId': player_id,
                    'guess': formatted_guess
                }
            }, room=room_code)

        except Exception as e:
            print(f"Error processing voice guess: {str(e)}")
            await sio.emit('error', {'message': str(e)}, room=sid)

    @sio.event
    async def update_room_status(sid, data):
        try:
            room_code = data['roomCode']
            status = data['status']

            room = game_service.get_room(room_code)
            if room:
                room.status = status
                print(f"Updated room {room_code} status to: {status}")

                # Broadcast the status update to all players in the room
                await sio.emit('room-status-update', {
                    'status': status
                }, room=room_code)

                # Also include status in players-update for backwards compatibility
                await sio.emit('players-update', {
                    'players': [p.dict() for p in room.players],
                    'status': status
                }, room=room_code)

        except Exception as e:
            print(f"Error updating room status: {str(e)}")
            await sio.emit('error', {
                'message': f"Error updating room status: {str(e)}"
            }, room=sid)

    sio.on('update_room_status', update_room_status)

    @sio.event
    async def leave_room(sid, data):
        room_code = data['roomCode']
        if room_code in game_service.rooms:
            room = game_service.rooms[room_code]
            room.players = [p for p in room.players if p.socket_id != sid]
            await sio.leave_room(sid, room_code)
            await sio.emit('players-update', {'players': [p.dict() for p in room.players]}, room=room_code)
            if len(room.players) == 0:
                del game_service.rooms[room_code]

    @sio.event
    async def select_playlists(sid, data):
        try:
            room_code = data['roomCode']
            player_id = data['playerId']
            playlist_ids = data['playlistIds']

            room = game_service.get_room(room_code)

            # Find the host player
            host_player = next((player for player in room.players if player.is_host), None)

            # Only process if the request is from the host
            if host_player and player_id == host_player.id:
                host_player.selected_playlists = playlist_ids

                num_songs_needed = len(room.players) * 5
                available_songs = await game_service.count_available_songs(room_code)

                if available_songs < num_songs_needed:
                    await sio.emit('playlist_error', {
                        'message': f'Not enough songs with previews. Need {num_songs_needed}, found {available_songs}. Please select more playlists.',
                        'songs_needed': num_songs_needed,
                        'songs_available': available_songs
                    }, room=room_code)
                    return

                # Update room status to loading
                room.status = "loading_songs"
                print(f"Room status updated to: {room.status}")

                # Notify all players that playlists were submitted
                await sio.emit('playlist_submitted', {
                    'player_id': player_id,
                    'submitted': True
                }, room=room_code)

                # Update all players about the status change
                await sio.emit('players-update', {
                    'players': [p.dict() for p in room.players],
                    'status': room.status
                }, room=room_code)

                try:
                    # Select songs for the game
                    selected_songs = await game_service.select_songs_for_game(room_code)
                    print(f"Selected {len(selected_songs)} songs for the game")

                    room.status = "playing"

                    # Notify all players that songs are selected and game can begin
                    await sio.emit('all_playlists_submitted', {
                        'status': 'success',
                        'selectedSongs': selected_songs
                    }, room=room_code)

                    # Final status update
                    await sio.emit('players-update', {
                        'players': [p.dict() for p in room.players],
                        'status': room.status
                    }, room=room_code)

                except ValueError as e:
                    print(f"Error selecting songs: {str(e)}")
                    await sio.emit('error', {
                        'message': f"Error selecting songs: {str(e)}"
                    }, room=room_code)
                    return

        except Exception as e:
            print(f"Error in select_playlists: {str(e)}")
            await sio.emit('error', {
                'message': f"Error processing playlist selection: {str(e)}"
            }, room=room_code)


    @sio.event
    async def request_play_snippet(sid, data):
        try:
            room_code = data['roomCode']
            room = game_service.get_room(room_code)
            print('request_play_snippet!!', room.game_state.current_song)
            current_song = room.game_state.current_song
            current_song_uri = current_song.get('preview_url') or current_song.get('uri') if current_song else None

            if current_song_uri:
                await sio.emit('play_snippet', {'currentSongUri': current_song_uri}, room=room_code)
        except Exception as e:
            print(f"Error in request_play_snippet: {e}")


    @sio.event
    async def initialize_game(sid, data):
        try:
            room_code = data['roomCode']
            room = game_service.get_room(room_code)

            if not room.game_state:
                current_player = next((p for p in room.players if p.socket_id == sid), None)

                if current_player:
                    other_players = [p for p in room.players if p.id != current_player.id]
                    random.shuffle(other_players)  # Shuffle others for random turn order
                    sorted_players = [current_player] + other_players
                    room.players = sorted_players  # Store sorted order
                else:
                    random.shuffle(room.players)

                first_player = room.players[0]
                first_song = random.choice(room.selected_songs) if room.selected_songs else None

                room.game_state = GameState(
                    current_round=1,
                    scores={p.id: 0 for p in room.players},
                    current_player=first_player,
                    current_song=first_song,
                    round_state={'used_songs': [first_song['id']] if first_song else []},
                    show_answer=False,
                    timestamp=datetime.now()
                )

            game_state_dict = room.game_state.dict()
            game_state_dict['timestamp'] = game_state_dict['timestamp'].isoformat()

            camel_case_game_state = convert_to_camel_case(game_state_dict)

            await sio.emit('game_state_update', {
                'gameState': camel_case_game_state
            }, room=room_code)

        except Exception as e:
            print(f"Error in initialize_game: {str(e)}")

    @sio.event
    async def start_new_round(sid, data):
        try:
            room_code = data['roomCode']
            room = game_service.get_room(room_code)

            if not room.game_state:
                raise ValueError("Game not initialized")

            used_songs = set(room.game_state.round_state.get('used_songs', []))
            current_song_id = room.game_state.current_song['id'] if room.game_state.current_song else None

            if current_song_id:
                used_songs.add(current_song_id)

            available_songs = [
                song for song in room.selected_songs
                if song['id'] not in used_songs
            ]

            # print(f"Current used songs: {room.game_state.round_state.get('used_songs', [])}")
            # print(f"Available song IDs: {[song['id'] for song in room.selected_songs]}")

            total_rounds = 5 * len(room.players)  # Or get from room.settings in the future

            if room.game_state.current_round >= total_rounds:
                room.status = "finished"
                room.game_state.is_game_over = True

                final_ranking = calculate_final_ranking(
                    room.game_state.scores,
                    room.players
                )

                game_state_dict = room.game_state.dict()
                game_state_dict['timestamp'] = game_state_dict['timestamp'].isoformat()
                camel_case_game_state = convert_to_camel_case(game_state_dict)

                await sio.emit('game_over', {
                    'scores': room.game_state.scores,
                    'finalRanking': final_ranking,
                    'gameState': camel_case_game_state
                }, room=room_code)
                return

            # Get next player
            current_player_index = room.players.index(room.game_state.current_player)
            next_player = room.players[(current_player_index + 1) % len(room.players)]

            if not available_songs:
                # Game is over - no more songs
                room.status = "finished"
                room.game_state.is_game_over = True

                final_ranking = calculate_final_ranking(
                    room.game_state.scores,
                    room.players
                )

                game_state_dict = room.game_state.dict()
                game_state_dict['timestamp'] = game_state_dict['timestamp'].isoformat()
                camel_case_game_state = convert_to_camel_case(game_state_dict)

                await sio.emit('game_over', {
                    'scores': room.game_state.scores,
                    'finalRanking': final_ranking,
                    'gameState': camel_case_game_state
                }, room=room_code)
                return

            next_song = random.choice(available_songs)
            room.game_state.round_state['used_songs'] = list(used_songs)

            # Update game state
            room.game_state.current_round += 1
            room.game_state.current_player = next_player
            room.game_state.current_song = next_song
            room.game_state.timestamp = datetime.now()
            room.game_state.show_answer = False

            game_state_dict = room.game_state.dict()
            game_state_dict['timestamp'] = game_state_dict['timestamp'].isoformat()
            camel_case_game_state = convert_to_camel_case(game_state_dict)

            await sio.emit('game_state_update', {
                'gameState': camel_case_game_state
            }, room=room_code)

        except Exception as e:
            print(f"Error starting new round: {str(e)}")
            await sio.emit('error', {'message': str(e)}, room=room_code)

    def calculate_final_ranking(scores: dict, players: list) -> list:
        # Create player lookup dictionary
        player_lookup = {player.id: player for player in players}
        
        # Create ranking with full player info
        ranking = [
            {
                'id': player_id,
                'name': player_lookup[player_id].name,
                'score': score,
                'avatar': player_lookup[player_id].avatar if hasattr(player_lookup[player_id], 'avatar') else None
            }
            for player_id, score in scores.items()
        ]
        
        # Sort by score in descending order
        ranking.sort(key=lambda x: x['score'], reverse=True)
        
        return ranking