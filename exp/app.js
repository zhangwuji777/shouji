var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let cookieSession = require('cookie-session');
let multer = require('multer')


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//资源托管
app.use(express.static(path.join(__dirname, 'public/template')));
app.use('/admin',express.static(path.join(__dirname, 'public/admin/')));//别名，要求访问时，要加/admin的前缀
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieSession({
  name:'jinlong',
  keys:['aa','bb'],//sha1加密一种轮询方式
  maxAge: 1000 * 60 * 60 
}));
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if(req.url.indexOf('user')!==-1 || req.url.indexOf('reg')!==-1){
      cb(null, path.join(__dirname, 'public',require('./config/path').user.uploadUrl))
    }else if(req.url.indexOf('banner')!==-1){
      cb(null, path.join(__dirname, 'public',require('./config/path').banner.uploadUrl))
    }else{
      cb(null, path.join(__dirname, 'public/upload/product'))
    }
  }
})


var upload = multer({ storage });//存储方式dest指定死了，storage分目录
// let objMulter = multer({ dest: path.join(__dirname, 'public/upload')});	//实例化  返回 multer对象
app.use(upload.any());  	//any 允许上传任何文件


// let mgdb = require("./utils/mgdb");

app.use('/user', (req,res,next)=>{
	// console.log("query",req.query);
	// console.log("body",req.body);
	// console.log("method",req.method);
	// console.log("session",req.session);
	// console.log("files",req.files);
	
	res.render("index.ejs",{title:"jinlong"});
	// mgdb({
	// 	collectionName:"user"
	// },({collection,client})=>{
	// 	collection.find({}).toArray(function(err, docs) {
	// 	    if(!err){
	// 	    	console.log(docs);
	// 	    }
	// 	    client.close();
	// 	  })
	// })
})


//api
app.all("/api/*",require("./routes/api/params"))
app.use("/api/login",require("./routes/api/login"));
app.use("/api/user",require("./routes/api/user"));
app.use("/api/logout",require("./routes/api/logout"));
app.use("/api/reg",require("./routes/api/reg"));
app.use("/api/home",require("./routes/api/home"));
app.use("/api/total",require("./routes/api/total"));
app.use("/api/list",require("./routes/api/list"));
app.use("/api/buycar",require("./routes/api/buycar"));
app.use("/api/cart",require("./routes/api/cart"));










// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  if(req.url.indexOf('/api') !== -1){
    res.send({error:1,msg:'错误的接口和请求方式'})
  }
});

module.exports = app;
