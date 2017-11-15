//定义数据结构

var mongoose = require('mongoose')

//一个schema就代表着一个表，schema用来定义模板


//内容的表结构
module.exports = new mongoose.Schema({
    //关联字段-内容分类的id
    category:{
        type:mongoose.Schema.Types.ObjectId,
        //引用另外一张表的模型
        ref:'Category'
    },
    title:String,
    //用户id
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    //添加时间
    addTime: {
        type:Date,
        default:new Date()
    },
    //阅读量
    views:{
        type:Number,
        default:0
    },
    //简介
    description:{
        type:String,
        default:''
    },
    //内容
    content:{
        type:String,
        default:''
    },
    //评论
    comments:{
        type:Array,
        default:[]
    }
})