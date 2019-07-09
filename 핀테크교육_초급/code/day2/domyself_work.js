//DB에서 user 목록 받아서와서 웹으로 던져주기
var express = require("express");
var to_json = require('xmljson').to_json;
var mysql      = require('mysql');
//
var connection = mysql.createConnection({
  host     : '127.0.0.1',//localhost로 하면 에러남
  user     : 'root',
  password : 'Flower5wantnight',
  database : 'KISA'
});
//Get-DB
var allUserName;
connection.connect();
connection.query('SELECT uname From user', function (error, results, fields) {
  if (error) throw error;
  allUserName = results[0];
  console.log(results[0]);
});
connection.end();

//POST-WEB
//declare web
app = express();
var port = process.env.PORT || 5000;
// app.use(express.static(__dirname + '/public'));
//
// app.get('/', function(req, res){
//     for (var i = 0; i < allUserName.length; ++i) {
//       // res.send(allUserName[i]);
//       // res.send(allUserName[i].uname);
//       res.json(allUserName);
//
//     }
// })
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.listen(port);
console.log("Listening on port ", port);
