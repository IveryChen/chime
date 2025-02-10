import { branch } from "baobab-react/higher-order";
import { Component } from "react";

import { theme } from "../../constants/constants";
import { withRouter } from "../../utils/withRouter";
import Box from "../Box";
import Text from "../Text";

class Header extends Component {
  state = { isDropdownOpen: false };

  handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  toggleDropdown = () => {
    this.setState((prevState) => ({
      isDropdownOpen: !prevState.isDropdownOpen,
    }));
  };

  render() {
    const { children, user } = this.props;
    const { isDropdownOpen } = this.state;

    const hasProfileImage =
      user && user.images && user.images[0] && user.images[0].url;

    return (
      <Box display="grid" gridTemplateColumns="1fr auto" height={42}>
        {children}
        {hasProfileImage && (
          <Box position="relative">
            <Box
              alt="Profile"
              as="img"
              borderRadius="50%"
              borderStyle="solid"
              borderWidth={1}
              onClick={this.toggleDropdown}
              size={42}
              src={user.images[0].url}
            />

            {isDropdownOpen && (
              <Box
                bg="white"
                borderRadius="8px"
                borderStyle="solid"
                borderWidth={1}
                cursor="pointer"
                display="grid"
                justifyContent="center"
                onClick={this.handleLogout}
                position="absolute"
                right={0}
                top="100%"
                width={64}
                zIndex={1}
              >
                <Text color={theme.darkgray} fontSize="12px">
                  Logout
                </Text>
              </Box>
            )}
          </Box>
        )}
      </Box>
    );
  }
}

export default withRouter(branch({ user: ["user"] }, Header));
