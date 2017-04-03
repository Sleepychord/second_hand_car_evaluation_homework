var multer = require('../helper/multerUtil.js')
var express = require('express');
var router = express.Router();
var login_helper = require('../helper/login_helper')
var https = require('https')

/* GET users listing. */
function detectReq(req_data, callback){
  var api_key = 'f66fba7cc70d4c45a431fbca06a662d8' 
  var option = {
      hostname:'westus.api.cognitive.microsoft.com',
      port:443,
      path:'/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=false&returnFaceAttributes=age,gender',
      method:'POST',
      headers : {'Content-Type':'application/json', 'Ocp-Apim-Subscription-Key': api_key}
  }
  var r = https.request(option, (res)=>{
      res.setEncoding('utf-8');
      var responseString = '';
      res.on('data', function(data) {
          responseString += data;
      });
      res.on('end', function() {
      //这里接收的参数是字符串形式,需要格式化成json格式使用
          callback(responseString)
      });
      r.on('error', function(e) {
          // TODO: handle error.
          console.log('-----error-------',e);
      });
  });

  r.write(JSON.stringify({url:req_data}))
  r.end()
}

router.post('/', multer.single('webcam'), function(req, res, next) {
    var ok = (ret) => {
        var ret_json = JSON.parse(ret);
        console.log(typeof(ret_json[0]['error']))
        if(ret_json.length > 0 && typeof(ret_json[0]['error']) == "undefined")
            login_helper.createSession(ret, (sid)=>{
                res.cookie("session_id", sid, {path: '/'});
                res.send(ret)
            })
        else res.send('No Face or Error ~ Please try again')
    }
    console.log(req.file.filename)
    detectReq('http://52.175.27.87/files/'+req.file.filename, ok)
});

module.exports = router;
