import { Component } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import SpotifyAuth from "./components/SpotifyAuth";

import Home from "./routes/Home";
import Lobby from "./routes/Lobby";

import "./App.css";

export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SpotifyAuth />} />
          <Route path="/home" element={<Home />} />
          <Route path="/lobby" element={<Lobby />} />
        </Routes>
        <h1>Hi</h1>
      </BrowserRouter>
    );
  }
}
