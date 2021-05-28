'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const mapConfig = require('../src/config/envConfig') // 项目配置文件
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

//让打包的时候输出可配置的文件
const GenerateAssetPlugin = require('generate-asset-webpack-plugin');
var createServerConfig = function(compilation){
    return JSON.stringify(mapConfig);
}

function recursiveIssuer(m) {
    if (m.issuer) {
      return recursiveIssuer(m.issuer);
    } else if (m.name) {
      return m.name;
    } else {
      return false;
    }
}


const webpackConfig = merge(baseWebpackConfig, {
    entry: {
        'theme-default': './src/assets/css/theme-default.scss'
    },
    module: {
        rules: utils.styleLoaders({
            sourceMap: config.build.productionSourceMap,
            extract: true
        })
    },
    devtool: config.build.productionSourceMap ? '#source-map' : false,
    output: {
        path: config.build.assetsRoot,
        filename: utils.assetsPath('js/[name].[chunkhash:7].js'),
        chunkFilename: utils.assetsPath('js/[name].[chunkhash:7].js')
    },
    mode: "production",
    // 文件压缩及chunk分离
    // https://github.com/webpack/webpack/issues/6409
    // https://gist.github.com/sokra/1522d586b8e5c0f5072d7565c2bee693
    optimization: {
        minimizer: [
            // js mini
            new UglifyJsPlugin({
                uglifyOptions: {
                    compress: {
                        warnings: false,  //删除无用代码时不输出警告
                        drop_console: true,  //删除所有console语句，可以兼容IE
                        collapse_vars: true,  //内嵌已定义但只使用一次的变量
                        reduce_vars: true,  //提取使用多次但没定义的静态值到变量
                    },
                    output: {
                        beautify: false, //最紧凑的输出，不保留空格和制表符
                        comments: false, //删除所有注释
                    },
                },
              cache: true, // 是否启用文件缓存，默认缓存在node_modules/.cache/uglifyjs-webpack-plugin.目录
              parallel: true, // 使用多进程并行运行来提高构建速度
              sourceMap: config.build.productionSourceMap // set to true if you want JS source maps
            }),
            // css mini
            new OptimizeCSSPlugin({})
        ],
        splitChunks: {
            chunks: 'async',
            minSize: 30000,
            maxAsyncRequests: 8,
            maxInitialRequests: 5,
            name: true,
            cacheGroups: {
                default: {
                    priority: -20,
                    reuseExistingChunk: true,
                },
                vendors: {
                    name: 'vendors',
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    chunks: "all"
                },
                vendors_ele: {
                    name: 'vendors_ele',
                    test: /element-ui/,
                    chunks: "all",
                },
                vendors_xlsx: {
                    name: 'vendors_xlsx',
                    // test: function(module){
                    //     var context = module.context;
                    //     return context && (context.indexOf('xlsx') >= 0 || context.indexOf('iconv-lite') >= 0)
                    // },
                    test: /xlsx/,
                    priority: 10,
                    chunks: "all",
                    reuseExistingChunk: false,
                },
                moment: {
                    name: 'moment',
                    // test: function(module){
                    //     var context = module.context;
                    //     return context && (context.indexOf('xlsx') >= 0 || context.indexOf('iconv-lite') >= 0)
                    // },
                    test: /moment/,
                    priority: 10,
                    chunks: "all",
                    reuseExistingChunk: false,
                },
                /*themeDark: {
                    name: 'theme-dark',
                    test: (m,c,entry = 'theme-dark') => recursiveIssuer(m) === entry,
                    chunks: 'all'
                },*/
                themeDefault: {
                    name: 'theme-default',
                    test: (m,c,entry = 'theme-default') => recursiveIssuer(m) === entry,
                    chunks: 'all'
                },
                echarts: {
                    name: 'echarts',
                    chunks: 'all',
                    priority: 20,
                    test: function(module){
                        var context = module.context;
                        return context && (context.indexOf('echarts') >= 0 || context.indexOf('zrender') >= 0)
                    }
                }
            }
        }
    },
    plugins: [
        // extract css into its own file
        new MiniCssExtractPlugin({
            filename: utils.assetsPath('css/[name].[contenthash:7].css')
        }),
        // generate dist index.html with correct asset hash for caching.
        // you can customize output by editing /index.html
        // see https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({
            filename: config.build.index,
            template: './src/index.html',
            inject: true,
            minify: false,
            chunksSortMode: 'none',
            favicon: 'favicon.ico',
            // necessary to consistently work with multiple chunks via CommonsChunkPlugin
            // chunksSortMode: 'dependency',
            excludeChunks: ['theme-default', 'theme-dark']
        }),
        // keep module.id stable when vender modules does not change
        new webpack.HashedModuleIdsPlugin(),
        // copy custom static assets
        new CopyWebpackPlugin([
          {
            from: path.resolve(__dirname, '../server.js'),
            to: config.build.assetsPublicPath,
            ignore: ['.*']
          },
            {
                from: path.resolve(__dirname, '../static'),
                to: config.build.assetsSubDirectory,
                ignore: ['.*']
            }
        ]),
        /*new BundleAnalyzerPlugin({
            analyzerPort: 8889,
        }),*/
        new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/)

        /* new GenerateAssetPlugin({
             filename: 'serverconfig.json',
             fn: (compilation, cb) => {
                 cb(null, createServerConfig(compilation));
             },
             extraFiles: []
         })*/
    ]
})

if (config.build.productionGzip) {
    var CompressionWebpackPlugin = require('compression-webpack-plugin')

    webpackConfig.plugins.push(
        new CompressionWebpackPlugin({
            filename: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp(
                '\\.(' +
                config.build.productionGzipExtensions.join('|') +
                ')$'
            ),
            deleteOriginalAssets:false,
            threshold: 10240,
            minRatio: 0.8
        })
    )
}

// if (config.build.bundleAnalyzerReport) {
//     var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
//     webpackConfig.plugins.push(new BundleAnalyzerPlugin())
// }

module.exports = webpackConfig
