import { root } from "baobab-react/higher-order";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import FontLoader from "./components/FontLoader";
import SpotifyAuth from "./components/SpotifyAuth";

import Home from "./routes/Home";
import Lobby from "./routes/Lobby";
import Game from "./routes/Game";
import state from "./state";

import "./App.css";

class App extends React.PureComponent {
  render() {
    return (
      <FontLoader>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lobby" element={<Lobby />} />
            <Route path="/spotify-auth" element={<SpotifyAuth />} />
            <Route path="/game/:roomCode" element={<Game />} />
          </Routes>
        </BrowserRouter>
      </FontLoader>
    );
  }
}
export default root(state, App);
