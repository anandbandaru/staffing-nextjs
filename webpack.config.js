const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  // Your existing webpack configuration
  plugins: [
    new BundleAnalyzerPlugin()
  ]
};