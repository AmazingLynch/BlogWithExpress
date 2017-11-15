# express + mongodb 搭建博客系统

## 使用方法

1. 安装node，mongodb

2. 将此项目clone到本地

3. 启动mongodb数据库服务
```
mongod --dbpath=[path]
需要在mongodb 的安装目录下的bin目录下执行
path为数据存储位置
``` 

4. 安装项目依赖
在项目根目录下执行以下命令 
```npm install```

5. 启动程序
执行app.js文件，可以使用以下命令
```node app.js```

6. 打开浏览器localhost:8080