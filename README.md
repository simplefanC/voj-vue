# voj-vue

## 前言

该项目为前后端分离项目的前端部分，后端项目`voj`地址：[传送门](https://github.com/simplefanC/voj) 。

## 项目介绍

`voj-vue`是一个在线评测系统的前端项目，基于Vue+Element实现。主要包括前台页面（首页、题目、训练、比赛、评测、排名、讨论、关于），后台管理等功能。

### 项目文档

项目文档地址：[https://docs.voj.mobi](https://docs.voj.mobi/)

### 项目结构

``` lua
src -- 源码目录
├── assets -- 静态图片资源文件
├── common -- 工具类、网络请求定义等
├── components -- 通用组件封装
├── i18n -- 国际化文件
├── router -- vue-router路由配置
├── store -- vuex的状态管理
└── views -- 前端页面
    ├── oj -- 前台页面
    └── admin -- 后台管理页面
```

### 技术选型

| 技术              | 说明                    | 官网                                            |
| ----------------- | ----------------------- | ----------------------------------------------- |
| Vue               | 前端框架                | https://vuejs.org                               |
| Vue-router        | 路由框架                | https://router.vuejs.org                        |
| Vuex              | 全局状态管理框架        | https://vuex.vuejs.org                          |
| Element           | 前端UI框架              | https://element.eleme.io                        |
| Axios             | 前端HTTP框架            | https://github.com/axios/axios                  |
| vxe-table         | Vue 表格解决方案        | https://github.com/x-extends/vxe-table          |
| mavonEditor       | 基于Vue的markdown编辑器 | https://github.com/hinesboy/mavonEditor         |
| CodeMirror        | 在线代码编辑器          | https://codemirror.net                          |
| vue-i18n          | Vue.js 的国际化插件     | https://github.com/kazupon/vue-i18n             |
| Vue-ECharts       | 基于Echarts的图表框架   | https://github.com/ecomfe/vue-echarts           |
| nprogress         | 进度条控件              | https://github.com/rstacruz/nprogress           |
| vue-element-admin | 项目脚手架参考          | https://github.com/PanJiaChen/vue-element-admin |

### Project setup

```shell
# 安装依赖
npm install

# 启动服务 localhost:8088
npm run serve

# 构建生产环境
npm run build
```
