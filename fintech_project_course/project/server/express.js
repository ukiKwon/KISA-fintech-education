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
  database : 'kisemble'
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
//2-2. 셀리니움 결과
app.get('/report', function(req, res) {
    res.render('report')
})

/*
  *
  * part3.서버-동작 선언
  *
*/

//3-1. 당일 데이터 호출
app.post('/gettimely', function(req, res) {
    //test
    //POST - 데이터 세트 정의
    var mstock = req.body.stock_code;
    var current_table = new String("");
    var mname = "";
    var mday = req.body.reg_시date;
    console.log(mstock, mday);
    //해당날짜 테이블 선택
    const mTarget_table = new String("tb_summary");

    //1. 유효 종목 검색(Search a current stock)
    var sql_search_stock = 'SELECT stock_name FROM tb_stock_list WHERE stock_code=?;';
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
                     for (i = results.length - 1; i > 0; --i) {
                  			var mt = results[i].Tables_in_kisemble;
                        if (mt.indexOf(mTarget_table) != -1) {
			                      console.log(">> get table");
                            current_table = mt;
                            break;
                        }
                     }
                     //3. 등락률 조회
                     if (current_table != "") {
                          console.log(" >> user searched valid stocks");
                          var sql_select_table = 'SELECT stock_falling_rate FROM ' + current_table + ' WHERE stock_code=?;';
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
        		              console.log(">> There is no such a table");
                          return res.json(10001);
                     }
                 }
             })
         }
    })
});
//3-2. 업종별 등락률 반환
app.post('/getStockCategoryAll', function(req, res) {
    //1. 특정(마지막) 업종 등락 테이블 호출
    //해당날짜 테이블 선택
    console.log(">> getStockCategoryAll() called");
    const mTarget_table = new String("fr_category");
    var current_table = new String("");
    var sql_find_table = 'SHOW TABLES;';
    connection.query(sql_find_table, function (error, results) {
        if (error) {
            // throw error;
	    console.log(" >> search the dated table...mysql failed");
            return res.json(10011);
        }
        else {
            //has-the-name
            for (i = results.length - 1; i > 0; --i) {
               var mt = results[i].Tables_in_kisemble;
               if (mt.indexOf(mTarget_table) != -1) {
                   current_table = mt;
                   console.log(" >> found the dated table found : " + current_table);
                   break;
               }
            }
            //JOIN
            /*
              * This will be excuted.
              * SELECT tb_category_list.category_code, tb_category_list.category_name,
                      tb_fr_category_20190715.category_falling_rate
                FROM tb_category_list, tb_fr_category_20190715
                WHERE tb_category_list.category_code = tb_fr_category_20190715.category_code
            */
      	    if (current_table != "") {
                  var sql_select_all = 'SELECT `tb_category_list`.`category_code`, `tb_category_list`.`category_name`,' +  current_table + '.`category_falling_rate` FROM `tb_category_list`,' + current_table + ' WHERE `tb_category_list`.`category_code` = ' + current_table + '.`category_code`;';
                  connection.query(sql_select_all, function (error, results) {
                      if (error) {
                          // throw error;
          	              console.log(" >> search the dated table...mysql failed");
                          return res.json(10011);
                      }
                      else {
                          var aJsonArray = new Array();
                          for (i = 0; i < results.length; ++i) {
                              var aJson = new Object();
                              aJson.category_code = results[0].stock_daybefore;
                              aJson.category_name = results[i].category_name;
                              aJson.category_rate = results[i].category_falling_rate;
                              aJsonArray.push(aJson);
                          }
      	                  console.log("  >> request success !!!");
                          return res.json(JSON.stringify(aJsonArray));
                      }
                  })
           }
           else {
      		     console.log(" >> no table has been found");
      	       return res.json(10002);
           }

      }
    })
});
//3-2. 업종당 주식 종목 등락률 반환
app.post('/getStockListById', function(req, res) {
    
})
//3.$. 서버처리-대기
app.listen(5555);
console.log("Listening on port", port);
