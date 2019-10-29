const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  outputDir: '../docs',
  publicPath: process.env.NODE_ENV === 'production' ? '/vant-demo/' : '/',

  lintOnSave: true,
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('@assets',resolve('src/assets'))
  },

  devServer: {
    // development server port 8000
    port: 3082,
    // If you want to turn on the proxy, please remove the mockjs /src/main.jsL11
    proxy: {
      '/api': {
        target: 'http://devapi.vxiaocheng.com',
        pathRewrite: { '^/api': '' },
        ws: false,
        changeOrigin: true
      }
    }
  },
};
