var express = require('express')

var User = require('../models/user')

var Category = require('../models/category')

var Content = require('../models/content')

var router = express.Router()

//这个路由是从admin那里过来的，不用再前面写/admin了

router.use(function(req,res,next) {
    if(!req.userInfo.isAdmin) {
        //非管理员，预防手动输入/admin进入管理员页面的情况
        res.send('只有管理员才可以进入')
        return
    }
    next()
})

/**
 * 首页
 */
router.get('/',function(req,res,next) {
    res.render('admin/index',{
        userInfo:req.userInfo
    })
})

/**
 * 用户管理
 */
router.get('/user',function(req,res) {
    //需要从数据库中读取所有的用户数据
    /**
     * limit():限制获取的数据条数
     * skip()：忽略数据的条数
     * 每页显示两条
     * 1:1-2 skip:0
     * 2:3-4 skip:2
     */
    var page = req.query.page || 1 
    var limit = 10
    var skip =( page - 1 )*limit
    var pages = 0
    User.count().then(function(count) {
        //计算总页数
        pages = Math.ceil(count/limit)
        //取值不能超过page
        page = Math.min(page,pages)
        page = Math.max(page,1)

        var skip = (page-1)*limit
        
        User.find().limit(limit).skip(skip).then(function(users) {
            res.render('admin/user_index',{
                userInfo:req.userInfo,
                users:users,
                page:page,//把当前页码传递到模板上去
                pages:pages,//总页数
                limit:limit,//每页显示的条数
                count:count
            })
        })
    })
    
})

/**
 * 分类首页
 */
router.get('/category',function(req,res) {
    var page = req.query.page || 1 
    var limit = 10
    var skip =( page - 1 )*limit
    var pages = 0
    User.count().then(function(count) {
        //计算总页数
        pages = Math.ceil(count/limit)
        //取值不能超过page
        page = Math.min(page,pages)
        page = Math.max(page,1)

        var skip = (page-1)*limit
        
        /**
         *按照id排序：1--升序  -1--降序
         */
        Category.find().sort({_id:-1}).limit(limit).skip(skip).then(function(categories) {
            res.render('admin/category_index',{
                userInfo:req.userInfo,
                categories:categories,
                page:page,//把当前页码传递到模板上去
                pages:pages,//总页数
                limit:limit,//每页显示的条数
                count:count
            })
        })
    })
})
/**
 * 分类添加
 */
router.get('/category/add',function(req,res) {
    res.render('admin/category_add',{
        userInfo:req.userInfo
    })
})

/**
 * 分类的保存
 */

router.post('/category/add',function(req,res) {
    var name = req.body.name//已经通过之前的中间件处理过了的
    if(!name) {
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'名称不能为空'
        })
        return
    } 

    //看数据库中是否有已经存在的同类

    Category.findOne({
        name:name
    }).then(function(rs) {
        if(rs) {
            //数据库已经存在了
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'分类已经存在了'
            })
            return Promise.reject()
        } else {
            //数据库种不存在该分类，可以保存
            return new Category({
                name:name
            }).save()
        }
    }).then(function(newCategory) {
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'分类保存成功',
            url:'/admin/category'
        })
    })
})
/**
 * 分类修改
 */
router.get('/category/edit',function(req,res) {
    //获取要修改的分类信息，并且用表单的形式展现出来
    var id = req.query.id || ''

    Category.findOne({
        _id:id
    }).then(function(category) {
        if(!category) {
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'分类信息不存在'
            })
            return Promise.reject()
        } else {
            res.render('admin/category_edit',{
                userInfo:req.userInfo,
                category:category
            })
        }
    })
})

/**
 * 分类的修改保存
 */
