import nodeResolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'
import uglify from 'rollup-plugin-uglify'
import commonjs from 'rollup-plugin-commonjs'


var env = process.env.NODE_ENV
var config = {
  format: 'umd',
  moduleName: 'Cake',
  external: ['react', 'immutable'],
  globals: {
    react: 'React',
    immutable: 'Immutable'
  },
  plugins: [
    nodeResolve({
      jsnext: true,
      main: true,
      preferBuiltins: true,
      browser: true
    }),
    commonjs({
      include: 'node_modules/**',
      namedExports: {
        'node_modules/react/react.js': ['PropTypes', 'createElement'],
      }
    }),
    babel({
      exclude: 'node_modules/**'
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(env)
    })
  ]
}


if (env === 'production') {
  config.plugins.push(
    uglify({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false
      }
    })
  )
}


export default config
