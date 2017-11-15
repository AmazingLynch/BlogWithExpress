//定义数据结构

var mongoose = require('mongoose')

//一个schema就代表着一个表，schema用来定义模板


//分类的表结构
module.exports = new mongoose.Schema({
    name:String
})