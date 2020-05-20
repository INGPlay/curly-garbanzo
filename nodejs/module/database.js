const mysql = require('mysql');
const database = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'dldirl0514',
  database:'opentutorials'
})
database.connect();

module.exports = database;