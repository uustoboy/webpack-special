const path = require('path');
const webpack = require("webpack");
const glob = require("glob");

const MiniCssExtractPlugin = require("mini-css-extract-plugin"); //分离css
// html模板
const htmlWebpackPlugin = require("html-webpack-plugin");
//静态资源输出
const copyWebpackPlugin = require("copy-webpack-plugin");
const rules = require("./webpack.rules.conf.js");

const {projectPath} = require("../package.json");
let projectPathUrl = path.join(__dirname, `../src/special/${projectPath}`);

function getEntry() {
    var entryJson = {
        entry:{},
        html:[]
    };
    //读取src目录所有page入口
    glob.sync(`./src/special/${projectPath}/js/*.ts`)
        .forEach(function (name) {
            var eArr = [];
            let start = name.indexOf('js/')+3,
                 end = name.length - 3;
            n = name.slice(start, end); //保存各个组件的入口 
            eArr.push(name);
            glob.sync(`./src/special/${projectPath}/*.html`).forEach(function(htmlName){
                let htmlStart = htmlName.indexOf(`${projectPath}/`)+(projectPath.length+1),
                htmlEnd = htmlName.length - 5;
                let newName = htmlName.slice(htmlStart, htmlEnd);
                if( newName.indexOf(n) != -1 ){
                    eArr.push(htmlName);
                    entryJson.html.push({
                      filename:`${newName}.html`,
                      template:htmlName,
                      inject: true,
                      hash: false, //开启hash  ?[hash]
                      chunks:[n],
                      minify: process.env.NODE_ENV === "development" ? false : {
                            removeComments: true, //移除HTML中的注释
                            collapseWhitespace: true, //折叠空白区域 也就是压缩代码
                            removeAttributeQuotes: true, //去除属性引用
                      },
                    });
                }
            });
            entryJson.entry[n] = eArr;
        });
    return entryJson;
};

module.exports = {
    entry: getEntry().entry,
    module: {
        rules: [...rules]
    },
    resolve: {
        alias: {
            $utils: path.resolve(__dirname, '../src/utils')
        },
        extensions: ['.js', '.json','.ts','.jsx'],
        modules: [path.resolve(__dirname, '../../node_modules'), 'node_modules']
    },
    //将外部变量或者模块加载进来
    externals: {
        'jquery': 'jQuery',
        '$': 'window.jQuery'
    },
    target: ['web', 'es5'],
    plugins: [
        //静态资源输出
        // new copyWebpackPlugin([{
        //     from: path.resolve(__dirname, "../src/static"),
        //     to: './static',
        //     ignore: ['.*']
        // }]),
        new MiniCssExtractPlugin({
          filename: "./css/[name].css",
          chunkFilename: "./css/[name].css",
        }),
    ],

}

//配置页面
const entryObj = getEntry();
entryObj.html.forEach(element=>{
    module.exports.plugins.push(new htmlWebpackPlugin(element));
})

