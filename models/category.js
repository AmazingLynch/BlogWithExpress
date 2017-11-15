var mongoose = require('mongoose')
var categorySchema = require('../schemas/category')

//继承一个schema
module.exports = mongoose.model('Category',categorySchema)