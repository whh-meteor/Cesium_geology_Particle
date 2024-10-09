module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/, // 针对所有的 .js 文件
        exclude: /node_modules/, // 排除 node_modules 中的文件
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  }
}
