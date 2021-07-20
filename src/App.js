import React, { useState, useEffect } from 'react';
import './App.css';

const axios = require('axios');

function App() {

  const [access_token, set_access_token] = useState(null);
  const [query, set_query] = useState('');
  const [tracks, set_tracks] = useState([]);

  const LoginButton = () => {

    let client_id = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
    let scope = 'playlist-modify-private';
    let redirect_uri = 'http://localhost:3000';

    let spotify_url = 'https://accounts.spotify.com/authorize';
        spotify_url += '?response_type=token';
        spotify_url += '&client_id=' + encodeURIComponent(client_id);
        spotify_url += '&scope=' + encodeURIComponent(scope);
        spotify_url += '&redirect_uri=' + encodeURIComponent(redirect_uri);

    return (
      <a href={spotify_url} className="bg-spotify_main hover:bg-gray-600 w-60 rounded-full text-white font-medium px-1 py-1 flex cursor-pointer justify-center align-middle">
        LOG IN WITH SPOTIFY
      </a>
    );
  }

  const Form = () => {
    return (
      <div className="w-full">
        <input
          onChange={(event) => {set_query(event.target.value)}}
          value={query} type="text"
          className="bg-gray-200 px-2 py-1 rounded-bl rounded-tl w-80 mb-3"
          placeholder="Type anything..."></input>
        <button onClick={() => {handleClick()}} className="bg-spotify_main hover:bg-gray-600 px-2 py-1 mb-3 text-white rounded-br rounded-tr"><i className="fa fa-search"></i></button>
      </div>
    );
  }

  

  function handleClick() {
    try {
      let url = 'https://api.spotify.com/v1/search?q='+query+'&type=track,artist';
      axios.get(url, {
        headers: {
          'Authorization': 'Bearer ' + access_token
        },
      })
      .then(res => {
        set_tracks(res.data.tracks.items);
      })
    } catch (err) {
      console.error(err);
    } finally {
      console.log(tracks);
    }
  }

  function getHashParams() {
    let hashParams = {};
    let e, r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  useEffect(() => {
    let params = getHashParams()
    let token = params.access_token;
    set_access_token(token);
  });

  return (
    <>
      <LoginButton/>
      <Form/>
    </>
  );
}

export default App;
