var express = require('express');
var router = express.Router();
var https = require('https')

/* GET users listing. */
function predictReq(req_data, callback){
  var postData = 
        {
            'symboling': "1",   
            'normalized-losses': "1",   
            'make': "audi",   
            'fuel-type': "1",   
            'aspiration': "1",   
            'num-of-doors': "1",   
            'body-style': "wagon",   
            'drive-wheels': "1",   
            'engine-location': "1",   
            'wheel-base': "104.3",   
            'length': "1",   
            'width': "1",   
            'height': "1",   
            'curb-weight': "1",   
            'engine-type': "1",   
            'num-of-cylinders': "1",   
            'engine-size': "141",   
            'fuel-system': "1",   
            'bore': "1",   
            'stroke': "1",   
            'compression-ratio': "1",   
            'horsepower': "114",   
            'peak-rpm': "5400",   
            'city-mpg': "1",   
            'highway-mpg': "30",   
            'price': "1",   
        };
  var api_key = 'RvVUdj0HALy67Jr+3IFKw8zw2xoaEBiglAWQMOXUOiGgvrM/j1HJDwwRSdmlxQxfjwnu5Tj5iZXrO+qNFbkKAg==' 
  var option = {
      hostname:'ussouthcentral.services.azureml.net',
      port:443,
      path:'/workspaces/13ad1bdbbaa542a1bf86e0ef03e34219/services/2c1a97c6c3134d39a42213ed25339107/execute?api-version=2.0&format=swagger',
      method:'POST',
      headers : {'Content-Type':'application/json', 'Authorization':('Bearer '+ api_key)}
  }
  var r = https.request(option, (res)=>{
      res.setEncoding('utf-8');
      var responseString = '';
      res.on('data', function(data) {
          responseString += data;
      });
      res.on('end', function() {
      //这里接收的参数是字符串形式,需要格式化成json格式使用
          callback(JSON.parse(responseString))
      });
      r.on('error', function(e) {
          // TODO: handle error.
          console.log('-----error-------',e);
      });
  });

  var final_data = {
        "Inputs": {
                "input1":
                [
                  Object.assign(postData , req_data)
                ],
        },
    "GlobalParameters":  {
    }
  }
  r.write(JSON.stringify(final_data))
  r.end()
}

router.get('/', function(req, res, next) {
  console.log(req.query)
  predictReq(req.query, (data)=>{
    console.log(data)
    if(data["error"]) res.send("Sorry, something goes wrong!")
    else
      res.send(data["Results"]["output1"][0]["Scored Labels"]);
  })
});

module.exports = router;

// predictReq({}, console.log)