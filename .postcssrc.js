const env = require('./config/env');
const sourceMapEnabled = env.sourceMapEnabled;

module.exports = ({ env, options }) => ({
    plugins: [
        require('postcss-flexbugs-fixes'),
        require('postcss-preset-env')({
            autoprefixer: {
                ...options.autoprefixer,
                flexbox: 'no-2009'
            },
            stage: 3
        })
    ],
    sourceMap: env.isProduction ? sourceMapEnabled : true
})
