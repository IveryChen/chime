import { Component } from "react";
import { Navigate } from "react-router-dom";
import { Async } from "react-async";

import handleAuth from "../../api/handleAuth";

export default class SpotifyAuth extends Component {
  render() {
    return (
      <Async promiseFn={handleAuth}>
        {({ data, error, isPending }) => {
          if (isPending) {
            return <div>Loading...</div>;
          }

          if (error) {
            return <div>Error: {error.message}</div>;
          }

          if (data?.isAuthenticated) {
            return <Navigate to="/lobby" replace />;
          }

          if (data?.redirectToLogin) {
            return <div>Redirecting to Spotify login...</div>;
          }

          return <div>Initializing...</div>;
        }}
      </Async>
    );
  }
}
