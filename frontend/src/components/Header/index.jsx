import { branch } from "baobab-react/higher-order";
import { Component } from "react";

import Box from "../../components/Box";
import { withRouter } from "../../utils/withRouter";

class Header extends Component {
  render() {
    const { children, user } = this.props;

    const hasProfileImage =
      user && user.images && user.images[0] && user.images[0].url;

    return (
      <Box display="grid" gridTemplateColumns="1fr auto" height={42}>
        {children}
        {hasProfileImage && (
          <Box
            alt="Profile"
            as="img"
            borderRadius="50%"
            borderStyle="solid"
            borderWidth={1}
            size={42}
            src={user.images[0].url}
          />
        )}
      </Box>
    );
  }
}

export default withRouter(branch({ user: ["user"] }, Header));
