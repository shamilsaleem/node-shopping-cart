var express = require("express");
var router = express.Router();
var userHelpers = require("../helpers/user-helpers");

router.get("/", function (req, res, next) {
  res.redirect("/");
});

router.get("/login", function (req, res, next) {
  res.render("users/login", { login: true });
});

router.post("/login", function (req, res, next) {
  userHelpers
    .doUserLogin(req.body)
    .then((userData) => {
      req.session.user = true;
      req.session.userData = userData._id;
      res.redirect("/");
    })
    .catch((err) =>{
      console.log(err)
      res.redirect("/users/login");
    });
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

// User Logout
router.get("/logout", function (req, res, next) {
  req.session.destroy(() => res.redirect("/"));
});

module.exports = router;
