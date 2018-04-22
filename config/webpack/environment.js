const { environment } = require('@rails/webpacker')
const merge = require('webpack-merge')

const myCssLoaderOptions = {
  modules: true,
  sourceMap: true,
  localIdentName: process.env.NODE_ENV === 'production'
    ? '[hash:base64:5]'
    : '[name]__[local]___[hash:base64:5]'
}

const CSSLoader = environment.loaders.get('sass').use.find(el => el.loader === 'css-loader')

CSSLoader.options = merge(CSSLoader.options, myCssLoaderOptions)

environment.loaders.append('file-loader', {
  test: /\.(jpg|png|gif|svg|pdf|ico)$/,
  use: [
    {
      loader: 'file-loader',
      options: {
        name: '[hash:8].[ext]'
      },
    },
  ]
});

module.exports = environment
