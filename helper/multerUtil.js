var  multer=require('multer');
var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './public/files') //注意这里通过bin/www方式启动
       }, 
     //给上传文件重命名，获取添加后缀名
      filename: function (req, file, cb) {
          var fileFormat = (file.originalname).split(".");
          var name = file.fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]
          cb(null, name);
      }
 });  
     //添加配置文件到muler对象。
     var upload = multer({
          storage: storage
    });
    
	//如需其他设置，请参考multer的limits,使用方法如下。
   //var upload = multer({
  //    storage: storage,
  //    limits:{}
  // });
  
 //导出对象
module.exports = upload;