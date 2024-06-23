var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.redirect("/");
});

router.get("/login", function (req, res, next) {
  res.render("users/login", {login:true});
});

router.get("/signup", function (req, res, next) {
  res.render("users/signup", {login:true});
});

module.exports = router;
