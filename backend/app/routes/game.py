from fastapi import APIRouter, UploadFile, File, HTTPException
from app.schemas.game import CreateRoomRequest, JoinRoomRequest, GameRoom
from app.services.game import game_service
from typing import Dict
import speech_recognition as sr
import tempfile
import os
import wave

router = APIRouter()

@router.post("/create-room")
async def create_room(request: CreateRoomRequest) -> GameRoom:
    try:
        room = game_service.create_room(
            host_name=request.host_name,
            spotify_token=request.spotify_token
        )
        return room
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/join-room")
async def join_room(request: JoinRoomRequest) -> GameRoom:
    try:
        room = game_service.join_room(
            room_code=request.room_code,
            player_name=request.player_name,
            spotify_token=request.spotify_token
        )
        return room
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/speech-to-text")
async def speech_to_text(audio: UploadFile = File(...)):
    try:
        print(f"Received file: {audio.filename}, content_type: {audio.content_type}")

        # Create temp file
        with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as temp_audio:
            # Read and write the uploaded file
            contents = await audio.read()
            print(f"Read {len(contents)} bytes")
            temp_audio.write(contents)
            temp_audio_path = temp_audio.name
            print(f"Saved to: {temp_audio_path}")

        try:
            # First verify if it's a valid WAV file
            try:
                with wave.open(temp_audio_path, 'rb') as wave_file:
                    print(f"WAV file details: channels={wave_file.getnchannels()}, "
                          f"width={wave_file.getsampwidth()}, "
                          f"rate={wave_file.getframerate()}")
            except Exception as wave_error:
                print(f"Not a valid WAV file: {str(wave_error)}")
                raise HTTPException(status_code=400, detail="Invalid WAV file format")

            # Do speech recognition
            recognizer = sr.Recognizer()
            with sr.AudioFile(temp_audio_path) as source:
                print("Reading audio file...")
                audio_data = recognizer.record(source)
                print("Transcribing...")
                text = recognizer.recognize_google(audio_data)
                print(f"Transcribed text: {text}")
                return {"text": text}

        except sr.UnknownValueError:
            print("Could not understand audio")
            raise HTTPException(status_code=400, detail="Could not understand audio")
        except sr.RequestError as e:
            print(f"Recognition error: {str(e)}")
            raise HTTPException(status_code=400, detail=f"Recognition error: {str(e)}")
        finally:
            os.unlink(temp_audio_path)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))