router.post('/category/edit',function(req,res) {
    var id = req.query.id || ''//get方式进入该页面的id值
    var name = req.body.name || ''
    Category.findOne({
        _id:id
    }).then(function(category) {
        if(!category) {
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'分类信息不存在'
            })
            return Promise.reject()
        } else {
            
        //当用户没有做任何修改时。
            if(name == category.name) {
                res.render('admin/error',{
                    userInfo:req.userInfo,
                    message:'修改成功',
                    url:'/admin/category'
                })
                return Promise.reject()
            } else {
                //要修改的名称是否在数据库中已经存在
                return Category.findOne({  //不允许其修改
                    _id:{$ne:id},//id不一样，但是名字一样
                    name:name
                })
            }
            
        }
    }).then(function(sameCategory) {
        if(sameCategory) {
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'数据库中已经存在同名分类'
            })
            return Promise.reject()
        } else {
            return Category.update({
                _id:id  //条件
            },{
                name:name //要更新的内容
            })
        }
    }).then(function() {
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'修改成功',
            url:'/admin/category'
        })
    })    
})
/**
 * 分类删除
 */ 
router.get('/category/delete',function(req,res) {
    //获取要删除的分类ID
    var id = req.query.id || ''
    Category.remove({
        _id:id
    }).then(function(){
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'删除成功',
            url:'/admin/category'
        })
    })
})

/**
 * 内容首页
 */
router.get('/content',function(req,res,next) {
    var page = req.query.page || 1 
    var limit = 10
    var skip =( page - 1 )*limit
    var pages = 0
    Content.count().then(function(count) {
        //计算总页数
        pages = Math.ceil(count/limit)
        //取值不能超过page
        page = Math.min(page,pages)
        page = Math.max(page,1)

        var skip = (page-1)*limit
        
        /**
         *按照id排序：1--升序  -1--降序
         */
        //从一个表中读取关联的另一个表
        Content.find().sort({_id:-1}).limit(limit).skip(skip).populate(['category','user']).sort({addTime:-1}).then(function(contents) {
            //console.log(contents)
            res.render('admin/content_index',{
                userInfo:req.userInfo,
                contents:contents,
                page:page,//把当前页码传递到模板上去
                pages:pages,//总页数
                limit:limit,//每页显示的条数
                count:count
            })
        })
    })
})

/**
 * 内容添加页面
 */

router.get('/content/add',function(req,res) {
    Category.find().sort({_id:-1}).then(function(categories) {
        res.render('admin/content_add',{
            userInfo:req.userInfo,
            categories:categories
        })
    })
    
})

/**
 * 内容保存
 */
router.post('/content/add',function(req,res) {
    //验证
    if(req.body.category == '') {
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'分类内容不能为空'
        })
        return
    }
    if(req.body.title == '') {
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'标题内容不能为空'
        })
        return
    }
    //保存数据到数据库
    new Content({
        category:req.body.category,
        title:req.body.title,
        user:req.userInfo._id.toString(),
        description:req.body.description,
        content:req.body.content
    }).save().then(function(rs) {
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'保存成功',
            url:'/admin/content'
        })
    })
})

/**
 * 修改内容
 */
router.get('/content/edit',function(req,res) {
    var id = req.query.id || ''//get方式进入该页面的id值
    var categories = []
    //读取分类
    Category.find().sort({_id:-1}).then(function(categories) {
        categories = categories
        return Content.findOne({
            _id:id
        }).populate('category').then(function(content) {
            console.log(content)
            if(!content) {
                res.render('admin/error',{
                    userInfo:req.userInfo,
                    message:'该内容不存在'
                })
                return Promise.reject()
            } else {
                res.render('admin/content_edit',{
                    userInfo:req.userInfo,
                    content:content,
                    categories:categories
                })
            }
        })
    })
    
})

/**
 * 内容修改保存
 */
router.post('/content/edit',function(req,res) {
    var id = req.query.id || ''
    if(req.body.category == '') {
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'内容分类不能为空'
        })
        return
    }
    if(req.body.title == '') {
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'内容标题不能为空'
        })
        return
    }
    //保存数据到数据库
    Content.update({
        _id:id
    },{
        category:req.body.category,
        title:req.body.title,
        description:req.body.description,
        content:req.body.content 
    }).then(function() {
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'内容保存成功',
            url:'/admin/content/edit?id=' + id
        })
    })
})
/**
 * 内容删除
 */
router.get('/content/delete',function(req,res) {
    var id = req.query.id || ''
    Content.remove({
        _id:id
    }).then(function() {
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'删除成功',
            url:'/admin/content'
        })
    })
})

module.exports =router 