var mongoose = require('mongoose')
var contentsSchema = require('../schemas/contents')

//继承一个schema
//之前有关联字段的那个ref就是这里的Content
module.exports = mongoose.model('Content',contentsSchema)