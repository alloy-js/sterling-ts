const license = require('rollup-plugin-license');

export default {
    input: 'dist/Sterling.js',
    output: {
        file: `bundle/sterling-${process.env.VERSION}.js`,
        format: 'umd',
        name: 'alloy'
    },
    plugins: [
        license({
            banner: {
                commentStyle: 'ignored',
                content: { file: 'LICENSE' }
            }
        })
    ]
}
