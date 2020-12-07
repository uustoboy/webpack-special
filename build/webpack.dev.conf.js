const path = require('path');
const webpack = require("webpack");
const { merge } = require("webpack-merge");
const webpackConfigBase = require('./webpack.base.conf');
const {projectPath} = require("../package.json");
const webpackConfigDev = {
	mode: 'development', // 通过 mode 声明开发环境
	output: {
		path: path.resolve(__dirname, '../dist'),
    	filename: './js/[name].js',
    	publicPath: '/'
	},
	devtool: 'inline-source-map',
	plugins:[
	 	new webpack.HotModuleReplacementPlugin()
	],
	devServer: {
		// index: 'index.html', // 为了可以展示目录
		contentBase: path.resolve(__dirname, '../dist'),
		publicPath:'/',
    	// compress: true,
		//监视contentBase目录下的所有文件，一旦文件变化就会reload（重载）
	    watchContentBase: true,
	    watchOptions: {
	      //忽略文件
	      ignored: /node_modules/
	    },
	    // hotOnly: true,
	    // https: true,
		publicPath:'/',
		// host: "127.0.0.1",
		port: "8090",
		// overlay: true, // 浏览器页面上显示错误
		open: true, // 开启浏览器
	    hot: true, //开启HMR功能
	    //除了一些基本的启动信息之外，其他内容都不要打印
    	quiet: true,
	    //不要显示启动服务器的日志信息
    	// clientLogLevel: 'none',
		// stats: "errors-only", //stats: "errors-only"表示只打印错误：
		//服务器代理配置项
        proxy: {
			"/baidu": {
				target: "https://www.baidu.com",
				pathRewrite: {'^/baidu' : ''},
				changeOrigin: true  //将localhost请求header的host源设置为目标target URL。
			}
		}
    },
}

module.exports = merge(webpackConfigBase, webpackConfigDev);




