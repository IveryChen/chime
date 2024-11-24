import React from "react";

import Box from "../../components/Box";
import Text from "../../components/Text";

export default class IconButton extends React.PureComponent {
  render() {
    const { Icon, label, ...restProps } = this.props;
    return (
      <Box display="grid" gap="16px">
        <Text
          alignItems="center"
          borderRadius="16px"
          borderStyle="solid"
          borderWidth={1}
          display="flex"
          fontFamily="Bebas Neue"
          fontSize="24px"
          gap="6px"
          lineHeight={1}
          p="8px"
          {...restProps}
        >
          {label}
          {Icon && <Box as={Icon} size={20} />}
        </Text>
      </Box>
    );
  }
}