var express = require("express");
var router = express.Router();
var userHelpers = require("../helpers/user-helpers");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.redirect("/");
});

router.get("/login", function (req, res, next) {
  res.render("users/login", { login: true });
});

router.get("/signup", function (req, res, next) {
  res.render("users/signup", { login: true });
});

router.post("/signup", function (req, res, next) {
  userHelpers
    .addUser(req.body)
    .then(() => res.redirect("/users/login"))
    .catch(() => res.redirect("/users/signup"));
});

module.exports = router;
