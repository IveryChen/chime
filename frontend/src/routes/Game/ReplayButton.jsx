import React from "react";
import { MdReplay } from "react-icons/md";

import { theme } from "../../constants/constants";
import IconButton from "../../components/IconButton";

export default class ReplayButton extends React.PureComponent {
  render() {
    const { isPlaying, onReplay, showPlay } = this.props;

    if (isPlaying) {
      return null;
    }

    return (
      <IconButton
        bg={theme.blue}
        Icon={showPlay ? null : MdReplay}
        justifySelf="center"
        label={showPlay ? "Play" : "Replay"}
        onClick={onReplay}
        userSelection="none"
      />
    );
  }
}
