import { includes } from "lodash";
import React from "react";
import { FaRegEye } from "react-icons/fa6";
import { MdCheck } from "react-icons/md";

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
          <Box position="relative">
            <Box
              alt="Profile"
              as="img"
              aspectRatio={1}
              borderStyle="solid"
              borderWidth={1}
              src={images[0].url}
              width="100%"
            />
            {isSelected && (
              <Box
                alignContent="center"
                bg="white"
                borderRadius="50%"
                borderStyle="solid"
                borderWidth={1}
                display="grid"
                justifyContent="center"
                p={0}
                position="absolute"
                right={2}
                size={24}
                top={2}
              >
                <Box as={MdCheck} size={16} />
              </Box>
            )}
          </Box>
        )}
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
      </Box>
    );
  }
}
