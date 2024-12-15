import React from "react";
import { FaRegEye } from "react-icons/fa6";

import Box from "../../components/Box";
import Text from "../../components/Text";

export default class PlaylistTitle extends React.PureComponent {
  render() {
    const { data } = this.props;
    const { name, owner } = data;

    return (
      <Box display="grid" gridTemplateColumns="1fr auto">
        <Box>
          <Text fontSize={12} lineHeight={1} textTransform="uppercase">
            {name}
          </Text>
          <Text fontSize={10} fontWeight="regular" lineHeight={1}>
            {owner.display_name}
          </Text>
        </Box>
        <Box as={FaRegEye} size={12} />
      </Box>
    );
  }
}
