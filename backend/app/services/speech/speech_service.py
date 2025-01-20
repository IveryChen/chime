import speech_recognition as sr
from typing import Optional

class SpeechService:
    def __init__(self):
        self.recognizer = sr.Recognizer()
        # Can adjust recognition sensitivity
        self.recognizer.energy_threshold = 300
        self.recognizer.dynamic_energy_threshold = True
        
    def transcribe_audio(self, audio_data) -> Optional[str]:
        """
        Transcribe audio data to text using Google Speech Recognition
        Returns None if transcription fails
        """
        try:
            text = self.recognizer.recognize_google(audio_data)
            print(f"Transcribed text: {text}")
            return text
        except sr.UnknownValueError:
            print("Google Speech Recognition could not understand audio")
            return None
        except sr.RequestError as e:
            print(f"Could not request results from Google Speech Recognition service; {e}")
            return None

    async def listen_and_transcribe(self) -> Optional[str]:
        """
        Listen for speech and transcribe it to text
        Returns None if no speech detected or transcription fails
        """
        try:
            with sr.Microphone() as source:
                print("Listening...")
                audio = self.recognizer.listen(source, timeout=5, phrase_time_limit=10)
                return self.transcribe_audio(audio)
        except Exception as e:
            print(f"Error during audio capture: {e}")
            return None

speech_service = SpeechService()