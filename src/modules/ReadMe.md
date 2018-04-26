## 多页模块目录

* 要求每个页面以不同的文件夹包裹

* 为便于迁移，每个文件夹底下有 index.html 和 main.js 为入口文件，构建后 html 文件名以文件夹名为准

* 引入 static 底下的文件时需要注意相对路径的问题，参考 example 底下的引入方式，module 内部请使用 import 方式引入 css 和 js
