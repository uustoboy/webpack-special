# webpack-special
> webapck多页面开发专题

## 运行

```
#安装依赖
npm install

#切换专题路径
npm run bin

#本地开发
npm run dev

#编译打包
npm run build
```

### 切换目录方法
```
#npm run bin  (推荐)
或
手动改package.json:
"projectPath": "2020/test" 只需要从年份写目录
```

## 目录结构
```
│  bin.js                           切换文件路径
│  tsconfig.json                    typescript配置文件
│
├─build                             webpack目录
│      template.html                创建默认专题模板HTML
│      webpack.base.conf.js         webpack基础配置
│      webpack.dev.conf.js          webpack本地开发配置
│      webpack.prod.conf.js         webpack完成打包配置
│      webpack.rules.conf.js        webpack各种loader
│
└─src                               源码
    ├─special                       存放专题目录
    │  └─2020                       按年份分的专题
    │      └─test                   专题
    │          │  index.html        专题html
    │          │
    │          ├─css                专题css
    │          │      a.css
    │          │      b.less
    │          │      index.scss
    │          │
    │          ├─images             专题图片
    │          │      PC.png
    │          │
    │          └─js                 专题入口TS
    │              │  index.ts
    │              │
    │              └─lib            专题引用的JS
    │                      a.ts
    │
    └─utils                         专题公共TS
            utils.ts
```

### 感谢:
- [我有一把妖刀](https://juejin.cn/user/3087084381012558) : [webpack4 多页面，多环境配置](https://juejin.cn/post/6844903671445061640)
- [HEJIN2016](https://github.com/HEJIN2016)  : [webpack4-template](https://github.com/HEJIN2016/webpack4-template)
