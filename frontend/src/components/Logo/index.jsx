import { Component } from "react";

import Box from "../../components/Box";
import Text from "../../components/Text";

export default class Logo extends Component {
  onClick = () => (window.location.href = "/");

  render() {
    return (
      <Box cursor="pointer" onClick={this.onClick}>
        <Text fontFamily="Oswald" fontSize={16} lineHeight={1}>
          CASSETTE
        </Text>
        <Text fontSize={16}>盒式磁帶</Text>
      </Box>
    );
  }
}
