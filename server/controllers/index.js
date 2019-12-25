var path = require('path'); 
require('dotenv').config();

var express = require("express");
var router = express.Router();
var request = require('request'); // "Request" library

var querystring = require('querystring');

var SpotifyWebApi = require('spotify-web-api-node');
var scopes = 'playlist-modify-public user-modify-playback-state user-read-playback-state user-read-private user-read-email playlist-modify-private playlist-read-collaborative user-read-currently-playing';


var spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

// random nummbers from 1 to max
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

  //  application requests authorization
  router.get('/login', function(req, res) {
    res.redirect('https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id:process.env.SPOTIFY_CLIENT_ID,
        scope: scopes,
        redirect_uri:process.env.SPOTIFY_REDIRECT_URI
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
     console.log(spotifyApi.getAccessToken());
      res.redirect('/Chat.html');
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
// play the song randomly in the selected palylist
router.get('/playlist/:name', async (req,res) => {
  try {
    var name = req.params.name;
    var resultOfplaylists = await spotifyApi.searchPlaylists(name)
    //console.log(resultOfplaylists.body.playlists.items[0].id);
    var playlistOne_id=resultOfplaylists.body.playlists.items[0].id;
    console.log(resultOfplaylists.body.playlists.items[0].name);
    var result = await spotifyApi.getPlaylistTracks(playlistOne_id);
 // the length of the playlist
console.log(result.body.items.length);
    // get all avalible devices 
    // var myDevice_id = await spotifyApi.getMyDevices();
    // console.log(myDevice_id.body.devices[0].id);
   
    var a =  await  spotifyApi.play({uris:[`spotify:track:${result.body.items[getRandomInt(result.body.items.length)].track.id}`]});
    

    res.status(200).send(result.body);
  } catch (err) {
    res.status(400).send(err)
  }
});


// for testign ...
router.get('/play', async (req,res) => {
  try {
  
    const id = '54flyrjcdnQdco7300avMJ';
    var result = await  spotifyApi.play({uris:[`spotify:track:${id}`]});

    console.log(result.body);
    res.status(200).send(result.body);
  } catch (err) {
    res.status(400).send(err)
  }
});






//All other routes redirect to the index.html
// router.route("/pro").get(function(req, res) {
//   res.sendfile(req.app.get("appPath") + "/Chat.html");
// });

router.route("/*").get(function(req, res) {
  var relativeAppPath = req.app.get("appPath");
  var absoluteAppPath = path.resolve(relativeAppPath);
  res.sendFile(absoluteAppPath + "/Login.html");
});


module.exports = router;
