var path = require('path'); 

var express = require("express");
var router = express.Router();
var request = require('request'); // "Request" library

var querystring = require('querystring');


var client_id = process.env.SPOTIFY_CLIENT_ID; // Your client id
var client_secret = process.env.SPOTIFY_CLIENT_SECRET; // Your secret
var redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri

// router.get("/api", function(req, res) {

//   console.log(process.env.SPOTIFY_CLIENT_SECRET);
//   console.log( process.env.MONGODB_URI );
//   res.json({ message: "Welcome to the backend project!" });
// });



// Insert routes below

//router.use("/api/camels", require("./camels"));

//router.get('/login', function(req, res) {

  // var state = generateRandomString(16);
  // res.cookie(stateKey, state);

  // your application requests authorization
  
router.get('/login', function(req, res) {
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: 'user-read-private user-read-email',
      redirect_uri:redirect_uri
    }))
});


// router.get('/callback', function(req, res) {

//   // your application requests refresh and access tokens
//   // after checking the state parameter

//   var code = req.query.code || null;
//   var state = req.query.state || null;
//   var storedState = req.cookies ? req.cookies[stateKey] : null;

//   if (state === null || state !== storedState) {
//     res.redirect('/#' +
//       querystring.stringify({
//         error: 'state_mismatch'
//       }));
//   } else {
//     res.clearCookie(stateKey);
//     var authOptions = {
//       url: 'https://accounts.spotify.com/api/token',
//       form: {
//         code: code,
//         redirect_uri: redirect_uri,
//         grant_type: 'authorization_code'
//       },
//       headers: {
//         'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
//       },
//       json: true
//     };

//     request.post(authOptions, function(error, response, body) {
//       if (!error && response.statusCode === 200) {

//         var access_token = body.access_token,
//             refresh_token = body.refresh_token;

//         var options = {
//           url: 'https://api.spotify.com/v1/me',
//           headers: { 'Authorization': 'Bearer ' + access_token },
//           json: true
//         };

//         // use the access token to access the Spotify Web API
      

//         // we can also pass the token to the browser to make requests from there
//         res.redirect('/#' +
//           querystring.stringify({
//             access_token: access_token,
//             refresh_token: refresh_token
//           }));
//       } else {
//         res.redirect('/#' +
//           querystring.stringify({
//             error: 'invalid_token'
//           }));
//       }
//     });
//   }
// });

router.get('/callback', function(req, res) {
  let code = req.query.code || null
  let authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(
        client_id + ':' + client_secret
      ).toString('base64'))
    },
    json: true
  }



  request.post(authOptions, function(error, response, body) {

    var access_token = body.access_token
    // reddirect the page to the next >> 
    let uri = 'http://localhost:8888/'
    res.redirect(uri + '?access_token=' + access_token)

    var options = {
                 url: 'https://api.spotify.com/v1/me',
                 headers: { 'Authorization': 'Bearer ' + access_token },
                 json: true
               };

               request.get(options, function(error, response, body) {
                console.log(body);
              });
      

  });

  
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
