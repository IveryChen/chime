import { root } from "baobab-react/higher-order";
import { Component } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import SpotifyAuth from "./components/SpotifyAuth";

import Home from "./routes/Home";
import Lobby from "./routes/Lobby";
import state from "./state";

import "./App.css";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lobby" element={<Lobby />} />
          <Route path="/spotify-auth" element={<SpotifyAuth />} />
        </Routes>
      </BrowserRouter>
    );
  }
}
export default root(state, App);
