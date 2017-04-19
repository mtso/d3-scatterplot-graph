const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const injectIndex = new HtmlWebpackPlugin({
  filename: 'index.html',
  title: 'Scatterplot Graph',
  injext: 'body',
})

module.exports = [
  {
    entry: path.resolve(__dirname, 'app/index'),
    resolve: { extensions: [ '.js', '.json' ] },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js',
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader?presets[]=es2015',
        },
      ],
    },
    plugins: [
      injectIndex,
    ],
  }
]
