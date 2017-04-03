var multer = require('../helper/multerUtil.js')
var express = require('express');
var router = express.Router();

/* GET home page. , ,*/
router.post('/', multer.single('webcam'), function(req, res, next) {
    res.send(req.file.filename)
  //res.render('login', { title: 'Login by Detecting Face'});
});

module.exports = router;
