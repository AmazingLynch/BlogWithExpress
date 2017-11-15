var express = require('express')

var router = express.Router()

var User = require('../models/user')

var Content = require('../models/content')

//定义统一返回格式
var responseData

router.use(function(req,res,next) {//每次请求过来都要进行这个操作，初始化
    responseData = {
        code:0,
        message:''
    }
    next()
})
//这个路由是从admin那里过来的，不用再前面写/admin了

//用户注册
/**
 * 1用户名不能为空，密码不能为空，两次输入密码必须一致
 * 2用户名是否已经被注册--数据库查询
 * 其实注册成功这里就可以添加cookie了，这样就可以自动登录
 */
router.post('/user/register',function(req,res,next) {
    //console.log(req.body)//获取post提交过来的数据
    var username = req.body.username
    var password = req.body.password
    var repassword = req.body.repassword

    //用户是否为空
    if(username == '') {
        responseData.code = 1;
        responseData.message = '用户名不能为空'
        res.json(responseData)
        return;
    } 

    //密码是否为空
    if(password == '') {
        responseData.code = 2;
        responseData.message = '密码不能为空'
        res.json(responseData)
        return;
    }

    //两次输入的密码是否一样
    if(password !== repassword) {
        responseData.code = 3;
        responseData.message = '两次输入的密码不一致'
        res.json(responseData)
        return;
    }
    //用户是否已经被注册
    User.findOne({
        username:username
    }).then(function(userInfo){
        if(userInfo) {
            //表示数据库中有该记录
            responseData.code = 4
            responseData.message = '用户名已经被注册'
            res.json(responseData)
            return;
        }
        //保存用户注册信息到数据库中
        var user = new User({
            username:username,
            password:password
        })
        return user.save()
    }).then(function(newUserInfo) {
        console.log(newUserInfo)
        responseData.message = '注册成功'
        res.json(responseData)
    })
})

/**
 * 登录
 */
router.post('/user/login',function(req,res,next) {
    var username = req.body.username
    var password = req.body.password
    // console.log(username)
    // console.log(password)
    if(username == '' || password == '') {
        responseData.code = 1
        responseData.message = '用户名和密码不能为空'
        res.json(responseData)
        return
    }

    //验证登录，查询数据库中用户名和密码记录。
    User.findOne({
        username:username,
        password:password
    }).then(function(userInfo){
        if(!userInfo) {
            responseData.code = 2
            responseData.message = '用户名或密码错误'
            res.json(responseData)
            return
        } else {
            responseData.message = '登录成功'
            responseData.userInfo = {
                _id:userInfo._id,
                username:userInfo.username
            }
            //同时发送cookies信息给浏览器客户端，以后发送请求都会带着cookies信息
            req.cookies.set('userInfo',JSON.stringify({
                _id:userInfo._id,
                username:userInfo.username
            }));
            res.json(responseData)
            return
        }
    })
})

/**
 * 退出
 */
router.get('/user/logout',function(req,res,next) {
    req.cookies.set('userInfo',null);//将cookies设置为空
    res.json(responseData)
})

/**
 * 获取指定文章的所有评论
 */

router.get('/comment',function(req,res) {
    var contentId = req.query.contentid || ''
    Content.findOne({
        _id:contentId
    }).then(function(content) {
        responseData.data = content.comments
        res.json(responseData)
    })
})

/**
 * 评论提交
 */
router.post('/comment/post', function(req, res) {
    //内容的id
    var contentId = req.body.contentid || '';
    var postData = {
        username: req.userInfo.username,
        postTime: new Date(),
        content: req.body.content
    };

    //查询当前这篇内容的信息
    Content.findOne({
        _id: contentId
    }).then(function(content) {
        content.comments.push(postData);
        return content.save();
    }).then(function(newContent) {
        responseData.message = '评论成功';
        responseData.data = newContent;
        res.json(responseData);
    });
});
module.exports = router