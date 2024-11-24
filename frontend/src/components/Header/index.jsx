import { branch } from "baobab-react/higher-order";
import { Component } from "react";

import Box from "../../components/Box";

class Header extends Component {
  render() {
    const { children, user } = this.props;

    return (
      <Box display="grid" gridTemplateColumns="1fr auto">
        {children}
        {user && (
          <Box
            alt="Profile"
            as="img"
            borderRadius="50%"
            borderStyle="solid"
            borderWidth={1}
            size={48}
            src={user.images[0].url}
          />
        )}
      </Box>
    );
  }
}

export default branch({ user: ["user"] }, Header);
