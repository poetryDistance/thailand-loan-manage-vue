'use strict'
const path = require('path')

// const webpack = require('webpack')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
// const productionGzipExtensions = ['js', 'css']

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = '泰国后台管理系统'

// 如果端口设置为80，
// 使用管理员权限执行命令行。
// 例如，Mac:sudo npm run
// 可以通过以下方法更改端口：
// port=9528 npm run dev或npm run dev--port=9528
const port = process.env.port || process.env.npm_config_port || 9531 // dev port

module.exports = {
  /**
   * 如果计划在子路径下部署站点，则需要设置publicPath，
   * 例如GitHub页面。如果您计划将站点部署到https://foo.github.io/bar/,
   * 然后publicPath应设置为“/bar/”。
   * 在大多数情况下，请使用“/”！！！
  */
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    // 跨域
    proxy: {
      // dev环境
      '/thailoanMng': {
        target: process.env.VUE_APP_SERVER_URL + (process.env.VUE_APP_SERVER_PORT || ':1031'), // 设置你调用的接口域名和端口号 别忘了加http
        changeOrigin: true,
        pathRewrite: {
          '^/thailoanMng': 'thailoanMng'
        }
      },
      // dev环境
      '/thailand-manage': {
        target: process.env.VUE_APP_SERVER_URL + (process.env.VUE_APP_SERVER_PORT || ':2011'), // 设置你调用的接口域名和端口号 别忘了加http
        changeOrigin: true,
        pathRewrite: {
          '^/thailand-manage': 'thailand-manage'
        }
      }
    }
  },
  configureWebpack: {
    // 在webpack的name字段中提供应用程序的标题，以便它可以在索引.html插入正确的标题。
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
    //  开发环境推荐：
    //  cheap-module-eval-source-map
    //  生产环境推荐：
    //  cheap-module-source-map
    devtool: 'cheap-module-source-map',
    // devtool: 'inline-source-map'
    plugins: [
      new CompressionWebpackPlugin({
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.js$|\.html$|\.css/, // 匹配的文件名
        threshold: 10240, // 文件超过10k，进行gzip压缩
        minRatio: 0.8,
        deleteOriginalAssets: false // 是否删除原文件
      })
      // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

      // // 下面是下载的插件的配置
      // new CompressionWebpackPlugin({
      //   algorithm: 'gzip',
      //   test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
      //   threshold: 10240,
      //   minRatio: 0.8
      // }),
      // new webpack.optimize.LimitChunkCountPlugin({
      //   maxChunks: 5,
      //   minChunkSize: 100
      // })
    ]
  },
  chainWebpack(config) {
    // 它可以提高第一屏的速度，建议打开预加载
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        // 忽略运行时.js
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])

    // 当有很多页面时，会导致太多无意义的请求
    config.plugins.delete('prefetch')

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
            // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          config.optimization.runtimeChunk('single')
        }
      )
  }
}
