/**
 * model:类似关系数据库表，封装成具有集合操作的对象
 */
var mongoose = require('mongoose')
var usersSchema = require('../schemas/users')

//继承一个schema
module.exports = mongoose.model('User',usersSchema)