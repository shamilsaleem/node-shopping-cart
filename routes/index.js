var express = require('express');
var router = express.Router();
var path = require('path')
var constants = require('../essentials/constants')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('users/index', {title:constants['project-name'] ,admin:false});
});

module.exports = router;
