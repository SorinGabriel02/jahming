import React, { Component } from "react";
import { SearchBar } from "../SearchBar/SearchBar";
import { SearchResults } from "../SearchResults/SearchResults";
import { Playlist } from "../Playlist/Playlist";
import Spotify from "../../util/Spotify";
import "./App.css";

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: "New Playlist",
      playlistTracks: []
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    Spotify.getAccessToken();
  }
  //method that adds tracks to the playlist
  addTrack(track) {
    let playlistTracks = this.state.playlistTracks;
    if (playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    }
    playlistTracks.unshift(track);
    this.setState({ playlistTracks: playlistTracks });
  }

  //method that removes tracks from the playlist
  removeTrack(track) {
    let tracks = this.state.playlistTracks;
    tracks.splice(tracks.indexOf(track), 1);
    //tracks = tracks.filter(currentTrack => currentTrack.id !== track.id);
    this.setState({ playlistTracks: tracks });
  }

  updatePlaylistName(name) {
    this.setState({ playlistName: name });
  }

  savePlaylist() {
    const trackUris = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackUris).then(() =>
      this.setState({ playlistName: "Jahming Playlist", playlistTracks: [] })
    );
  }

  //updates searchResults with a user's search results
  search(term) {
    Spotify.search(term).then(searchResults =>
      this.setState({ searchResults: searchResults })
    );
  }

  goSpotify() {
    window.open("https://open.spotify.com/browse/featured");
  }

  render() {
    return (
      <div>
        <div className="header">
          <h1>
            <span className="highlight">Jah</span>ming
          </h1>
          <h4 className="spotify" onClick={this.goSpotify}>
            VISIT SPOTIFY
          </h4>
        </div>

        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults
              searchResults={this.state.searchResults}
              onAdd={this.addTrack}
            />
            <Playlist
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
