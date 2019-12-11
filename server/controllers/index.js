var path = require("path");
var express = require("express");
var router = express.Router();


router.get("/api", function(req, res) {
  res.json({ message: "Welcome to the backend project!" });
});

// Insert routes below

router.use("/api/camels", require("./camels"));

// All other routes redirect to the index.html
// router.route("/pro").get(function(req, res) {
//   res.sendfile(req.app.get("appPath") + "/profile.html");
// });

// router.route("/*").get(function(req, res) {
//   var relativeAppPath = req.app.get("appPath");
//   var absoluteAppPath = path.resolve(relativeAppPath);
//   res.sendFile(absoluteAppPath + "/profile.html");
// });

module.exports = router;
