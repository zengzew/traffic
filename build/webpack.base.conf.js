'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

// const BrotliPlugin = require('brotli-webpack-plugin');
// const FontminPlugin = require('fontmin-webpack')

if (process.env.NODE_ENV === 'production') {
  console.log('你正在生产环境');
} else {
  console.log('你正在使用开发环境');
}

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    entry: {
        app: './src/main.js'
    },
    output: {
        path: config.build.assetsRoot,
        filename: '[name].js',
        publicPath: process.env.NODE_ENV === 'production' ?
            config.build.assetsPublicPath :
            config.dev.assetsPublicPath
    },
    resolve: {
        extensions: ['.js', '.vue', '.less', '.css', '.scss', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': resolve('src'),
            'sysStatic': resolve('src/assets'),
            'sysComponents': resolve('src/components'),
            'sysPage': resolve('src/page')
        }
    },
    module: {
        rules: [
            // {
						// 	enforce: "pre",
						// 	test: /\.(js|vue)$/,
						// 	loader: 'eslint-loader',
						// 	include: [resolve('src'), resolve('test')],
						// 	options: {
						// 			formatter: require('eslint-friendly-formatter')
						// 	}
            // },
            {
							test: /\.vue$/,
							loader: 'vue-loader'
            },
            // {
            //     test: /\.jpg|\.png|\.jpeg|\.svg|\.ttf|\.woff$/,
            //     use: [{
            //         loader: 'file-loader',
            //         options: {
            //             name: '[name].[ext]',
            //             outputPath: './img',
            //             publicPath: './img'
            //         }
            //     }]
            // },
            {
							test: /\.js$/,
							loader: 'babel-loader',
                            include: [resolve('src'), resolve('test')],
                            exclude:/style.js/
            },
            {
							test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
              use: [
                {
                  loader: 'url-loader',
                  options: {
                    limit: 10000,
                    name(file){
                      return utils.keepAssetsPath({
                        // 打包后文件名
                        name: '[name].[hash:7].[ext]',
                        // 图片文件夹所在父级的绝对路径
                        assetsPath: resolve('src/assets'),
                        outputPath: './img',
                        publicPath: '/',
                        // 图片文件绝对路径，不需要修改
                        file: file
                      })
                    }
                  }
                },
                {
                  loader: 'image-webpack-loader',
                  options: {
                    bypassOnDebug: true,
                    optipng: {
                      enabled: false,
                    },
                    pngquant: {
                      quality: [0.5, 0.65],
                      speed: 4
                    },
                  }
                }
              ],

            },
            {
							test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
							loader: 'url-loader',
							options: {
									limit: 10000,
									name: utils.assetsPath('media/[name].[hash:7].[ext]')
							}
            },
            {
							test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
							loader: 'file-loader',
							options: {
									// limit: 10000,
									name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
							}
            },
        ]
    },
    plugins: [
      new VueLoaderPlugin(),
      /*new FontminPlugin({
        autodetect: true, // automatically pull unicode characters from CSS
        glyphs: [ '车','辆','轨','迹','管', '理', '平', '台'/!* extra glyphs to include *!/],
        // glyphs: []
      }),*/
      /*new BrotliPlugin({
        asset: '[path].br',
        test: /.(js|css|svg|png)$/
      })*/
    ]
}
