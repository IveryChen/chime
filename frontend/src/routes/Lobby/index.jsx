import { Component } from "react";
import { Async } from "react-async";
import spotifyApi from "../../library/spotify";

const loadUserProfile = async () => {
  try {
    const userData = await spotifyApi.getMe();
    return userData;
  } catch (error) {
    throw new Error("Failed to load user profile", error);
  }
};

export default class Lobby extends Component {
  render() {
    return (
      <Async promiseFn={loadUserProfile}>
        {({ data: user, error, isPending }) => {
          if (isPending) return <div>Loading...</div>;
          if (error) return <div>Error: {error.message}</div>;
          if (!user) return <div>No user data found</div>;

          return (
            <div>
              {user.images?.[0]?.url && (
                <img src={user.images[0].url} alt="Profile" />
              )}
              <p>{user.display_name}</p>
            </div>
          );
        }}
      </Async>
    );
  }
}
