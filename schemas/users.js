//定义数据结构

var mongoose = require('mongoose')

//一个schema就代表着一个表，schema用来定义模板


//用户的表结构
module.exports = new mongoose.Schema({
    //用户名
    username:String,
    //密码
    password:String,
    //是否是管理员
    isAdmin:{
        type:Boolean,
        default:false
    }

})