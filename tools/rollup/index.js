const filesize = require('rollup-plugin-filesize')
const resolve = require('rollup-plugin-node-resolve')
const { terser } = require('rollup-plugin-terser')
const visualizer = require('rollup-plugin-visualizer')

const devPlugins = () => [resolve(), filesize(), visualizer()]

const prodPlugins = () => [resolve(), terser(), filesize(), visualizer()]

const config = ({ globals, external }) => (outFile, format, mode) => ({
  input: './lib/index.js',
  output: {
    file: `./dist/${outFile}`,
    format,
    globals,
    name: format === 'umd' ? 'vitusLabsCoolgrid' : undefined
  },
  external,
  plugins: mode === 'production' ? prodPlugins() : devPlugins()
})

const generateConfig = ({ name, globals, external }) => {
  const build = config({ globals, external })

  return [
    build(`${name}.js`, 'cjs', 'development'),
    build(`${name}.min.js`, 'cjs', 'production'),
    build(`${name}.umd.js`, 'umd', 'development'),
    build(`${name}.umd.min.js`, 'umd', 'production'),
    build(`${name}.module.js`, 'es', 'development')
  ]
}

exports.default = generateConfig
