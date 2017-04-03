var express = require('express');
var router = express.Router();
var check = require('../helper/login_helper').check;

/* GET home page. */
router.get('/', check, function(req, res, next) {
  features = [{name : 'make', init : 'audi'},
    {name : 'body-style', init : 'wagon'},
    {name : 'wheel-base', init : '104.3'}, 
    {name : 'engine-size', init : '141'}, 
    {name : 'horsepower', init : '114'}, 
    {name : 'peak-rpm', init : '5400'}, 
    {name : 'highway-mpg', init : '28'}];
  res.render('index', { title: 'Second-Hand Cars Evaluation' , features : features});
});

module.exports = router;
