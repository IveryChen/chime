import React from "react";
import { Async } from "react-async";
import { LiaMicrophoneSolid } from "react-icons/lia";
import RecordRTC from "recordrtc";

import { theme } from "../../constants/constants";
import Box from "../../components/Box";
import IconButton from "../../components/IconButton";
import Input from "../../components/Input";
import API_URL from "../../constants/apiUrl";

import socketService from "../../services/socket";

export default class Guess extends React.PureComponent {
  state = { artist: "", isListening: false, title: "" };

  onChangeArtist = (artist) => this.setState({ artist });

  onChangeIsListening = () =>
    this.setState({ isListening: !this.state.isListening });

  onChangeTitle = (title) => this.setState({ title });

  handleStartRecording = async () => {
    this.setState({ isListening: true });
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.recorder = new RecordRTC(this.stream, {
        type: "audio",
        mimeType: "audio/wav",
        recorderType: RecordRTC.StereoAudioRecorder,
      });
      this.recorder.startRecording();
    } catch (error) {
      console.error("Microphone access error:", error);
      this.setState({
        isListening: false,
        error: "Could not access microphone",
      });
    }
  };

  handleStopRecording = async () => {
    if (!this.recorder) return;

    this.recorder.stopRecording(async () => {
      const blob = this.recorder.getBlob();
      this.stream.getTracks().forEach((track) => track.stop());

      const formData = new FormData();
      formData.append("audio", blob, "recording.wav");

      try {
        const response = await fetch(`${API_URL}/game/speech-to-text`, {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        if (data.text) {
          const { gameState, roomCode } = this.props;
          const playerId = gameState?.currentPlayer?.id;

          socketService.emit("submit_voice_guess", {
            roomCode,
            playerId,
            voiceInput: data.text,
          });
        }
      } catch (error) {
        console.error("Speech to text error:", error);
        this.setState({ error: "Failed to process voice input" });
      }

      this.setState({ isListening: false });
    });
  };

  handleSubmitGuess = async () => {
    const { gameState, onChangeAnswer, roomCode } = this.props;
    const { artist, title } = this.state;
    const playerId = gameState?.currentPlayer?.id;

    socketService.emit("submit_score", {
      roomCode,
      playerId,
      guess: {
        artist,
        title,
      },
    });

    onChangeAnswer(true);

    this.setState({
      artist: "",
      title: "",
    });
  };

  render() {
    const { gameState } = this.props;
    const { artist, isListening, title } = this.state;

    if (!gameState) {
      return null;
    }

    return (
      <Box
        bg="white"
        borderRadius="24px"
        borderStyle="solid"
        borderWidth={1}
        display="grid"
        gap="16px"
        p="16px"
      >
        <Box display="grid" gap="8px">
          <Input
            background={theme.lightgray}
            label="TITLE"
            onChange={this.onChangeTitle}
            value={title}
          />
          <Input
            background={theme.lightgray}
            label="ARTIST"
            onChange={this.onChangeArtist}
            value={artist}
          />
        </Box>
        <Box display="flex" justifyContent="space-between">
          <IconButton
            bg={theme.blue}
            disabled={isListening}
            Icon={LiaMicrophoneSolid}
            justifySelf="end"
            label={isListening ? "Listening..." : "SPEAK TO GUESS"}
            onClick={this.onChangeIsListening}
            onLongPress={this.handleStartRecording}
            onLongPressEnd={this.handleStopRecording}
          />
          <Async deferFn={this.handleSubmitGuess}>
            {({ isPending, run }) => (
              <IconButton
                bg={theme.blue}
                disabled={isPending}
                label="SUBMIT"
                justifySelf="end"
                onClick={run}
              />
            )}
          </Async>
        </Box>
      </Box>
    );
  }
}
