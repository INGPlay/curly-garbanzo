const mysql = require('mysql');
const database = mysql.createConnection({
  host:'',
  user:'',
  password:'',
  database:''
})
database.connect();

module.exports = database;