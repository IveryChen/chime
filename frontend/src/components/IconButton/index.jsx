import React from "react";

import Box from "../../components/Box";
import Text from "../../components/Text";

export default class IconButton extends React.PureComponent {
  render() {
    const { Icon, disabled, onClick, label, ...restProps } = this.props;
    return (
      <Box
        alignItems="center"
        borderRadius="16px"
        borderStyle="solid"
        borderWidth={1}
        cursor="pointer"
        display="grid"
        gap="6px"
        gridTemplateColumns={Icon ? "auto 1fr" : "1fr"}
        onClick={onClick}
        opacity={disabled ? 0.6 : 1}
        px="8px"
        py="6px"
        {...restProps}
      >
        <Text fontFamily="Bebas Neue" fontSize="24px" lineHeight={1} pt="2px">
          {label}
        </Text>
        {Icon && <Box as={Icon} size={20} />}
      </Box>
    );
  }
}
