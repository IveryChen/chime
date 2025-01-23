import React from "react";
import { MdReplay } from "react-icons/md";

import { theme } from "../../constants/constants";
import IconButton from "../../components/IconButton";

export default class ReplayButton extends React.PureComponent {
  render() {
    const { isPlaying, onReplay } = this.props;

    if (isPlaying) {
      return null;
    }

    return (
      <IconButton
        bg={theme.blue}
        Icon={MdReplay}
        justifySelf="center"
        label="Replay"
        onClick={onReplay}
      />
    );
  }
}
