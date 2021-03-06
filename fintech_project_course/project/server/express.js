//Declare
var express = require('express');
var app = express();
var request = require('request');
var port = process.env.PORT || 5555;
var cors = require('cors');
var mysql = require('mysql');
var date = require('date-utils');

//mysql
var connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'kisemble',
    database: 'kisemble'
});
connection.connect();

///express
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
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
app.get('/report', function (req, res) {
    res.render('report')
})

/*
  *
  * part3.서버-동작 선언
  *
*/

//3-1. 당일 데이터 호출
app.post('/gettimely', function (req, res) {
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
                if (error) {
                    throw error;
                }
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
                            if (error) {
                                throw error;
                            }
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
app.post('/getStockCategoryAll', function (req, res) {
    //1. 특정(마지막) 업종 등락 테이블 호출
    //해당날짜 테이블 선택
    console.log("\n>> API_getStockCategoryAll() Called...");
    const mTarget_table = new String("fr_category");
    var sql_find_table = 'SHOW TABLES;';
    connection.query(sql_find_table, function (error, results) {
        if (error) {
            console.log(" >> (mysql_failed) no result of query was found...");
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
                var sql_select_all = 'SELECT `tb_category_list`.`category_code`, `tb_category_list`.`category_name`,' + 'tb_fr_category_20190715' + '.`category_falling_rate` FROM `tb_category_list`,' + 'tb_fr_category_20190715' + ' WHERE `tb_category_list`.`category_code` = ' + 'tb_fr_category_20190715' + '.`category_code`;';
                connection.query(sql_select_all, function (error, results) {
                    if (error) {
                        console.log(" >> (mysql_failed) no result of query was found...");
                        return res.json(10011);
                    }
                    else {
                        console.log("  >> " + results.length + " categories found");
                        console.log("  >> load its stocks_list....now");
                        let aJsonArray = [];
                        var counter = 0;
                        for (i = 0; i < results.length; ++i) {
                            let aJson = {};
                            aJson.category_code = results[i].category_code;
                            aJson.category_name = results[i].category_name;
                            aJson.category_rate = results[i].category_falling_rate;
                            aJson.stock_list = [];
                            /*
                            * {[종목명 : 종목등락률],}
                            SELECT B.stock_code, B.stock_falling_rate
                            FROM (
                                  SELECT C.stock_code
                                  FROM tb_stock_category as C
                                  WHERE C.category_code = 71
                                  ) as A, tb_summary_20190715_00099 as B
                            WHERE A.stock_code = B.stock_code;
                            */
                            var sql_stock_list = 'SELECT B.`stock_code`, B.`stock_falling_rate` FROM (SELECT C.`stock_code` FROM `tb_stock_category` as C WHERE C.`category_code` = ?) as A, `tb_summary_20190715_00099` as B WHERE A.`stock_code` = B.`stock_code`;';
                            let bJsonStocksArray = [];
                            connection.query(sql_stock_list, [results[i].category_code], function (error, stocks) {
                                if (error) {
                                    console.log(" >> search the dated table...mysql failed");
                                    return res.json(10011);
                                }
                                else {
                                    for (j = 0; j < stocks.length; ++j) {
                                        let bJson = {};
                                        bJson.stock_code = stocks[j].stock_code;
                                        bJson.stock_falling_rate = stocks[j].stock_falling_rate;
                                        bJsonStocksArray.push(bJson);
                                    }
                                    aJson.stock_list = bJsonStocksArray;
                                    aJsonArray.push(aJson);
                                    if (counter == results.length - 1) {
                                        res.json(aJsonArray);
                                    }
                                    else { //waiting from loading db
                                        counter++;
                                    }
                                }
                            });
                        }
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
app.post('/getStockListById', function (req, res) {
    var category_code = req.body.category_id;
    console.log("\n>> API_getStockListById() Called...");
    console.log(" >> category :" + category_code);
    const mTarget_table = new String("tb_summary");
    var sql_find_table = 'SHOW TABLES;';
    connection.query(sql_find_table, function (error, results) {
        if (error) {
            console.log(" >> search the dated table...mysql failed");
            return res.json(10011);
        }
        else {
            //1. 현재 날짜 테이블 호출
            for (i = results.length - 1; i > 0; --i) {
                var mt = results[i].Tables_in_kisemble;
                if (mt.indexOf(mTarget_table) != -1) {
                    current_table = mt;
                    console.log(" >> found the dated table found : " + current_table);
                    break;
                }
            }
            //2. 업종 코드에 해당하는 주식 종목수 및 해당 주식수의 등락률 검색
            if (current_table != "") {
                /*
                //{주식코드 : 주식명 : 등락률}
                * SELECT A.stock_code, A.stock_name, B.stock_falling_rate
                FROM (
                  SELECT C.stock_code, D.stock_name
                  FROM (
                    SELECT * FROM tb_stock_category
                    WHERE tb_stock_category.category_code='4'
                  ) as C,
                  tb_stock_list as D
                  WHERE C.stock_code = D.stock_code
                ) as A,
                tb_summary_20190715_00099 as B
                WHERE A.stock_code = B.stock_code;(v)
                */
                var sql_stocks_list = 'SELECT A.`stock_code`, A.`stock_name`, B.`stock_falling_rate` FROM (SELECT C.`stock_code`, D.`stock_name` FROM (SELECT * FROM `tb_stock_category` WHERE `tb_stock_category`.`category_code`= ?) as C, `tb_stock_list` as D WHERE C.`stock_code` = D.`stock_code`) as A,' + current_table + ' as B WHERE A.`stock_code` = B.`stock_code`;';
                connection.query(sql_stocks_list, [category_code], function (error, results) {
                    if (error) {
                        console.log(" >> search the dated table...mysql failed");
                        return res.json(10011);
                    }
                    else {
                        var aJsonArray = new Array();
                        for (i = 0; i < results.length; ++i) {
                            var aJson = new Object();
                            aJson.stock_code = results[i].stock_code;
                            aJson.stock_name = results[i].stock_name;
                            aJson.stock_falling_rate = results[i].stock_falling_rate;
                            aJsonArray.push(aJson);
                        }
                        console.log("  >> request success !!!");
                        res.json(aJsonArray);
                    }
                })
            }
            else {
                console.log(" >> no table has been found");
                return res.json(10002);
            }
        }
    })

})
//3-3. 한 종목 데이터 전송
app.post('/getStockDataById', function (req, res) {
    var stock_code = req.body.stock_id;
    console.log("\n>> API_ getStockDateById() called...");
    console.log(" >> category :" + stock_code);
    const mTarget_table = new String("tb_summary");
    var sql_find_table = 'SHOW TABLES;';
    connection.query(sql_find_table, function (error, results) {
        if (error) {
            console.log(" >> search the dated table...mysql failed");
            return res.json(10011);
        }
        else {
            var aJsonArray = new Array();
            //1. 현재 날짜 테이블 호출
            for (i = 0; i < results.length; ++i) {
                var mt = results[i].Tables_in_kisemble;
                if (mt.indexOf(mTarget_table) != -1) {
                    console.log(" >> found the dated table found : " + mt);
                    //2. 특정 항목 조회
                    /*
                    //특정항목 조회
                    * SELECT A.stock_falling_rate FROM tb_summary_20190709_00095 as A WHERE A.stock_code = '5930';'(v)
                    */
                    var sql_get_stock = 'SELECT A.`stock_falling_rate` FROM ' + mt + ' as A WHERE A.`stock_code` = ?;';
                    connection.query(sql_get_stock, [stock_code], function (error, data) {
                        if (error) {
                            console.log(" >> search the dated table...mysql failed");
                            return res.json(10011);
                        }
                        else {
                            var aJson = new Object();
                            aJson.prior_index = data[0].prior_index;
                            aJson.stock_falling_rate = data[0].stock_falling_rate;
                            aJsonArray.push(aJson);
                            console.log("  >> request success !!!");
                            return res.json(aJsonArray);
                        }
                    })
                }
            }
        }
    })
})
//3.4. 5일치 가격 데이터 전송
app.post('/getPriceById', function (req, res) {
    var stock_code = req.body.stock_code;
    console.log("\n>> API_getPriceById() Called...");
    const target_table = new String("tb_price");
    var sql_search_table = "SHOW TABLES;";
    connection.query(sql_search_table, function (error, results) {
        if (error) {
            console.log(" >> (mysql_failed) no result of query was found...");
            return res.json(10011);
        }
        else {
            //has-the-name
             let pricesArray = [];
		var counter = 0;
		var max_table = 5;
             for (i = results.length - 1; i > 0; --i) {
                 var mt = results[i].Tables_in_kisemble;
                 if (mt.indexOf(target_table) != -1) {
                     let current_table = mt;
                     console.log(" >> found the dated table found : " + current_table);
                     /*
                       *  SELECT stock_name, stock_price
                          FROM results[i] as A
                          WHERE A.stock_code = ?
                     */
                     var sql_find_price = 'SELECT A.`stock_name`, A.`stock_price` FROM ' + current_table + ' as A WHERE A.`stock_code` = ?;';
                     connection.query(sql_find_price ,[stock_code], function (error, price) {
                         if (error) {
                             console.log(" >> (mysql_failed) no result of query was found...");
                             res.json(10011);
                         }
                         else {
                             let aPrice = {};
                             aPrice.stock_name = price[0].stock_name;
                             aPrice.stock_price = price[0].stock_price;
                             pricesArray.push(aPrice);
				if (counter == max_table - 1) {
					console.log("   >> Get the price; success !!!");
					res.json(pricesArray);
				} else {
					counter++;
				}
                         }
                     })
                 }
             }
         }
     })
});
/*
  * function
*/

app.listen(5555);
console.log("Listening on port", port);
