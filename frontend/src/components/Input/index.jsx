import styled from "@emotion/styled";
import React from "react";

import Box from "../Box";
import Text from "../Text";

const StyledInput = styled.input`
  width: 100%;
  padding: ${(props) => props.padding || "16px"};
  border-color: ${(props) => props.borderColor || "black"};
  border-radius: ${(props) => props.borderRadius || "16px"};
  border-style: ${(props) => props.borderStyle || "solid"};
  border-width: ${(props) => props.borderWidth || "1px"};
  background: ${(props) => props.background || "transparent"};
  color: ${(props) => props.color || "black"};
  font-size: ${(props) => props.fontSize || "16px"};
  font-family: ${(props) => props.fontFamily || "inherit"};

  &::placeholder {
    color: ${(props) => props.placeholderColor || "#666"};
  }

  &:focus {
    outline: none;
    border-color: ${(props) => props.focusBorderColor || "#666"};
  }

  transition: all 0.2s ease-in-out;
`;

export default class Input extends React.PureComponent {
  handleChange = (e) => {
    const value = this.props.toUpperCase
      ? e.target.value.toUpperCase()
      : e.target.value;
    this.props.onChange(value);
  };

  render() {
    const {
      background,
      borderColor,
      borderRadius,
      borderStyle,
      borderWidth,
      color,
      focusBorderColor,
      fontFamily,
      fontSize,
      label,
      padding,
      placeholder,
      placeholderColor,
      required = true,
      value,
    } = this.props;

    return (
      <Box display="grid">
        {label && (
          <Text fontFamily="Bebas Neue" fontSize="24px" px="4px">
            {label}
          </Text>
        )}
        <StyledInput
          background={background}
          borderColor={borderColor}
          borderRadius={borderRadius}
          borderStyle={borderStyle}
          borderWidth={borderWidth}
          color={color}
          focusBorderColor={focusBorderColor}
          fontFamily={fontFamily}
          fontSize={fontSize}
          onChange={this.handleChange}
          padding={padding}
          placeholder={placeholder}
          placeholderColor={placeholderColor}
          required={required}
          type="text"
          value={value}
        />
      </Box>
    );
  }
}
