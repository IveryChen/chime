import { map } from "lodash";
import React from "react";

import Box from "../Box";
import Modal from "../Modal";
import Text from "../Text";

export default class PlaylistModal extends React.PureComponent {
  render() {
    const { data, isOpen, onClose } = this.props;

    if (!data) {
      return null;
    }

    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <Box display="grid" gap="16px">
          <Text fontSize={20} fontWeight="bold">
            Playlist Tracks
          </Text>
          {map(data, ({ track }, index) => {
            const { artists, name } = track;

            return (
              <Box
                key={index}
                borderBottom="1px solid"
                borderColor="gray.200"
                paddingBottom="12px"
              >
                <Text fontSize={16} fontWeight="medium">
                  {name}
                </Text>
                <Box display="flex" gap="4px">
                  {map(artists, (artist, artistIndex) => (
                    <React.Fragment key={artist.id || artistIndex}>
                      <Text color="gray.600" fontSize={14}>
                        {artist.name}
                      </Text>
                      {artistIndex < artists.length - 1 && (
                        <Text color="gray.600" fontSize={14}>
                          •
                        </Text>
                      )}
                    </React.Fragment>
                  ))}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Modal>
    );
  }
}
