const fs = require('fs');
const program = require('commander');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');


program
      .option('-a, --add-page <n>', 'add page')
      .option('-d, --delete-page <n>', 'delete page')
      .parse(process.argv);


const addPageName = program.addPage;
const deletePageName = program.deletePage;
const pagePath = path.resolve(rootDir, 'src/pages/');
// 删除page
function deleteFolder(filePath) {
  if (fs.existsSync(filePath)) {
    const files = fs.readdirSync(filePath)
    files.forEach((file) => {
      const nextFilePath = `${filePath}/${file}`
      const states = fs.statSync(nextFilePath)
      if (states.isDirectory()) {
        deleteFolder(nextFilePath)
      } else {
        fs.unlinkSync(nextFilePath)
      }
    })
    fs.rmdirSync(filePath)
  }else {
    fs.rmdirSync(filePath)
  }
}
// 添加页面和删除页面
if(addPageName) {
  const newPagePath = path.resolve(pagePath, addPageName);
  const html = fs.readFileSync(path.resolve(__dirname, './temp/index.html'));
  const js = fs.readFileSync(path.resolve(__dirname, './temp/index.js'));
  const vue = fs.readFileSync(path.resolve(__dirname, './temp/index.vue'));
  
  fs.mkdirSync(newPagePath);
  fs.writeFile(path.resolve(newPagePath, 'index.html'), html, ()=>{
    console.log('Write file failed')
  });
  fs.writeFile(path.resolve(newPagePath, 'index.js'), js, () => {});
  fs.writeFile(path.resolve(newPagePath, 'index.vue'), vue, ()=>{});
} else if (deletePageName) {
  const deletePagePath = path.resolve(pagePath, deletePageName);
  deleteFolder(deletePagePath)
}