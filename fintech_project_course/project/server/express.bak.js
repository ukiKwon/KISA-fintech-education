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
          	              console.log(" >> search the dated table...mysql failed");
                          return res.json(10011);
                      }
                      else {
                          var aJsonArray = new Array();
                          for (i = 0; i < results.length; ++i) {
				console.log("0 >");
                              var counter = 0;
                              var aJson = new Object();
                              aJson.category_code = results[i].category_code;
                              aJson.category_name = results[i].category_name;
                              aJson.category_rate = results[i].category_falling_rate;
		  	                      aJson.stock_list = new Array();
                              /*
                              * {[종목명 : 종목등락률],}
                              SELECT B.stock_code, B.stock_falling_rate
                              FROM (
                                    SELECT C.stock_code
                                    FROM tb_stock_category as C
                                    WHERE C.category_code = 4
                                    ) as A, tb_summary_20190715_00099 as B
                              WHERE A.stock_code = B.stock_code;
                              */
                              //var sql_stock_list = 'SELECT B.`stock_code`, B.`stock_falling_rate` FROM (SELECT C.`stock_code` FROM `tb_stock_category` as C WHERE C.`category_code` = ?) as A, `tb_summary_20190715_00099` as B WHERE A.`stock_code` = B.`stock_code`;';
				                      var sql_stock_list = 'SELECT B.`stock_code`, B.`stock_falling_rate` FROM (SELECT C.`stock_code` FROM `tb_stock_category` as C WHERE C.`category_code` = ?) as A, `tb_summary_20190715_00099` as B WHERE A.`stock_code` = B.`stock_code`;';
                              var bJsonStocksArray = new Array();
                              //console.log(" >> load stocks_list....now");
				var max_stocks = 0;
                              connection.query(sql_stock_list, [results[i].category_code], function(error, stocks) {
				console.log("1 >");
                                  if (error) {
                                      console.log(" >> search the dated table...mysql failed");
                                      return res.json(10011);
                                  }
                                  else {
					max_stocks = stocks.lengh - 1;
                                      for (j = 0; j < stocks.length; ++j) {
					console.log(".");
                                          var bJson = new Object();
                                          bJson.stock_code = stocks[j].stock_code;
                                          bJson.stock_falling_rate = stocks[j].stock_falling_rate;
                                          bJsonStocksArray.push(bJson);
						counter++;
                                      }
					if (max_stocks <= counter) {
						console.log("2 >");
                              			aJsonArray.push(aJson);
					}
                                  }
                              })
                              //
                              //aJsonStocksArray : {[종목명 : 종목등락률],}
				//if (max_stocks <= counter) {
				//	console.log("2 >");
                              	//	aJsonArray.push(aJson);
				//}
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
});
