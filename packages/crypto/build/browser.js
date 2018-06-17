const pkg = require('../package.json')
const browserify = require('browserify')
const path = require('path')
const fs = require('fs')

const resolve = (dir) => path.resolve(__dirname, '..', dir)

const browserKeys = Object.keys(pkg.browser)
const name = browserKeys[0]
const output = resolve(pkg.browser[name])
const dist = path.dirname(output)

fs.mkdir(dist, () => { // create the parent folder
  browserify(resolve(pkg.main), {
    standalone: Object.keys(pkg.browser)[0]
  })
    .transform('babelify', {
      presets: [
        ['@babel/preset-env', {
          modules: 'umd',
          targets: {
            browsers: 'defaults'
          }
        }]
      ]
    })
    .plugin('tinyify', { flat: false })
    .bundle()
    .pipe(fs.createWriteStream(output))
})
