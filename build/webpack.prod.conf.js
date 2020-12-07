const path = require('path');
const webpack = require("webpack");
const { merge } = require("webpack-merge");

const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');//
const {projectPath} = require("../package.json");
const TerserPlugin = require("terser-webpack-plugin");

// 清除目录等
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const webpackConfigBase = require('./webpack.base.conf');

const webpackConfigProd = {
    mode: 'production', // 通过 mode 声明生产环境
	output: {
		path: path.resolve(__dirname, `../../${projectPath}`),
		// 打包多出口文件
        filename: 'js/[name].js',
        publicPath: `//www.baidu.com/${projectPath}/`,
    },
    optimization: {
        concatenateModules: true,
        splitChunks: {
        //   chunks: 'all',
        //   name: 'commons',
        },
        runtimeChunk: {
	      name: entrypoint => `runtime-${entrypoint.name}`
	    },
	    minimize: false,
	    minimizer: [
	     new CssMinimizerPlugin({
	        parallel: true,
	      }),
	    //   new TerserPlugin()
	    ],
	    
	  },
    // devtool: 'cheap-source-map',
	plugins: [
		new CleanWebpackPlugin({ cleanStaleWebpackAssets: false })
		// new webpack.BannerPlugin({
		// 	banner: (yourVariable)=>{ 
		// 		var date = new Date();
		// 		var year = date.getFullYear();
		// 		var month = date.getMonth()+1;
		// 		month = month<10? `0${month}`:month;
		// 		var day = date.getDate();
		// 		day = day<10? `0${day}`:day;
		// 		var hour = date.getHours();
		// 		hour = hour<10? `0${hour}`:hour;
		// 		var minute = date.getMinutes();
		// 		minute = minute<10? `0${minute}`:minute;
		// 		var second = date.getSeconds();
		// 		second = second<10? `0${second}`:second;
		// 		var endTime = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
		// 		return `PackUser:uustoboy;\nPackTime:${endTime};`; 
		// 	}
		//   })
		//删除dist目录
		
		// new cleanWebpackPlugin(['dist'], {
		// 	root: path.resolve(__dirname, `../../${projectPath}`), //根目录
		// 	verbose: true, //开启在控制台输出信息
		// 	dry: false,
		// }),
	]

}
module.exports = merge(webpackConfigBase, webpackConfigProd);