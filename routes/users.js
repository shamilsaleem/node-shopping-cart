var express = require("express");
var router = express.Router();
var userHelpers = require("../helpers/user-helpers");
var orderHelpers = require("../helpers/order-helpers");
var constants = require("../essentials/constants");

// User validation
const validateUser = (req, res, next) => {
  if (req.session.user) next();
  else res.redirect("/users/login");
};

router.get("/", function (req, res, next) {
  res.redirect("/");
});

router.get("/login", function (req, res, next) {
  if (req.session.user) res.redirect("/");
  else res.render("users/login", { login: true });
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
  if (req.session.user) res.redirect("/users/logout");
  else res.render("users/signup", { login: true });
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
    qty: req.body.qty,
  };
  userHelpers
    .addToCart(data)
    .then((data) => res.send(data))
    .catch((data) => res.send(data));
});

// Cart
router.get("/cart", validateUser, async function (req, res, next) {
  var userData = await userHelpers.getUserData(req.session.userData);
  userHelpers
    .getAllProductsInUserCart(req.session.userData)
    .then((data) => {
      res.render("users/cart", {
        title: constants["project-name"],
        userName: userData.name,
        products: data.cartProducts,
        cartSum: data.cartSum,
      });
    })
    .catch((err) => {
      if (err.noProductsInCart) {
        res.render("users/message", {
          title: constants["project-name"],
          userName: userData.name,
          message: "No products in the cart",
        });
      }
    });
});

//Place order
router.get("/placeorder", validateUser, async function (req, res, next) {
  var userData = await userHelpers.getUserData(req.session.userData);
  userHelpers
    .getAllProductsInUserCart(req.session.userData)
    .then((data) => {
      res.render("users/placeOrder", {
        userName: userData.name,
        products: data.cartProducts,
        cartSum: data.cartSum,
      });
    })
    .catch((err) => {
      if (err.noProductsInCart) {
        res.render("users/message", {
          title: constants["project-name"],
          userName: userData.name,
          message: "No products in the cart",
        });
      }
    });
});

router.post("/placeorder", validateUser, function (req, res, next) {
  var paymentmethod = req.body.paymentmethod;
  delete req.body.paymentmethod;

  if (paymentmethod == "cod") {
    orderHelpers
      .placeOrder(req.session.userData, paymentmethod, req.body)
      .then(() => res.redirect("/"));
  } else {
    res.redirect("/users/cart");
  }
});

// Orders route
router.get("/orders", validateUser, async function (req, res, next) {
  var userData = await userHelpers.getUserData(req.session.userData);
  orderHelpers
    .getAllOrdersByAUser(req.session.userData)
    .then((orders) => {
      res.render("users/orders", {
        userName: userData.name,
        title: constants["project-name"],
        layout: "layout",
        orders,
      });
    })
    .catch(() => {
      res.render("users/message", {
        title: constants["project-name"],
        userName: userData.name,
        message: "You have no orders",
      });
    });
});

// User Logout
router.get("/logout", function (req, res, next) {
  req.session.destroy(() => res.redirect("/"));
});

module.exports = router;
