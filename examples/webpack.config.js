const fs = require("fs");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = fs
  .readdirSync(__dirname)
  .filter(file => fs.lstatSync(path.resolve(__dirname, file)).isDirectory())
  .map(dir => {
    return {
      entry: path.resolve(__dirname, `./${dir}/index.js`),
      output: {
        path: path.join(__dirname, `../__build__/${dir}`),
        filename: "index.js"
      },
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: "babel-loader"
          }
        ]
      },
      resolve: {
        alias: {
          "plume-core": path.join(__dirname, "..", "src")
        }
      },
      plugins: [
        new HtmlWebpackPlugin({
          inject: true,
          template: path.resolve(__dirname, `./${dir}/index.html`),
          filename: path.join(__dirname, `../__build__/${dir}/index.html`)
        }),
        new HtmlWebpackPlugin({
          inject: true,
          template: path.resolve(__dirname, `./index.html`),
          filename: path.join(__dirname, `../__build__/index.html`)
        })
      ]
    };
  });
