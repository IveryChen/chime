import { map } from "lodash";
import React from "react";

import { numRounds, theme } from "../../constants/constants";

import Box from "../Box";

export default class Status extends React.PureComponent {
  render() {
    const { data } = this.props;

    return (
      <Box display="flex" gap="2px">
        {map(numRounds, (_, index) => (
          <Box
            bg={index < data ? theme.green : theme.gray}
            borderRadius="50%"
            borderStyle="solid"
            borderWidth={1}
            key={index}
            size={8}
          />
        ))}
      </Box>
    );
  }
}
