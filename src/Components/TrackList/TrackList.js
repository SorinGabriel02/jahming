import React, { Component } from "react";
import { Track } from "../Track/Track";
import "./TrackList.css";

export class TrackList extends Component {
  render() {
    //map method that renders a set of Track components
    return (
      <div className="TrackList">
        <Track />
        <Track />
        <Track />
      </div>
    );
  }
}

export default TrackList;
