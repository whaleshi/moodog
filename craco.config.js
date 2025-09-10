module.exports = {
  devServer: (devServerConfig) => {
    devServerConfig.client = devServerConfig.client || {};
    devServerConfig.client.overlay = false;
    return devServerConfig;
  },
  webpack: {
    configure: (webpackConfig) => {
      // 添加 Node.js polyfills
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        "path": require.resolve("path-browserify"),
        "os": require.resolve("os-browserify"),
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
        "buffer": require.resolve("buffer"),
        "util": require.resolve("util"),
        "url": require.resolve("url"),
        "fs": false,
        "net": false,
        "tls": false
      };
      
      // 暂时禁用 ESLint
      webpackConfig.plugins = webpackConfig.plugins.filter(
        plugin => plugin.constructor.name !== 'ESLintWebpackPlugin'
      );
      
      return webpackConfig;
    },
  },
};
