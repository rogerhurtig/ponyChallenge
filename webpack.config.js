const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const dotenv = require('dotenv');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = (env) => {
  const basePath = `${path.join(__dirname)}/.env`;
  const envPath = env.development ? `${basePath}.development` : `${basePath}.production`;

  // Set the path parameter in the dotenv config
  const fileEnv = dotenv.config({ path: envPath }).parsed;

  // Reduce to a object, the same as before (but with the variables from the file)
  const envKeys = Object.keys(fileEnv).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(fileEnv[next]);
    return prev;
  }, {});

  return {
    entry: './src/index.tsx',
    devtool: 'inline-source-map',
    devServer: {
      host: '0.0.0.0',
      port: 8080
    },
    module: {
      rules: [
        {
          test: /\.html/,
          use: { options: { minimize: true }, loader: 'html-loader' }
        },
        {
          test: /\.css/,
          use: [
            'style-loader',
            { loader: 'css-loader', options: { importLoaders: 1 } }
          ]
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'img/'
              }
            }
          ]
        },
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        }
      ],
    },
    plugins: [
      new webpack.DefinePlugin(envKeys),
      new HtmlWebpackPlugin({
        template: './public/index.html',
        filename: './index.html',
        favicon: './public/favicon.png'
      }),
      new ForkTsCheckerWebpackPlugin({
        eslint: {
          files: './src/**/*.{ts,tsx,jsx}'
        }
      })
    ],
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
      publicPath: process.env.ASSET_PATH,
      clean: true, // Clean the output directory before emit
    },
    optimization: {
      splitChunks: {
        // include all types of chunks
        chunks: 'all'
      }
    }
  };
};