module.exports = {
  devServer: (devServerConfig) => {
    devServerConfig.client = devServerConfig.client || {};
    devServerConfig.client.overlay = false;
    return devServerConfig;
  },
  webpack: {
    configure: (webpackConfig) => {
      return webpackConfig;
    },
  },
};
