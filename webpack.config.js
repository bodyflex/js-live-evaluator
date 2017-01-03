const webpack = require('webpack');

module.exports = {
	context: __dirname,
	entry: './src/main.js',
	output: {
    path: './dist',
    filename: 'main.js'
  },
	module: {
		loaders: [
			{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react']
        }
      }
		]
	}
};
