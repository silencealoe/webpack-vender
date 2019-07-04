const htmlWebpackPlugin=require('html-webpack-plugin')
const path=require('path')
// const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports={
    entry:path.join(__dirname,'./src/main.js'),
    output:{
        path:path.join(__dirname,'dist'),
        filename:'bundle.js'
    },
    module:{
        rules:[
            {
                test:/\.css$/,
                use:['style-loader','css-loader']
            },{
                test:/\.scss$/,
                use:['style-loader','css-loader','sass-loader']
            },
            {//处理图片路径的loader,limit给的值是图片的大小，单位是byte,如果引用的图片大于或者等于给定的值，不会被转为base64,小于这个值转为base64
                test:/\.(jpg|png|gif|bmp|jpeg)$/,use:'url-loader?limit=1167777'
            }       ]
    },
    plugins:[
        new htmlWebpackPlugin({
            template:path.join(__dirname,'./src/index.html'),
            filename:'index.html'
        })
        
    ],
}