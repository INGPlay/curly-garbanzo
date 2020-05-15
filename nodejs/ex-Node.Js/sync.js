const fs = require('fs');

console.log('A');
const result = fs.readFileSync('sample.txt', 'utf-8');
console.log(result);
console.log('C');


console.log('A');
fs.readFile('sample.txt', 'utf-8', function(error, result){
  while(true){

  }

  console.log('b');
});
console.log('C');
