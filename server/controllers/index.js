var path = require('path'); 
require('dotenv').config();

var express = require("express");
var router = express.Router();
var request = require('request'); // "Request" library

var querystring = require('querystring');

var SpotifyWebApi = require('spotify-web-api-node');
scopes = ['user-read-private', 'user-read-email','playlist-modify-public','playlist-modify-private']


var spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: 'http://localhost:8888/callback',
});







  // your application requests authorization

  router.get('/login', function(req, res) {
    res.redirect('https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scopes,
        redirect_uri:redirect_uri
      }))
  });
  
  router.get('/callback', async (req,res) => {
    const { code } = req.query;
    console.log(code)
    try {
      var data = await spotifyApi.authorizationCodeGrant(code)
      const { access_token, refresh_token } = data.body;
      spotifyApi.setAccessToken(access_token);
      spotifyApi.setRefreshToken(refresh_token);
     // redirect to another page 
      res.redirect('http://localhost:8888/');
    } catch(err) {
      res.redirect('/#/error/invalid token');
    }
  });

  // Insert routes below
  
  router.get('/userinfo', async (req,res) => {
    try {
      var result = await spotifyApi.getMe();
      console.log(result.body);
      res.status(200).send(result.body)
    } catch (err) {
      res.status(400).send(err)
    }
});

router.get('/userPlaylists', async (req,res) => {
  try {
    var result = await spotifyApi.getUserPlaylists();
    console.log(result.body);
    res.status(200).send(result.body);
  } catch (err) {
    res.status(400).send(err)
  }
});

// retrive the playlist by the name, then get all tracks in the playlist
router.get('/playlist/:name', async (req,res) => {
  try {
    var name = req.params.name;
    var resultOfplaylists = await spotifyApi.searchPlaylists(name)
    console.log(resultOfplaylists.body.playlists.items[0].id);
    var playlistOne_id=resultOfplaylists.body.playlists.items[0].id;

    var result = await spotifyApi.getPlaylistTracks(playlistOne_id);

    res.status(200).send(result.body);
  } catch (err) {
    res.status(400).send(err)
  }
});



//All other routes redirect to the index.html
router.route("/pro").get(function(req, res) {
  res.sendfile(req.app.get("appPath") + "/Login.html");
});

router.route("/*").get(function(req, res) {
  var relativeAppPath = req.app.get("appPath");
  var absoluteAppPath = path.resolve(relativeAppPath);
  res.sendFile(absoluteAppPath + "/Login.html");
});


module.exports = router;
