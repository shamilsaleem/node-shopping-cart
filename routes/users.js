var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.redirect("/");
});

router.get("/login", function (req, res, next) {
  res.render("users/login", { admin: false, login:true});
});

router.get("/signup", function (req, res, next) {
  res.render("users/signup", { admin: false, login:true});
});

module.exports = router;
