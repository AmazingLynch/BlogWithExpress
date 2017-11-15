var express = require('express')

var Category = require('../models/category')

var Content = require('../models/content')

var router = express.Router()

var data ;

//处理通用数据
router.use(function (req, res, next) {
    data = {
        userInfo: req.userInfo,
        categories: []
    }

    Category.find().then(function(categories) {
        data.categories = categories;
        next();
    });
});

//这个路由是从admin那里过来的，不用再前面写/admin了 
router.get('/',function(req,res,next) {
    /*
    var data = {
        page: Number(req.query.page || 1),
        limit : 10,
        pages : 0,
        userInfo: req.userInfo,
        categories:[],
        count:0
    }
    //读取所有的分类信息
    Category.find().then(function(categories) {
        data.categories = categories
        return msContentScript.count()
    }).then(function(count){
        data.count = count
        data.pages = Math.ceil(data.count/data.limit)
        //取值不能超过page
        data.page = Math.min(data.page,data.pages)
        data.page = Math.max(data.page,1)

        var skip = (data.page-1)*data.limit
        return Content.find().sort({_id:-1}).limit(data.limit).skip(skip).populate(['category','user'])
    }).then(function(contents) {
        data.contents = contents
        res.render('main/index',data)
    })
    */
    data.category = req.query.category || '';
    data.count = 0;
    data.page = Number(req.query.page || 1);
    data.limit = 10;
    data.pages = 0;

    var where = {};
    if (data.category) {
        where.category = data.category
    }

    Content.where(where).count().then(function(count) {

        data.count = count;
        //计算总页数
        data.pages = Math.ceil(data.count / data.limit);
        //取值不能超过pages
        data.page = Math.min( data.page, data.pages );
        //取值不能小于1
        data.page = Math.max( data.page, 1 );

        var skip = (data.page - 1) * data.limit;

        return Content.where(where).find().limit(data.limit).skip(skip).populate(['category', 'user']).sort({
            addTime: -1
        });

    }).then(function(contents) {
        data.contents = contents;
        res.render('main/index', data);
    })
})

/**
 * 详情页
 */

router.get('/view',function(req,res) {
    var contentId = req.query.contentid || ''
    Content.findOne({
        _id:contentId
    }).then(function(content) {

        data.content = content

        content.views++;
        content.save();//保存
        res.render('main/view',data)
    })
})
module.exports = router