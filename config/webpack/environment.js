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
// const ExtractTextPlugin = require('extract-text-webpack-plugin')

// environment.loaders.append('scss', {
//   test: /\.(scss|sass|css)$/i,
//   use: ExtractTextPlugin.extract({
//     fallback: 'style-loader',
//     use: [
//       { loader: 'css-loader', options: {
//           modules: true,
//           sourceMap: true,
//           importLoaders: 2,
//           localIdentName: '[name]__[local]___[hash:base64:5]'
//         }
//       },
//     'postcss-loader',
//     'sass-loader'
//     ]
//   })
// });

module.exports = environment
