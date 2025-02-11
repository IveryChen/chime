import React from "react";
import { FaRegEye } from "react-icons/fa6";

import Box from "../../components/Box";
import Text from "../../components/Text";

export default class PlaylistTitle extends React.PureComponent {
  onClick = () => {
    this.props.run();
    this.props.onChangeCurrentPlaylistId(this.props.data.id);
  };

  render() {
    const { data, disabled, currentPlaylistId } = this.props;
    const { id, name, owner } = data;
    const isSelected = currentPlaylistId === id;
    const color = isSelected ? "red" : "black";

    return (
      <Box
        cursor="pointer"
        display="grid"
        onClick={this.onClick}
        opacity={disabled ? 0.5 : 1}
      >
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
