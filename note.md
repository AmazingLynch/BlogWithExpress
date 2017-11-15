# 项目结构

## 项目目录结构

* db:数据库存储目录
* public:公共文件目录（css,js,image...)
* schemas:数据库结构文件（schema)目录-----定义表结构，有哪些字段
* views:模板视图文件目录
* models:数据库模型文件目录
* routers:路由文件目录
* app.js:应用启动入口文件

## 模块划分：

* 前台模块
* 后台管理模块
* api模块
* 使用app.use()进行模块划分

```javascript

app.use('/admin',require('/router/admin))
/ :首页
/user :用户列表
/category: 分类列表
/category/add: 分类添加
/category/edit: 分类修改
/category/delete:分类删除
/article:内容列表
/article/add:内容添加
/article/edit:内容修改
/article/delete:内容删除
/comment:评论列表
/comment/delete:评论删除

app.use('/api',require('./router/api))
/ :首页
/register: 用户注册
/login : 用户登录
/comment :评论获取
/comment/post :评论提交
app.use('/',require('./router/main))

/ :首页
/view : 内容页

```

# 开发步骤

* 功能模块开发顺序：用户 栏目 内容 评论
* 编码顺序：通过schema定义设计数据存储结构，功能逻辑，页面展示

用户发送http请求 -> url -> 解析路由 ->找到匹配的规则 ->执行指定绑定函数返回对应内容，

mvc

# 注意的点

## 模板引擎的配置

## 静态文件不需要处理，直接发就好了。

* 静态文件：直接读取指定目录下的文件，返回给用户
* 动态：处理业务逻辑，加载模板，解析模板，返回数据

## 在配置静态文件目录时，一定要注意路径的问题， + 和path.resolve 和path.join的区别要搞清楚

# mongodb

## 是啥

文档型数据库（Document Database），不是关系型数据库（Relational Database）

## 命令行中启动数据库

一般来说都会在项目目录下设置一个db目录用来存储数据库数据，所以应该在项目启动前先去启动数据库，设置正确的数据存储路径。可以
在mongodb安装目录下的bin目录下（如果没有添加到电脑的环境变量的话就要到bin目录下执行才行）中输入mongod --dbpath=F:\dailylife\weblearning\nodelearn\miaov\blog\db  后面的参数是用来指定数据存储位置的。这样就可以开启mongodb服务，它会提示waitting for connection在22017端口这样服务就打开了。如果要用mongodb服务，首先要将这项服务打开，再进行连接。
如果想看数据库里面的内容，可在bin目录下执行mongo进入mongodb交互模式。可以进行一些数据库操作show dbs可以看到所有的数据库

## mongoose

### 是什么

Mongoose是在node.js异步环境下对mongodb进行便捷操作的对象模型工具，可以将Mongodb数据库存储的文档（document）转化为JavaScript对象，然后可以直接进行数据的增删改查

## 基本概念

* Schema:mongoose里的一种数据模式，可以理解为表结构定义模板，它不具备操作数据库的能力

```javascript
var schema = new mongoose.Schema({name:'string',size:'string'})
```

* Model:是由Schema生成的模型（其实就是通过Schema定义编译而来的一个构造函数），类似关系数据库表，可以对数据库进行操作

```javascript
var Tank = mongoose.model('Tank',schema)
Tank其实tanks 在数据库中的collection
.model把schema的东西都复制了一遍，所以你应该在编译成model之前向schema添加方法
```

* Document：类似记录，有Model创建的实体，也具有影响数据的操作

## 增删改查

## 添加

```javacript
var small = new Tank({ size: 'small' });
small.save(function (err,small) {
  if (err) return handleError(err);
  // saved!
})

// or

Tank.create({ size: 'small' }, function (err, small) {
  if (err) return handleError(err);
  // saved!
})
```

## 查询querying

