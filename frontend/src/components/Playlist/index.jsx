import React from "react";

import Box from "../../components/Box";
import Text from "../../components/Text";

export default class Playlist extends React.PureComponent {
  render() {
    const { data } = this.props;
    const { images, name, owner } = data;

    return (
      <Box>
        {images && (
          <Box
            alt="Profile"
            as="img"
            aspectRatio={1}
            borderStyle="solid"
            borderWidth={1}
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
