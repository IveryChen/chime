import React from "react";

import Box from "../../components/Box";
import Text from "../../components/Text";

export default class IconButton extends React.PureComponent {
  longPressTimer = null;
  pressStartTime = null;
  isPressed = false;

  handleStartPress = (e) => {
    const { disabled, onLongPress } = this.props;
    if (disabled || !onLongPress) return;

    this.isPressed = true;
    this.pressStartTime = Date.now();
    this.longPressTimer = setTimeout(() => {
      onLongPress();
    }, 800);
  };

  handleEndPress = () => {
    if (!this.isPressed) return;

    const { disabled, onClick, onLongPressEnd } = this.props;

    clearTimeout(this.longPressTimer);

    if (!this.pressStartTime) return;

    const pressDuration = Date.now() - this.pressStartTime;
    this.pressStartTime = null;
    this.isPressed = false;

    if (pressDuration >= 800) {
      // Was a long press
      if (onLongPressEnd) {
        onLongPressEnd();
      }
    } else if (!disabled && onClick && pressDuration < 300) {
      // Was a quick click
      onClick();
    }
  };

  handleLeave = () => {
    if (this.isPressed) {
      this.handleEndPress();
    }
  };

  componentWillUnmount() {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
    }
  }

  render() {
    const {
      disabled,
      Icon,
      label,
      onClick,
      onLongPress,
      onLongPressEnd,
      ...restProps
    } = this.props;

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
        onMouseDown={(e) => {
          e.preventDefault();
          this.handleStartPress(e);
        }}
        onMouseUp={this.handleEndPress}
        onMouseLeave={this.handleLeave}
        onTouchStart={(e) => {
          e.preventDefault();
          this.handleStartPress(e);
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
          this.handleEndPress();
        }}
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