这里要注意的是mongoose查询返回的并不是Promise，尽管她有then方法，如果真的需要一个真实完全的Promise实例，可以使用.exec()方法，不过也可以使用回调

```javascript
var query = Band.findOne({name: "Guns N' Roses"});
query.then(function(doc) {})
//or
var promise = query.exec()
promise.then(function(doc) {})
```

```javascript
Model.find(conditions, [projection], [options], [callback])
Model.findById(id, [projection], [options], [callback])
Model.findByIdAndRemove(id, [options], [callback])
Model.findByIdAndUpdate(id, [update], [options], [callback])
Model.findOne([conditions], [projection], [options], [callback])
Model.findOneAndRemove(conditions, [options], [callback])
Model.findOneAndUpdate([conditions], [update], [options], [callback])

@parameters conditions <Object> 查询条件
@parameters projection <Object> 选择你要找的哪些属性（optional fields），可以是字符串
@parameters options <Object> 查询参数，如skip
```

```javacript
Tank.find({ size: 'small' }).where('createdDate').gt(oneYearAgo).exec(callback);
Adventure.findOne({ type: 'iphone' }, 'name', { lean: true }).exec(callback);

// chaining findOne queries (same as above)
Adventure.findOne({ type: 'iphone' }).select('name').lean().exec(callback);
```

## 删除removing
Model.remove(conditions,callback)   这是Model的静态方法
```
Tank.remove({ size: 'large' }, function (err) {
  if (err) return handleError(err);
  // removed!
});
```

## 改updating

```javacript
Model.update(conditions,doc,[options],[callback])
Model.updateMany(conditions, doc, [options], [callback])
Model.updateOne(conditions, doc, [options], [callback])
MyModel.update({ age: { $gt: 18 } }, { oldEnough: true }, fn);
MyModel.update({ name: 'Tobi' }, { ferret: true }, { multi: true }, function (err, raw) {
  if (err) return handleError(err);
  console.log('The raw response from Mongo was ', raw);
});
```

## 范围条件怎么写？

```javacript
Tank.find({age:{$gte:21,$lte:65}},callback)//查询大于等于21小于等于65岁的
```

```javascript
$or　　　　或关系

$nor　　　 或关系取反

$gt　　　　大于

$gte　　　 大于等于

$lt　　　　小于

$lte　　　 小于等于

$ne        不等于

$in        在多个值范围内

$nin       不在多个值范围内

$all       匹配数组中多个值

$regex　　 正则，用于模糊查询

$size　　　匹配数组大小

$maxDistance　　范围查询，距离（基于LBS）

$mod　　   取模运算

$near　　　邻域查询，查询附近的位置（基于LBS）

$exists　　字段是否存在

$elemMatch　　匹配内数组内的元素

$within　　   范围查询（基于LBS）

$box　　　 范围查询，矩形范围（基于LBS）

$center       范围醒询，圆形范围（基于LBS）

$centerSphere　　范围查询，球形范围（基于LBS）

$slice　　　　查询字段集合中的元素（比如从第几个之后，第N到第M个元素）
```

## 数量查询

```javascript
Model.count(conditions, [callback])
```

## 分页查询

```javascript
var pageSize = 5;                   //一页多少条
var currentPage = 1;                //当前第几页
var sort = {'logindate':-1};        //排序（按登录时间倒序）
var condition = {};                 //条件
var skipnum = (currentPage - 1) * pageSize;   //跳过数
User.find(condition).skip(skipnum).limit(pageSize).sort(sort).exec(function (err, res) {
  if (err) {
     console.log("Error:" + err);
  }
  else {
     console.log("Res:" + res);
  }
})
```

## 关联populate

### 为什么

Mongodb是文档型数据库，它没有关系型数据库joins（数据库的两张表通过外键，建立连接关系）特性。在建立数据关联时会比较麻烦，Mongoose的populate方法可以实现在一个document中引用其他collections的document。在定义schea时候，如果设置某个field关联另一个schema，那么在获取document的时候就可以使用population功能通过关联schema的field找到另一个document，并且用被关联document的内容替换掉原来关联字段（field）的内容。如果不用populate的话，关联字段其实就会显示为一些ObjectID,如果使用populate的话，可以将这些ObjectID转化为对象

