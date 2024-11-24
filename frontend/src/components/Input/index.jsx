import React from "react";

import Box from "../Box";

export default class Input extends React.PureComponent {
  handleChange = (e) => {
    const value = this.props.toUpperCase
      ? e.target.value.toUpperCase()
      : e.target.value;
    this.props.onChange(value);
  };

  render() {
    const { value, placeholder, required = true } = this.props;

    return (
      <Box>
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={this.handleChange}
          required={required}
        />
      </Box>
    );
  }
}
