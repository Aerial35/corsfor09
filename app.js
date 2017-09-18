var express = require('express');
var ejs = require('ejs');
var bodyParser = require('body-parser')
var session = require('express-session');
var cookieParser = require('cookie-parser');
var path = require('path');
var app = express();

var gUserName = '123';                  // 配置用户名
var gPassWord = '123';                  // 配置密码
var gMaxHour = 3 * 60 * 1000;           // 配置session过期时间

app.engine('html', ejs.__express);      // 设置html引擎，ejs模版
app.set('view engine', 'html');         // 设置视图引擎
app.set('views', './view');             // 设置视图目录
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({                       // 配置session
    resave: true,
    saveUninitialized: false,
    secret: '111',
    cookie: {
        secure: false,
        maxAge: gMaxHour                // session过期时间
    },
    name: 'sessionid'
}));
app.use(express.static(path.join(__dirname, 'static')));    // 设置静态文件路径


// 登录页面
app.get('/login.html', function (req, res) {
    res.render('login');
});
// 个人信息页面
app.get('/personal.html', function (req, res) {
    if (!req.session.userName) {                // 判断是否已登录，未登录渲染unlogin页面
        res.render('unlogin');
    }
    else {
        console.log(req.session.id, req.session.userName)
        res.render('personal');
    }
});

// 登录接口
app.post('/login', function (req, res) {
    var userName = req.body.userName;
    var passWord = req.body.passWord;
    if (userName === gUserName && passWord === gPassWord) {
        req.session.userName = {userName};
        res.send({message: 'success'});
    }
    else {
        res.send({message: 'error'});
    }
});

// 获取用户信息接口
app.get('/profile', function (req, res) {
    res.send({userName: gUserName});
});

// 登出接口
app.get('/logout', function (req, res) {
    req.session.user = null;
    res.send({message: 'success'});
});

// 启动服务
var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});
