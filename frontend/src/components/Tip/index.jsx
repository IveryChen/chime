import styled from "@emotion/styled";
import React from "react";

import Box from "../Box";
import Text from "../Text";

const TooltipContainer = styled(Box)`
  &:hover .tooltip {
    opacity: 1;
    visibility: visible;
  }
`;

const positions = {
  bottom: { bottom: "-16px" },
  center: { top: "0px" },
  top: { top: "-16px" },
};

class Tip extends React.PureComponent {
  render() {
    const {
      children,
      position = "bottom",
      tooltipText,
      ...restProps
    } = this.props;

    return (
      <TooltipContainer
        alignItems="center"
        cursor="pointer"
        display="flex"
        gap="4px"
        justifyContent="center"
        position="relative"
        {...restProps}
      >
        {children}
        <Text
          bg="black"
          borderRadius="4px"
          className="tooltip"
          color="white"
          fontSize="12px"
          fontWeight="normal"
          left="50%"
          lineHeight={1}
          opacity={0}
          p="2px 4px"
          position="absolute"
          transform="translateX(-50%)"
          transition="all 0.2s ease"
          visibility="hidden"
          whiteSpace="nowrap"
          zIndex={1}
          {...positions[position]}
        >
          {tooltipText}
        </Text>
      </TooltipContainer>
    );
  }
}

export default Tip;
