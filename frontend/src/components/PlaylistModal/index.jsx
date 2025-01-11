import { map } from "lodash";
import { intersperse } from "ramda";
import React from "react";

import Box from "../Box";
import Modal from "../Modal";
import Text from "../Text";

export default class PlaylistModal extends React.PureComponent {
  render() {
    const { data, isOpen, onClose, playlist } = this.props;

    if (!data) {
      return null;
    }

    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <Box display="grid" gap="16px">
          <Text fontSize={20} fontWeight="bold">
            {playlist.name}
          </Text>
          {map(data, ({ track }, index) => {
            const { album, artists, name } = track;
            const dot = <Text fontSize={12}>•</Text>;
            const artistsWithDots = intersperse(
              dot,
              map(artists, (artist) => (
                <Text
                  flexShrink={0}
                  fontWeight="medium"
                  fontSize={12}
                  key={artist.name}
                >
                  {artist.name}
                </Text>
              ))
            );

            return (
              <Box
                alignItems="center"
                display="grid"
                gap="8px"
                gridTemplateColumns="16px auto 1fr"
                key={index}
              >
                <Text justifySelf="center">
                  {index < 9 ? `0${index + 1}` : index + 1}
                </Text>
                <Box
                  alt={album.name}
                  as="img"
                  aspectRatio={1}
                  borderStyle="solid"
                  borderWidth={1}
                  src={album.images[0].url}
                  size={32}
                />
                <Box display="grid" overflow="hidden">
                  <Text
                    fontSize={12}
                    fontWeight="bold"
                    textTransform="uppercase"
                    truncate
                  >
                    {name}
                  </Text>
                  <Box display="flex" gap="4px" overflow="auto">
                    {artistsWithDots}
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Modal>
    );
  }
}
