var express = require("express");
var router = express.Router();
var path = require("path");
var constants = require("../essentials/constants");
var productHelpers = require("../helpers/product-helpers");

/* GET home page. */
router.get("/", function (req, res, next) {
  productHelpers.getAllProducts().then((products) => {
    res.render("users/index", { title: constants["project-name"], products });
  });
});

module.exports = router;
