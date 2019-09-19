import React, { Component } from "react";
import "./SearchBar.css";
import Spotify from "../../util/Spotify";

export class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      term: ""
    };

    this.search = this.search.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
  }

  search(term) {
    this.props.onSearch(this.state.term);
  }

  handleTermChange(e) {
    this.setState({ term: e.target.value });
  }

  handleEnter(e) {
    if (e.keyCode === 13) {
      // perform same method as search button click
      this.setState({ term: e.target.value });
      this.search(this.state.term);
    }
  }

  handleClick() {
    Spotify.getAccessToken();
  }

  render() {
    return (
      <div className="SearchBar">
        <input
          autoFocus
          placeholder="Song, Album, or Artist"
          onChange={this.handleTermChange}
          onKeyDown={this.handleEnter}
          onClick={this.handleClick}
        />
        <button className="SearchButton" onClick={this.search}>
          SEARCH
        </button>
      </div>
    );
  }
}
