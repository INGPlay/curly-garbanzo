var mysql      = require('../node_modules/mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'dldirl0514',
  database : 'opentutorials'
});
 
connection.connect();
 
connection.query('SELECT * FROM topic', function (error, results, fields) {
  if (error){
      console.log(error);
  };
  console.log(results);
});
 
connection.end();