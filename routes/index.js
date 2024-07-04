var express = require("express");
var router = express.Router();
var path = require("path");
var constants = require("../essentials/constants");
var productHelpers = require("../helpers/product-helpers");
var userHelpers = require("../helpers/user-helpers");

/* GET home page. */
router.get("/", async function (req, res, next) {
  if (req.session.user) {
    var userData = await userHelpers.getUserData(req.session.userData);
    productHelpers.getAllProducts().then((products) => {
      userHelpers
        .getProductsNoInUserCart(req.session.userData)
        .then((productCount) => {
          res.render("users/index", {
            title: constants["project-name"],
            products,
            productCount,
            userName: userData.name,
          });
        });
    });
  } else {
    productHelpers.getAllProducts().then((products) => {
      res.render("users/index", {
        title: constants["project-name"],
        products,
        productCount: 0,
        userName: false,
      });
    });
  }
});

module.exports = router;
