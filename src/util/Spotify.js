let accessToken;
const clientId = "4e62d4d448b242788914756e4bc76e88";
const redirectUri = "http://localhost:3000/";

// This module is a utility service to integration Jahming application with spotify APIs
const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    } else {
      // get spotify access token
      const accessTokenMatch = window.location.href.match(
        /access_token=([^&]*)/
      );
      const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
      if (accessTokenMatch && expiresInMatch) {
        accessToken = accessTokenMatch[1];
        const expiresIn = Number(expiresInMatch[1]);
        window.setTimeout(() => (accessToken = ""), expiresIn * 1000);
        window.history.pushState("Access Token", null, "/");
        return accessToken;
      } else {
        // For the 1st time access, need to set response type to playlist-modify-private in order to create the playlist
        window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-private&redirect_uri=${redirectUri}`;
      }
    }
  },

  // method to get search result from spotify search API
  search(term) {
    // get access token
    accessToken = Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then(response => {
        // check if the response is successful for the API call
        if (response.ok) {
          return response.json();
        }
        throw new Error("Request failed!");
      })
      .then(jsonResponse => {
        // get tracks from item list
        if (!jsonResponse.tracks.items) {
          // if nothing is returned, return an empty array
          return [];
        } else {
          // get search results back and map them to track structure for later display
          return jsonResponse.tracks.items.map(track => ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri,
            preview: track.preview_url
          }));
        }
      });
  },

  // method to save identified playlist to spotify
  savePlaylist(playlistName, trackUris) {
    // get access token
    const accessToken = Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };
    let userId = "";
    let playlistId = "";

    // only call spotify API if playlist name and the tracks to save are available
    if (playlistName && trackUris) {
      //get userID from spotify through spotify API
      return fetch(`https://api.spotify.com/v1/me`, { headers: headers })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            console.log("failed to get userID");
          }
        })
        .then(jsonResponse => {
          // get the userID from current session in order to save the list for the user
          if (jsonResponse.id) {
            userId = jsonResponse.id;
          }
          // create a new playlist through spotify API
          return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
            headers: headers,
            method: "POST",
            body: JSON.stringify({ name: playlistName })
          })
            .then(response => {
              // verify if the playlist is created successfully on Spotify
              if (response.ok) {
                return response.json();
              } else {
                console.log("failed create new playlist");
              }
            })
            .then(jsonResponse => {
              // get the newly created list ID from response
              if (jsonResponse.id) {
                playlistId = jsonResponse.id;
              }
              // add playlist to the newly created spotify playlist
              return fetch(
                `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,
                {
                  headers: headers,
                  method: "POST",
                  body: JSON.stringify({ uris: trackUris })
                }
              );
            });
        });
    }
  }
};

export default Spotify;
