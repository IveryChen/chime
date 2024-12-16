import styled from "@emotion/styled";
import React from "react";

import Box from "../../components/Box";
import { theme } from "../../constants/constants";

const StyledBox = styled(Box)`
  backdrop-filter: blur(4px);
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
          borderRadius="8px"
          borderStyle="solid"
          maxHeight="80%"
          onClick={(e) => e.stopPropagation()}
          overflow="auto"
          p="16px"
          width="90%"
        >
          {children}
        </Box>
      </StyledBox>
    );
  }
}
