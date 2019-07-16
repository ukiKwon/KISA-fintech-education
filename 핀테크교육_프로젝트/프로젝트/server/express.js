//Declare
var express = require('express');
var app = express();
var request = require('request');
var port = process.env.PORT || 5555;
var cors = require('cors');
var mysql = require('mysql');

//mysql
var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : 'kisemble',
  database : 'KISEMBLE'
});
connection.connect();
var curday_stock_daily = "";
///express
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
//ejs
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(cors());
//2-1. 화면-메인
app.get('/', function (req, res) {
    res.render('index')
})
//2-4. 화면-메인

/*
  *
  * part3.서버-동작 선언
  *
*/

//3-2. 당일 데이터 호출
app.post('/gettimely', function(req, res) {
    //test
    console.log(req.body);
    //POST - 데이터 세트 정의
    var mstock = req.stock_code;
    var current_table = "";
    var mname = "";
    var mday = req.reg_date;
    console.log(mstock, mday);
    //해당날짜 테이블 선택
    const mTarget_table = new String("tb_summary");

    //1. 유효 종목 검색(Search a current stock)
    var sql_search_stock = 'SELECT stock_name FROM stock_list WHERE stock_code = ?;';
    connection.query(sql_search_stock, [mstock], function (error, results) {
        if (error) throw error;
        else {  //valid-stock_name
             mname = results[0].stock_name;
             //2. 현재 관심사 테이블 호출
             var sql_extract_daily_index = 'SHOW TABLES;';
             connection.query(sql_extract_daily_index, function (error, results) {
                 if (error) { throw error;}
                 else {
                     //has-the-name
                     for (i = results.size() - 1; i > 0; --i) {
                        if (results[i].indexOf(mTarget_table) != -1) {
                            current_table = results[i];
                            break;
                        }
                     }
                 }
             })
             //3. 등락률 조회
             if (current_table != "") {
                console.log(" >> user searched valid stocks");
                var sql_select_table = 'SELECT stock_daybefore FROM ' + current_table + ' WHERE stock_code =?;';
                connection.query(sql_select_table, [mstock], function (error, results) {
                    if (error) { throw error;}
                    else { //found the stock_data
                        var aJson = new Object();
                        aJson.stock_daybefore = results[0].stock_daybefore;
                        aJson.stock_name = mname;
                        JSON.stringify(aJson);
                        return res.json(aJson);
                    }
                })
             }
             else { //현재 날짜에 맞는 테이블 존재하지 않음.(not found the table specific day)
                  return res.json(10001);
             }
        }
    })
});
//3.$. 서버처리-대기
app.listen(5555);
console.log("Listening on port", port);
