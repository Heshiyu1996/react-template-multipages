const fs = require('fs');
const glob = require('glob');
const path = require('path');
const paths = require('./paths');
const env = require('./env');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// 读取less全局变量至less-loader
const getLessVariables = fileList => {
    let variables = {};
    fileList.forEach(file => {
        let themeContent = fs.readFileSync(file, 'utf-8');
        themeContent.split('\n').forEach(function(item) {
            if (item.startsWith('//') || item.indexOf('/*') > -1) return;
            let _pair = item.split(':');
            if (_pair.length < 2) return;
            let key = _pair[0].replace('\r', '').replace('@', '');
            if (!key) return;
            let value = _pair[1]
                .replace(';', '')
                .replace('\r', '')
                .replace(/^\s+|\s+$/g, '')
                .replace(/(\s*\/\/.*)/g, '');
            variables[key] = value;
        });
    });
    return variables;
};

// 动态扫描入口文件
const getEntry = () => {
    let entry = {};
    glob.sync(path.resolve(paths.appSrc, 'view/**/index.js')).forEach(function(fileDir) {
        let pathObj = path.parse(fileDir);
        let entryName = pathObj.dir.match(/\/[\w-]+$/g)[0].split('/')[1]; // 用文件夹名字作为入口名。
        entry[entryName] = fileDir;
    });
    return entry;
};

// 动态生成模板文件
const getHtmlWebpackPluginConfigs = () => {
    const entry = getEntry();
    const res = [];
    for (let [entryName] of Object.entries(entry)) {
        const plugin = new HtmlWebpackPlugin({
            template: paths.appHtml,
            filename: `${entryName}.html`,
            chunks: ['vendor', 'common', entryName],
            favicon: paths.appFavicon,
            templateParameters: {
                AntdDllSlot: !env.isProduction ? `<script src="./../../vendor/antd.dll.js"></script>` : ''
            },
            ...(env.isProduction
                ? {
                      minify: {
                          removeComments: true,
                          collapseWhitespace: true,
                          removeRedundantAttributes: true,
                          useShortDoctype: true,
                          removeEmptyAttributes: true,
                          removeStyleLinkTypeAttributes: true,
                          keepClosingSlash: true,
                          minifyJS: true,
                          minifyCSS: true,
                          minifyURLs: true
                      }
                  }
                : {})
        });
        res.push(plugin);
    }
    return res;
};

// 动态扫描404代替文件
// （使用HTML5 History API（即BrowserRouter）时，必须提供index.html页面来代替任何404响应。）
const getRewrites = () => {
    const entry = getEntry();
    const rewrites = [];
    for (let [entryName] of Object.entries(entry)) {
        let regex = eval('/^\\/' + entryName + '/');
        rewrites.push({ from: regex, to: `/${entryName}.html` });
    }
    return rewrites;
};

// 插件：保存时clear日志
class CleanTerminalPlugin {
    constructor(options = {}) {
        this.time = 0;
    }

    apply(compiler) {
        this.useCompilerHooks(compiler);
    }

    useCompilerHooks(compiler) {
        compiler.hooks.afterCompile.tap('CleanTerminalPlugin', () => this.clearConsole());
    }

    clearConsole() {
        if (this.time > 2) {
            console.clear();
        } else {
            this.time++;
        }
    }
}

module.exports = {
    getLessVariables,
    getEntry,
    getHtmlWebpackPluginConfigs,
    getRewrites,
    CleanTerminalPlugin
};
