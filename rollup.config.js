// rollup.config.js
export default {
    input: 'src/js/app.js',
    output: {
      file: 'js/app.js',
      format: 'iife', // immediately-invoked function expression — suitable for <script> tags
	  sourcemap: true
    }
  };