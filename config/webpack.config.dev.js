const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const HappyPack = require('happypack');
const { CleanTerminalPlugin } = require('./tools');
const baseWebpackConfig = require('./webpack.base');
const devServer = require('./webpackDevServer.config');
const paths = require('./paths');

const webpackConfig = merge(baseWebpackConfig, {
    mode: 'development',
    cache: true,
    devtool: 'source-map',
    resolve: {
        alias: {
            'react-dom': '@hot-loader/react-dom'
        }
    },
    output: {
        path: paths.appBuild,
        publicPath: '/',
        filename: 'static/js/[name].bundle.js',
        chunkFilename: 'static/js/[name].chunk.js',
        devtoolModuleFilenameTemplate: info => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                enforce: 'pre',
                use: 'happypack/loader?id=happyESLint',
                include: paths.appSrc
            },
            {
                oneOf: [
                    {
                        test: /\.(js|jsx)$/,
                        include: paths.appSrc,
                        exclude: /node_modules/,
                        use: 'happypack/loader?id=happyBabel'
                    },
                    {
                        test: /\.css$/,
                        exclude: /node_modules/,
                        include: paths.appSrc,
                        use: 'happypack/loader?id=happyCSS'
                    }
                ]
            }
        ]
    },
    plugins: [
        new CleanTerminalPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),

        new webpack.DllReferencePlugin({
            manifest: path.join(paths.appVendor, 'antd.manifest.json')
        }),
        new HappyPack({
            id: 'happyCSS',
            threads: 4,
            loaders: [
                require.resolve('style-loader'),
                {
                    loader: require.resolve('css-loader'),
                    options: {
                        importLoaders: 1
                    }
                },
                require.resolve('postcss-loader')
            ],
            verbose: false
        }),

        new HappyPack({
            id: 'happyBabel',
            threads: 4,
            loaders: [
                {
                    loader: require.resolve('babel-loader'),
                    options: {
                        customize: require.resolve('babel-preset-react-app/webpack-overrides'),
                        plugins: [
                            [
                                require.resolve('babel-plugin-named-asset-import'),
                                {
                                    loaderMap: {
                                        svg: {
                                            ReactComponent: '@svgr/webpack?-svgo![path]'
                                        }
                                    }
                                }
                            ],
                            ['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }]
                        ],
                        cacheDirectory: true,
                        cacheCompression: false,
                        compact: false
                    }
                }
            ],
            verbose: false
        }),

        new HappyPack({
            id: 'happyESLint',
            threads: 5,
            loaders: [
                {
                    options: {
                        formatter: require.resolve('react-dev-utils/eslintFormatter'),
                        eslintPath: require.resolve('eslint')
                    },
                    loader: require.resolve('eslint-loader')
                }
            ],
            verbose: false
        })
    ],
    devServer
});

module.exports = webpackConfig;
