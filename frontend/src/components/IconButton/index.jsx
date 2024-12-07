import React from "react";

import Box from "../../components/Box";
import Text from "../../components/Text";

export default class IconButton extends React.PureComponent {
  render() {
    const { Icon, disabled, onClick, label, ...restProps } = this.props;
    return (
      <Text
        alignItems="center"
        borderRadius="16px"
        borderStyle="solid"
        borderWidth={1}
        cursor="pointer"
        display="grid"
        fontFamily="Bebas Neue"
        fontSize="24px"
        gap="6px"
        gridTemplateColumns={Icon ? "auto 1fr" : "1fr"}
        lineHeight={1}
        onClick={onClick}
        opacity={disabled ? 0.6 : 1}
        px="8px"
        py="6px"
        {...restProps}
      >
        {label}
        {Icon && <Box as={Icon} size={20} />}
      </Text>
    );
  }
}
