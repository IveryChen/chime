import React from "react";
import { MdReplay } from "react-icons/md";

import { theme } from "../../constants/constants";
import IconButton from "../../components/IconButton";

import playSnippet from "./playSnippet";

export default class ReplayButton extends React.PureComponent {
  onClick = () =>
    playSnippet(
      this.props.deviceId,
      this.props.spotifyPlayer,
      this.props.currentSongUri
    );

  render() {
    return (
      <IconButton
        bg={theme.blue}
        Icon={MdReplay}
        justifySelf="end"
        label="Replay"
        onClick={this.onClick}
      />
    );
  }
}