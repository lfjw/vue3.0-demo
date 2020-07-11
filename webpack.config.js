
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: 'development',
    // 配置入口文件的地址
    entry: path.resolve(__dirname,'src/index.js'),
    // 配置出口文件的地址
    output: {
        path: path.resolve(__dirname,'public'),
        filename: 'bundle.js',
    },
    // 配置模块，主要用来配置不同文件的加载器
    // 将scss转换成css typescript转换成js，模块转化器
    module: {

    },
    // 配置插件 
    // 打包流程增加功能，打包之前清空目录，打包之后新增
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname,'public/index.html'),
        })
    ],

    // 配置开发服务器
    devServer: {
        contentBase: path.resolve(__dirname, 'public'),
        host: 'localhost',
        compress: true,
        port: 8080
    },
}