```javascript
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var UserSchema = new Schema({
    name  : { type: String, unique: true },
    posts : [{ type: Schema.Types.ObjectId, ref: 'Post' }]
});
var User = mongoose.model('User', UserSchema);

var PostSchema = new Schema({
    poster   : { type: Schema.Types.ObjectId, ref: 'User' },
    comments : [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    title    : String,
    content  : String
});
var Post = mongoose.model('Post', PostSchema);

var CommentSchema = new Schema({
    post      : { type: Schema.Types.ObjectId, ref: "Post" },
    commenter : { type: Schema.Types.ObjectId, ref: 'User' },
    content   : String
});
var Comment = mongoose.model('Comment', CommentSchema);
```

### Query#populate

Query.populate(path,[select],[model],[match],options)

* @argument path <String>or<Object>,为string时表示要引用的关联字段，多个字段用空格分隔，Object即把populate的参数封装到一个对象里，也可以是一个数组

* @argument select <String>or <Object>表示引用document中的哪些字段

* @argument model <Model>,关联字段的model，如果没有指定就会使用Schema的ref

* @argument match <Object> 指定附加查询条件

* @argument options <Object> 指定附加其他查询条件，排序or条数限制

```javascript
//这里叫引用略微有点不好，叫关联比较好感觉
//引用所有 users 的 posts
User.find()
    .populate('posts', 'title', null, {sort: { title: -1 }})
    .exec(function(err, docs) {
        console.log(docs[0].posts[0].title); // post-by-aikin
    });

//引用 user 'luajin'的 posts
User.findOne({name: 'luajin'})
    .populate({path: 'posts', select: { title: 1 }, options: {sort: { title: -1 }}})
    .exec(function(err, doc) {
        console.log(doc.posts[0].title);  // post-by-luajin
    });
```

```javacript
Post.findOne({title: 'post-by-aikin'})
    .populate('poster comments', '-_id')
    .exec(function(err, doc) {
        console.log(doc.poster.name);           // aikin
        console.log(doc.poster._id);            // undefined

        console.log(doc.comments[0].content);  // comment-by-luna
        console.log(doc.comments[0]._id);      // undefined
    });

Post.findOne({title: 'post-by-aikin'})
    .populate({path: 'poster comments', select: '-_id'})
    .exec(function(err, doc) {
        console.log(doc.poster.name);           // aikin
        console.log(doc.poster._id);            // undefined

        console.log(doc.comments[0].content);  // comment-by-luna
        console.log(doc.comments[0]._id);      // undefined
    });

//上两种引用的方式实现的功能是一样的。就是给 populate 方法的参数不同。
//这里要注意，当两个关联的字段同时在一个 path 里面时， select 必须是 document(s)
//具有的相同字段。


//如果想要给单个关联的字段指定 select，可以传入数组的参数。如下：

Post.findOne({title: 'post-by-aikin'})
    .populate(['poster', 'comments'])
    .exec(function(err, doc) {
        console.log(doc.poster.name);          // aikin
        console.log(doc.comments[0].content);  // comment-by-luna
    });

Post.findOne({title: 'post-by-aikin'})
    .populate([
        {path:'poster',   select: '-_id'},
        {path:'comments', select: '-content'}
    ])
    .exec(function(err, doc) {
        console.log(doc.poster.name);          // aikin
        console.log(doc.poster._id);           // undefined

        console.log(doc.comments[0]._id);      // 会打印出对应的 comment id
        console.log(doc.comments[0].content);  // undefined
    });
```

## Model#populate

Model.populate(docs,options,[cb(err,doc)])

