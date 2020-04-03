const path = require('path')

module.exports = {
  entry: './src/dsynk.js',
  output: {
    filename: 'dsynk.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'dsynk'    
  }
}
