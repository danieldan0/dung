var path = require('path');

module.exports = {
  entry: './app/game.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      }
    ]
  },
  resolve: {
    root: [
      path.resolve('./app'),
      path.resolve('./node_modules')
    ]
  }
};
