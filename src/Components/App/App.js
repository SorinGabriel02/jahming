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
  }
  //method that adds tracks to the playlist
  addTrack(track) {
    let tracks = this.state.playlistTracks;
    /* long  if version
    if (tracks.find(savedTrack => 
      savedTrack.id === track.id)) {
      return;
    } 
    */
    if (!tracks.includes(track.id)) {
      tracks.unshift(track);
      this.setState({ playlistTracks: tracks });
    }
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
      this.setState({ playlistName: "New Playlist", playlistTracks: [] })
    );
  }

  //updates searchResults with a user's search results
  search(term) {
    Spotify.search(term).then(searchResults =>
      this.setState({ searchResults: searchResults })
    );
  }

  render() {
    return (
      <div>
        <h1>
          <span className="highlight">Jah</span>ming
        </h1>
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
