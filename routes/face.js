var multer = require('../helper/multerUtil.js')
var express = require('express');
var router = express.Router();
var login_helper = require('../helper/login_helper')
var https = require('https')
var db = require('../helper/db.js')

function sendReq(option, body, callback){
    var r = https.request(option, (res)=>{
      res.setEncoding('utf-8');
      var responseString = '';
      res.on('data', function(data) {
          responseString += data;
      });
      res.on('end', function() {
      //这里接收的参数是字符串形式,需要格式化成json格式使用
          console.log('https get: '+responseString)
          callback(JSON.parse(responseString))
      });
      r.on('error', function(e) {
          // TODO: handle error.
          console.log('-----error-------',e);
      });
  });

  r.write(JSON.stringify(body))
  r.end()
}
function detectReq(req_data, callback){
  var api_key = 'f66fba7cc70d4c45a431fbca06a662d8' 
  var option = {
      hostname:'westus.api.cognitive.microsoft.com',
      port:443,
      path:'/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=false&returnFaceAttributes=age,gender',
      method:'POST',
      headers : {'Content-Type':'application/json', 'Ocp-Apim-Subscription-Key': api_key}
  }
  sendReq(option, {url:req_data}, callback)
}
function createAddListReq(data, callback){
  var api_key = 'f66fba7cc70d4c45a431fbca06a662d8' 
  var option = {
      hostname:'westus.api.cognitive.microsoft.com',
      port:443,
      path:'/face/v1.0/facelists/second_hand_cars/persistedFaces',
      method:'POST',
      headers : {'Content-Type':'application/json', 'Ocp-Apim-Subscription-Key': api_key}
  }
  sendReq(option, {url:data}, callback)  
}
function findSimilarReq(data, callback){
   var api_key = 'f66fba7cc70d4c45a431fbca06a662d8' 
    var option = {
      hostname:'westus.api.cognitive.microsoft.com',
      port:443,
      path:'/face/v1.0/findsimilars',
      method:'POST',
      headers : {'Content-Type':'application/json', 'Ocp-Apim-Subscription-Key': api_key}
  }
  sendReq(option, data, callback)   
}
router.post('/signup', multer.single('webcam'), function(req, res, next) {
    var pic_url = 'http://52.175.27.87/files/'+req.file.filename;
    var after_detect = (ret_json) => {
        if(ret_json.length > 0){
            var info = ret_json[0];
            //add face to facelist, save persistedId and info in redis 
            console.log("detect: "+ info)
            createAddListReq(pic_url, (ret)=>{
                    console.log("addlist: "+ ret)
                    var savedData = JSON.stringify(Object.assign(info, {username: req.query.username}))
                    console.log(savedData)
                    db.client.set("persistedFaceId:"+ret['persistedFaceId'], savedData, (err)=>{console.log(err)})
                })
            //createSession and return face attr
            login_helper.createSession(req.query.username, (sid)=>{
                    res.cookie("session_id", sid, {path: '/'});
                    res.cookie("username", req.query.username, {path: '/'});
                    res.send(req.query.username + ', you have successfully signed up\nAttributes:'+JSON.stringify(info['faceAttributes']))
                })
        }
        else res.send('No Face or Error ~ Please try again')
    }
    detectReq(pic_url, after_detect)
});

router.post('/login', multer.single('webcam'), function(req, res, next) {
    var pic_url = 'http://52.175.27.87/files/'+req.file.filename;
    console.log(pic_url)
    var after_detect = (ret_json) => {
        if(ret_json.length > 0){
            var info = ret_json[0];
            //find similar faces in facelist
            var data = {
                            faceId: info['faceId'],
                            faceListId: 'second_hand_cars',
                            maxNumOfCandidatesReturned:1
                       }
            console.log("detect: "+ JSON.stringify(info))
            console.log("ready to post similar: "+ JSON.stringify(data))
            findSimilarReq(data, (ret)=>{
                    console.log("similar: "+ JSON.stringify(ret))
                    if(ret.length > 0 && ret[0]['confidence'] > 0.6){//found
                        //get attr and username of id
                        db.client.get("persistedFaceId:"+ret[0]['persistedFaceId'], (err, attr_str)=>{
                            var attr_obj = JSON.parse(attr_str)
                            console.log(attr_str)
                            //createSession and redirect to /
                            login_helper.createSession(attr_obj['username'], (sid)=>{
                                res.cookie("session_id", sid, {path: '/'});
                                res.cookie("username", attr_obj['username'], {path: '/'});
                                res.send('login successfully,' + attr_obj['username'])
                            })
                        })
                    }else res.send('No Similar Face ~ Please try again')
                })
        }
        else res.send('No Face or Error ~ Please try again')
    }
    detectReq(pic_url, after_detect)
});

module.exports = router;
