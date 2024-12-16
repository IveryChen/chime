import styled from "@emotion/styled";
import React from "react";

import Box from "../../components/Box";
import { theme } from "../../constants/constants";

const StyledBox = styled(Box)`
  backdrop-filter: blur(1px);
`;

export default class Modal extends React.PureComponent {
  render() {
    const { isOpen, onClose, children } = this.props;

    if (!isOpen) return null;

    return (
      <StyledBox
        alignItems="center"
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
          bg={theme.lightgray}
          borderStyle="solid"
          borderRadius="8px"
          maxHeight="90%"
          maxWidth="90%"
          onClick={(e) => e.stopPropagation()}
          overflow="auto"
          p="16px"
        >
          {children}
        </Box>
      </StyledBox>
    );
  }
}
