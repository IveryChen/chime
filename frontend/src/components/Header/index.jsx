import { branch } from "baobab-react/higher-order";
import { Component } from "react";
import { PiUserLight } from "react-icons/pi";

import { theme } from "../../constants/constants";
import { withRouter } from "../../utils/withRouter";
import Box from "../Box";
import Text from "../Text";

class Header extends Component {
  state = { isDropdownOpen: false };

  handleLogout = () => {
    localStorage.removeItem("spotify_access_token");
    localStorage.clear();

    document.cookie.split(";").forEach((cookie) => {
      const name = cookie.split("=")[0].trim();
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.spotify.com`;
    });

    window.open("https://accounts.spotify.com/en/logout", "_blank");
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

    const profileImage =
      user && user.images && user.images[0] && user.images[0].url;

    return (
      <Box display="grid" gridTemplateColumns="1fr auto" height={42}>
        {children}
        <Box position="relative">
          {profileImage ? (
            <Box
              as="img"
              borderRadius="50%"
              borderStyle="solid"
              borderWidth={1}
              onClick={this.toggleDropdown}
              size={36}
              src={profileImage}
            />
          ) : (
            <Box
              as={PiUserLight}
              borderRadius="50%"
              borderStyle="solid"
              borderWidth={1}
              onClick={this.toggleDropdown}
              size={36}
            />
          )}
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
                Sign out
              </Text>
            </Box>
          )}
        </Box>
      </Box>
    );
  }
}

export default withRouter(branch({ user: ["user"] }, Header));
