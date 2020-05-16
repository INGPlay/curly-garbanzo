function b() {
   console.log('B');
}

function slowfunc(callback){
  while(true){

  }

  callback();
}

console.log('a');
slowfunc(b);
console.log('c');
