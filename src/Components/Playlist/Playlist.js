import React, { Component } from "react";

export class Playlist extends Component {
  render() {
    return (
      <div class="Playlist">
        <input value="New Playlist" />
        <Tracklist />
        <button class="Playlist-save">SAVE TO SPOTIFY</button>
      </div>
    );
  }
}

export default Playlist;
