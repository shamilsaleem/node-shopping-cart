var express = require("express");
var router = express.Router();
var path = require("path");
var constants = require("../essentials/constants");
var adminHelpers = require("../helpers/admin-helpers");
var productHelpers = require("../helpers/product-helpers");

// Admin validation
const validateAdmin = (req, res, next) => {
  if (req.session.admin) next();
  else res.redirect("/admin");
};

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

// Product functions
// Adding product
router.get("/products/add", validateAdmin, function (req, res, next) {
  res.render("admin/productForm", {
    title: constants["project-name"],
    layout: "layout-admin",
  });
});

router.post("/products/add", validateAdmin, function (req, res, next) {
  productHelpers
    .addProduct(req)
    .then(() => {
      res.redirect("/admin");
    })
    .catch(() => {
      res.send("Error");
    });
});

// Deleting a product
router.post("/products/delete", validateAdmin, function (req, res, next) {
  productHelpers
    .deleteProduct(req.body.productId)
    .then(() => res.redirect("/admin"))
    .catch((err) => {
      console.log(err);
      res.render("admin/noProducts", { layout: "layout-admin" });
    });
});

// Edit a product
router.get(
  "/products/edit/:productId",
  validateAdmin,
  function (req, res, next) {
    let productId = req.params.productId;
    productHelpers
      .getProductData(productId)
      .then((productData) => {
        res.render("admin/productEditForm", {
          title: constants["project-name"],
          layout: "layout-admin",
          productData,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
);

router.post(
  "/products/edit/:productId",
  validateAdmin,
  function (req, res, next) {
    let productId = req.params.productId;
    productHelpers
      .editProduct(req, productId)
      .then(() => {
        res.redirect("/admin");
      })
      .catch(() => {
        res.send("Error");
      });
  }
);

module.exports = router;
