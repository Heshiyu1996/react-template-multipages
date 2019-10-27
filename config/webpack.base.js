const path = require('path');
const paths = require('./paths');
const webpack = require('webpack');
const WebpackBar = require('webpackbar');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { getEntry, getHtmlWebpackPluginConfigs } = require('./tools');
const { isProduction, sourceMapEnabled } = './env';

module.exports = {
    entry: getEntry(),
    externals: {
        // 将CDN形式加载的包从打包范围中移除（业务层的引入方式不变）
        lodash: '_',
        moment: 'moment',
        'moment/locale/zh-cn': 'moment.locale'
    },
    resolve: {
        modules: ['node_modules', paths.appNodeModules],
        extensions: ['.js', '.json', '.jsx'],
        alias: {
            '@ant-design/icons/lib/dist$': paths.antdIcon,
            '@': paths.appSrc
        }
    },
    module: {
        strictExportPresence: true,
        rules: [{ parser: { requireEnsure: false } }]
    },
    plugins: [
        // 动态生成html模板插件配置
        ...getHtmlWebpackPluginConfigs(),

        // 加载React（以DLL的形式）
        new webpack.DllReferencePlugin({
            manifest: path.join(paths.appVendor, 'react.manifest.json')
        }),

        // 直接拷贝vendor资源目录
        new CopyWebpackPlugin([
            {
                from: paths.appVendor, // vendor资源目录源地址
                to: path.join(paths.appBuild, 'vendor') //目标地址，相对于output的path目录
            }
        ]),

        // 打包忽略locale、moment
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

        // 与 devServer watchOptions 并存，不监听node_modules
        new webpack.WatchIgnorePlugin([path.join(__dirname, 'node_modules')]),
        new WebpackBar({
            minimal: false,
            compiledIn: false
        })
    ],
    node: {
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty'
    },

    performance: {
        hints: false
    },

    //压缩js
    optimization: {
        namedModules: true,
        nodeEnv: 'development'
    }
};
