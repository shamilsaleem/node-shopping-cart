var express = require("express");
var router = express.Router();
var userHelpers = require("../helpers/user-helpers");

// User validation
const validateUser = (req, res, next) => {
  if (req.session.user) next();
  else res.redirect("/users/login");
};

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
    .catch((err) => {
      console.log(err);
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

// Adding product to cart
router.post("/addtocart", validateUser, function (req, res, next) {
  var data = {
    productId: req.body.productId,
    userId: req.session.userData,
  };
  userHelpers.addToCart(data);
});

// User Logout
router.get("/logout", function (req, res, next) {
  req.session.destroy(() => res.redirect("/"));
});

module.exports = router;
