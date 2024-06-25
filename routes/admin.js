var express = require('express');
var router = express.Router();
var path = require('path')
var constants = require('../essentials/constants')

router.get('/', function(req, res, next) {
    res.render('admin/login', {title:constants['project-name'] ,admin:true, layout:'layout-admin', login:true});
});

router.post('/', function(req, res, next){
    if(req.body.username == constants['admin-username'] && req.body.password == constants['admin-password']){
        res.send('ookey')
    }
});
module.exports = router;