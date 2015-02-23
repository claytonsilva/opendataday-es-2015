var express = require('express');
var router = express.Router();


router.get('/data/:ano', function(req, res, next) {
    var year = req.param('ano');
    
    if  (year == '2012'){
        str_load = '../models/2012'
    } else if  (year == '2013'){
        str_load = '../models/2013'
    }else if  (year == '2014'){
        str_load = '../models/2014'
    }else{
        str_load = '../models/2012'
    }
    
    data = require(str_load)();
    
    
    
    
    res.json(data);
    
    
    
});

/* GET home page. */
router.get('/', function(req, res, next) {
  var data = require('../models/2012')();
    
  res.render('index', { title: 'Express' });
});

module.exports = router;
