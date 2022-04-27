const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin;
const deps = require('./package.json').dependencies;
module.exports = {
  entry: './src/index',
  cache: false,

  mode: 'development',
  devtool: 'source-map',

  optimization: {
    minimize: false,
  },

  output: {
    publicPath: 'auto',
  },

  resolve: {
    extensions: ['.jsx', '.js', '.json', '.mjs'],
  },

  module: {
    rules: [
      {
        test: /\.m?js$/,
        type: 'javascript/auto',
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.jsx?$/,
        loader: require.resolve('babel-loader'),
        exclude: /node_modules/,
        options: {
          presets: [require.resolve('@babel/preset-react')],
        },
      },
      {
        test: /\.svg/,
        use: {
          loader: "svg-url-loader",
          options: {
            // make all svg images to work in IE
            iesafe: true,
          },
        },
      },
    ],
  },

  plugins: [
    new ModuleFederationPlugin({
      name: 'remote_react',
      filename: 'remoteEntry.js',
      remotes: {
        react_container: 'react_container@http://localhost:3000/remoteEntry.js',
      },
      exposes: {
        './Nav': './src/components/Nav',
      },
      shared: {
        ...deps,
        // 'react-router-dom': {
        //   singleton: true,
        // },
        // 'react-dom': {
        //   singleton: true,
        // },
        // react: {
        //   singleton: true,
        // },
      },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
};
