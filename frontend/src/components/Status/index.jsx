import { map } from "lodash";
import React from "react";

import theme from "../../constants/colours";

import Box from "../Box";

const NUM_ROUNDS = [1, 2, 3, 4, 5];

export default class Status extends React.PureComponent {
  render() {
    const { data } = this.props;

    return (
      <Box display="flex" gap="2px">
        {map(NUM_ROUNDS, (_, index) => (
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
