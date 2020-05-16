const testFolder = '../data/';
var fs = require  ('fs');

fs.readdir(testFolder, function(error, fileList){
  console.log(fileList);
})
