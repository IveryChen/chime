import { includes } from "lodash";
import React from "react";

import Box from "../../components/Box";
import Text from "../../components/Text";

export default class Playlist extends React.PureComponent {
  onClick = () => this.props.onChangeSelectedPlaylists(this.props.data.id);

  render() {
    const { data, selectedPlaylists } = this.props;
    const { id, images, name, owner } = data;
    const isSelected = includes(selectedPlaylists, id);

    return (
      <Box onClick={this.onClick}>
        {images && (
          <Box
            alt="Profile"
            as="img"
            aspectRatio={1}
            borderColor={isSelected ? "red" : "black"}
            borderStyle="solid"
            borderWidth={isSelected ? 2 : 1}
            src={images[0].url}
            width="100%"
          />
        )}
        <Text fontSize={12} lineHeight={1} textTransform="uppercase">
          {name}
        </Text>
        <Text fontSize={10} fontWeight="regular" lineHeight={1}>
          {owner.display_name}
        </Text>
      </Box>
    );
  }
}
