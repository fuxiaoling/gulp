# 前端开发工作流工具
2016.5
## 概述
基于gulp的前端开发工作流应用实例，主要实现业务为：开发、检测、文档输出、构建打包。

## 功能
* 自动代理并启动本地server服务，分为src开发服务和dist测试服务
* 自动或手动命令编译LESS、SASS、SCSS、STYL、JSX、COFFEE、JADE、ES6语法或模板文件
* 监听HTML、JS、CSS等文档的编译或保存，自动刷新浏览器窗口，支持多浏览器同时调试
* JS、JSX、COFFEE三种文件保存时支持自动语法检查（可配置检查项，详见.jshintrc文件）
* JS文档保存时支持自动生成说明文档
* 可使用命令对单个模块或整个项目进行构建
* 支持CMD（seaJs）模式的JS架构打包
* 支持AMD（requireJs）模式的JS架构打包
* 构建时可自动混淆CSS和JS文件
* 构建时可统一对JS文件进行语言检查
* 构建时可对CSS文档中的图片进行合并（精灵图）
* 构建时可对CSS文件中的图片转为BASE64格式
* 构建时可对静态资源生成mini文件副本

## 文件说明
├── Readme.md                   // 使用说明
├── dist                        // 构建后的项目，config.js配置
│   ├── html                    // 构建后的html文件目录，config.js配置
│   │   ├── app1/mod1
│   │   │   ├── index.html
│   │   │   ├── header.html
│   │   │   ├── footer.html
│   │   ├── app2/mod2
│   │   │   ├── index.html
│   │   │   ├── header.html
│   │   │   ├── footer.html
│   ├── static                  // 构建后的静态资源目录，config.js配置
├── docs                        // JS说明文档目录，jsdoc.json配置
│   ├── ...                     // jsdoc.json配置
├── node_modules                // 工具运行依赖的模块
├── src                         // 项目源码，config.js配置
│   ├── html                    // config.js配置
│   ├── static                  // config.js配置
├── config                      // 配置
│   ├── default.json
│   ├── dev.json                // 开发环境
│   ├── experiment.json         // 实验
│   ├── index.js                // 配置控制
│   ├── local.json              // 本地
│   ├── production.json         // 生产环境
│   └── test.json               // 测试环境
├── data
├── doc                         // 文档
├── environment
├── gulpfile.js
├── locales
├── logger-service.js           // 启动日志配置
├── node_modules
├── package.json
├── app-service.js              // 启动应用配置
├── static                      // web静态资源加载
│   └── initjson
│   	└── config.js 		// 提供给前端的配置
├── test
├── test-service.js
└── tools
