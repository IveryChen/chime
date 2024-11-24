import React from "react";
import { useParams } from "react-router-dom";
import { branch } from "baobab-react/higher-order";

function withRouter(Component) {
  return function ComponentWithRouter(props) {
    const params = useParams();
    return <Component {...props} params={params} />;
  };
}

class Game extends React.PureComponent {
  componentDidMount() {
    // const { roomCode } = this.props.params;
    // Connect to your multiplayer socket here using the roomCode
    // Example: socket.emit('join-room', roomCode);
  }

  componentWillUnmount() {
    // Cleanup socket connection when leaving
    // Example: socket.emit('leave-room', roomCode);
  }

  render() {
    const { roomCode } = this.props.params;

    return (
      <div>
        <h1>Game Room: {roomCode}</h1>
        {/* Your game UI */}
      </div>
    );
  }
}

// Export with both router and Baobab state
export default withRouter(
  branch(
    {
      user: ["user"],
      players: ["game", "players"],
      gameState: ["game", "state"],
    },
    Game
  )
);
