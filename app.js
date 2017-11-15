/**
 * 应用启动入口文件
 */

/**
 * 1.加载模块
 * 2.创建app应用 =》server对象
 * 3.监听请求
 */
var express = require('express')

var path = require('path')

var swig = require('swig')

var mongoose = require('mongoose')

var Cookies = require('cookies')

var User = require('./models/user')

//用来处理post提交过来的数据
var bodyParser = require('body-parser')

var app = express()

//设置静态文件托管
/**
 * 当用户访问的url以/public开始，那么直接返回对应的__dirname, + '/public'目录下
 * 的文件
 */
app.use('/public',express.static(path.join(__dirname, '/public')))

//配置应用模板
/**
 * 1.定义当前应用所使用的模板
 * 第一个参数表示模板引擎的名称，同时也是模板文件后缀
 * 第二个参数用于解析处理模板内容的方法
 */
app.engine('html',swig.renderFile)

/**
 * 2.设置模板文件的存放目录
 * 第一个参数必须是views
 * 第二个参数是目录
 */
app.set('views','./views')

/**
 * 3.注册所使用的模板引擎，
 * 第一个参数必须是view engine
 * 第二个参数和app.engine方法中定义的模板引擎的名称（第一个参数）是一致的
 */
app.set('view engine','html')

/**
 * 在开发过程中，需要取消模板缓存
 */
swig.setDefaults({cache:false})

//bodyparser设置
app.use(bodyParser.urlencoded({extended:true}))//中间件

//cookies设置
//通过中间件，无论什么时候用户来访问网站，都会经过这一个中间件，在这个中间件我们试着去看请求里的cookies中的userInfo值有木有，如果有则将其放在
//req里面，以便后续处理
app.use(function(req,res,next) {
    req.cookies = new Cookies(req,res)
    req.userInfo = {}//把用户信息记录到请求对象中，以便后续处理
    if(req.cookies.get('userInfo')) {
        try{
            req.userInfo = JSON.parse(req.cookies.get('userInfo'))
            //获取当前登录用户是不是管理员
            User.findById(req.userInfo._id).then(function(userInfo){
                req.userInfo.isAdmin = Boolean(userInfo.isAdmin)
                next()
            })
        }catch(e){
            next()
        }
    } else {//管理员cookies不能放在头里面
        next()
    }
})

//在设置后会在req对象中添加body属性里面就是请求的内容
/**
 * 首页
 * next是一个函数
 */

//app.get('/',function(req,res,next) {
    /**
     * 读取views目录下的指定文件，解析并返回给客户端
     * 第一个参数表示模板文件，相对于views目录
     * 第二个参数表示传递给模板的数据
     */
//    res.render('index')
//})

/* 
app.get('/main.css',function(req,res,next) {
    res.setHeader('content-type','text/css')
    res.send('body {background-color:red}')
})
 */

/**
 * 加载一个中间件，每次应用被请求，打印请求时间，以及请求url
 */

app.use(function(req,res,next) {
    var date = new Date()
    console.log(date.getFullYear() + '年' + date.getMonth() + '月' + date.getDay() + '日 ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + '  ' + req.url)
    next()
})


/**
 * 根据不同功能划分模块
 */
app.use('/admin',require('./routers/admin'))

app.use('/api',require('./routers/api'))

app.use('/',require('./routers/main'))

mongoose.connect('mongodb://localhost:27017/blog',function(err) {
    if(err) {
        console.log('数据库连接失败')
    } else {
        console.log('数据库连接成功')
        console.log('应用程序已开启...')
        app.listen(8080)
    }
})