* @argument docs <Document> or <Array>,单个需要被引用的document或者document数组
* @argument options <Object> 键和Query#populate方法参数相同

```javascript
Post.find({title: 'post-by-aikin'})
    .populate('poster comments')
    .exec(function(err, docs) {

        var opts = [{
            path   : 'comments.commenter',
            select : 'name',
            model  : 'User'
        }];

        Post.populate(docs, opts, function(err, populatedDocs) {
            console.log(populatedDocs[0].poster.name);                  // aikin
            console.log(populatedDocs[0].comments[0].commenter.name);  // luna
        });
    });
```

### Document#populate

Document.populate([path],[callback])

```javascript
User.findOne({name: 'aikin'})
    .exec(function(err, doc) {

        var opts = [{
            path   : 'posts',
            select : 'title'
        }];

        doc.populate(opts, function(err, populatedDoc) {
            console.log(populatedDoc.posts[0].title);  // post-by-aikin
        });
    });
```

## some tips

### path的一些用法

* path.resolve([from..],to):将to参数解析为绝对路径如果参数to当前不是绝对的，系会将from参数按从右边到左的顺序前缀到to上，直到找一一个绝对路径为止。如果找不到，则将当前工作目录作为参数合并。最终返回的是一个标准化的字符串。
可以将这个方法理解成从做到又的一组cd 命令，最后pwd的结果

```javascript
path.resolve('/foo/bar','./baz') ==>/foo/bar/baz
path.resolve('/foo/bar','/tmp/file/') ==>/tmp/file
```

* path.join([path1],[path2],[...]):该方法用于合并方法中的各参数并得到一个标准化合并的路径字符串

```javascript
path.join(__dirname,'tt') ==>c:/users/nightfire/desktop/code/nodetest/tt
path.join(__dirname,'/tt') ==>c:/users/nightfire/desktop/code/nodetest/tt
```

### 使用express托管静态文件

* app.use('/public',express.static(path)) -->表示以/public开头的请求都会去访问静态资源，静态资源的根目录是pathlocalhost/public/img/1.jpg ==> localhost/path/img/1.jpg

* app.use(express.static(path)) -->表示根目录的的静态文件会被映射到path目录下localhost/css/reset.css ==> localhost/path/css/reset.css

### 关于路径？为什么有些地方用绝对路径，有些地方用相对路径。

1. express.Router以及express.use的第一个参数都应该是绝对路径。可以理解为请求进入了服务器环境下的根目录了
2. 后面使用res.render('admin/index',{})第一个参数千万不能写成'/admin/index',要不然会报错，/admin/index  在/view中找不到。
这是因为在app.js里面我们就定义了模板在view目录下面。这里使用相对路径即可。如果使用绝对路径就会找不到

### app.use()和app.all()的区别？

* all执行完整匹配，use只匹配前缀

```javascript
app.use('/a',(req,res,next) => {})
app.all('/a',(req,res,next) => {})
如果访问  '/a' 二者都会被调用
如果访问  '/a/b'  只有use会被调用

```

* use()的路径参数如果省略的话，则默认是 / ，则将第二个参数应用到所有请求，不管是get还是post。一般用来加载中间件

### express中间件

* next('route') will work only in middleware functions that were loaded by using the app.METHOD() or router.METHOD() functions.

* next其实可以指定跳过某些中间件

#### 中间件类型

1. application-level-middleware:  app.use()和app.METHOD()是以express对象进行调用的

2. router-level-middleware: router.use()和router.METHOD()和application-level-middleware差不多，只不多是以express.Router对象实例来调用的其实express.Router和express对象差不多，可以称为一个小应用

3. error-handling-middleware: 必须指明四个参数

```javascript
app.use(function(err,req,res,next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})
```
4. Built-in middleware:和旧版本的Connect效果差不多，现在都独立成模块了
* express.static:处理静态文件如html文件，图片，等等
* express.json：
* express.urlencoded：将请求用url-encoded处理
* Third-party middleware