import React from "react";
import Box from "../../components/Box";

export default class Modal extends React.PureComponent {
  render() {
    const { isOpen, onClose, children } = this.props;
    if (!isOpen) return null;

    return (
      <Box
        alignItems="center"
        bg="rgba(0, 0, 0, 0.5)"
        bottom={0}
        display="flex"
        justifyContent="center"
        left={0}
        onClick={onClose}
        position="fixed"
        right={0}
        top={0}
      >
        <Box
          bg="white"
          borderRadius="8px"
          maxHeight="80vh"
          maxWidth={500}
          onClick={(e) => e.stopPropagation()}
          overflow="auto"
          p="20px"
        >
          {children}
        </Box>
      </Box>
    );
  }
}
