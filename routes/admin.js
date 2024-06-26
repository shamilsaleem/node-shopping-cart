var express = require("express");
var router = express.Router();
var path = require("path");
var constants = require("../essentials/constants");
var adminHelpers = require("../helpers/admin-helpers");
var productHelpers = require("../helpers/product-helpers");

router.get("/", function (req, res, next) {
  if (req.session.admin) {
    adminHelpers
      .doAdminLogin(req.session.adminData)
      .then(() => {
        productHelpers
          .getAllProducts()
          .then((products) => {
            res.render("admin/home", {
              title: constants["project-name"],
              layout: "layout-admin",
              products,
            });
          })
          .catch(() => {
            res.render("admin/noProducts", { layout: "layout-admin" });
          });
      })
      .catch(() => {
        res.render("admin/login", {
          title: constants["project-name"],
          layout: "layout-admin",
          login: true,
        });
      });
  } else {
    res.render("admin/login", {
      layout: "layout-admin",
      login: true,
    });
  }
});

router.post("/", function (req, res, next) {
  adminHelpers
    .doAdminLogin(req.body)
    .then(() => {
      req.session.admin = true;
      req.session.adminData = req.body;
      res.redirect("/admin");
    })
    .catch(() => {
      res.redirect("/admin");
    });
});

router.get("/logout", function (req, res, next) {
  req.session.destroy(() => res.redirect("/admin"));
});

//product details
router.get("/products/add", function (req, res, next) {
  if (req.session.admin) {
    res.render("admin/productForm", {
      title: constants["project-name"],
      layout: "layout-admin",
    });
  } else {
    res.redirect("/admin");
  }
});

router.post("/products/add", function (req, res, next) {
  if (req.session.admin) {
    productHelpers
      .addProduct(req)
      .then(() => {
        res.redirect("/admin");
      })
      .catch(() => {
        res.send("Error");
      });
  } else {
    res.redirect("/admin");
  }
});

module.exports = router;
