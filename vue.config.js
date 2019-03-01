let path = require('path')
let glob = require('glob')
const program = require('commander');
const chalk = require('chalk');
const ignoreEntries = require('./entry.ignore.js');
//配置pages多页面获取当前文件夹下的html和js
function getEntry(globPath) {
	let entries = {}, tmp, pathname;

	glob.sync(globPath).forEach(function(entry) {
		tmp = entry.split('/').splice(-3);
		pathname = tmp[1];
		entries[pathname]= {
			entry: 'src/' + tmp[0] + '/' + tmp[1] + '/' + 'index.js',
			template: 'src/' + tmp[0] + '/' + tmp[1] + '/' + tmp[2],
			title:  pathname,
			filename: pathname + '.html'
		};
	});
	return entries;
}

let pages = getEntry('./src/pages/**?/*.html');
//配置end

const demoExport = {
	lintOnSave: false, //禁用eslint
	publicPath:process.env.NODE_ENV === 'production' ? '/vue-cli-3.0-demo/':'/',
	productionSourceMap: false,
	pages,
	configureWebpack: config => {
    Object.assign(config, { // 开发生产共同配置
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
          '@c': path.resolve(__dirname, './src/components'),
          'vue$': 'vue/dist/vue.esm.js'
        }
      }
    })
	}
}

// 只启动需要的页面,隐藏不需要的页面
program.option('-e, --entries <list>', 'entries', str => str.split(','))
  .parse(process.argv);

ignoreEntries.forEach((entry) => {
  delete demoExport.pages[entry];
});
if (program.entries && program.entries.length) {
  const pageEntries = demoExport.pages;
  delete demoExport.pages;
  const newEntries = program.entries.reduce((left, right) => {
    left[right] = pageEntries[right];
    return left;
  }, {});
  demoExport.pages = newEntries;
}
console.info('hide entrance: ', chalk.red(ignoreEntries.join(',')));
console.info('current entrance: ', chalk.red((Object.keys(demoExport.pages))));

module.exports = demoExport;
