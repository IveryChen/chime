import React from "react";
import { FaRegEye } from "react-icons/fa6";

import Box from "../../components/Box";
import Text from "../../components/Text";
import { theme } from "../../constants/constants";

export default class PlaylistTitle extends React.PureComponent {
  onClick = () => {
    this.props.run();
    this.props.onChangePlaylistDetails(this.props.data.id);
  };

  render() {
    const { data, disabled, playlistDetails } = this.props;
    const { id, name, owner } = data;
    const isSelected = playlistDetails === id;
    const color = isSelected ? theme.blue : disabled ? "gray" : "black";

    return (
      <Box cursor="pointer" display="grid" onClick={this.onClick}>
        <Box display="flex" gap="4px">
          <Text
            color={color}
            fontSize={12}
            lineHeight={1}
            textTransform="uppercase"
          >
            {name}
          </Text>
          <Box as={FaRegEye} color={color} flexShrink={0} size={12} />
        </Box>
        <Text color={color} fontSize={10} fontWeight="regular" lineHeight={1}>
          {owner.display_name}
        </Text>
      </Box>
    );
  }
}
