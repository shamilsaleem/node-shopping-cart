var express = require("express");
var router = express.Router();
var path = require("path");
var constants = require("../essentials/constants");
var adminHelpers = require("../helpers/admin-helpers");

router.get("/", function (req, res, next) {
  if (req.session.adminData) {
    adminHelpers
      .doAdminLogin(req.session.adminData)
      .then(() => {
        res.render("admin/home", {
          title: constants["project-name"],
          layout: "layout-admin",
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
      title: constants["project-name"],
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
module.exports = router;
