var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '127.0.0.1',//localhost로 하면 에러남
  user     : 'root',
  password : 'k4^s1#u1#',
  database : 'KISA'
});

connection.connect();

connection.query('SELECT 1 + 1 AS solution', function (error, results) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});
connection.query('SELECT * From user', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', fields[0]);
});

connection.end();
