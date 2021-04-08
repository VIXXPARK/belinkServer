var express = require('express');
var bodyParser = require("body-parser");
var session = require('express-session');
var http = require("http");
var fs = require("fs");
var app = express();
var router = express.Router();

app.set('views', __dirname + '/views'); //서버가 읽을 수 있도록 HTML의 위치 정의
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);  //서버가 HTML을 랜더링 할때 ejs 엔진을 사용하도록 설정

var server = app.listen(3000, function(){
  console.log('Express server has started on port 3000');
});

app.use(bodyParser.urlencoded());
app.use(session({
  secret: '@#@$MYSIGN#@$#$', 
  resave: false,              
  saveUninitialized: true     
}));


var router = require('./router/main')(app);