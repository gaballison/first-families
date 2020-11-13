// rollup.config.js
export default {
    input: 'src/js/app.js',
    output: {
      file: 'js/bundle.js',
      format: 'iife', // immediately-invoked function expression — suitable for <script> tags
	  sourcemap: true
    }
  };