import React from "react";
import "./App.css";

function App() {
  return (
    <>
      <h1>
        <span className="highlight">Jah</span>ming
      </h1>
      <div className="App">
        <SearchBar />
        <div className="App-playlist">
          <SearchResults />
          <Playlist />
        </div>
      </div>
    </>
  );
}

export default App;
