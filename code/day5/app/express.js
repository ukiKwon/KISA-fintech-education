/*
  *
  *******  part1.환경설정 *******
  *
*/
//1.1.설정-모듈 라이브러리
var express = require("express");
var app = express();
var request = require('request');
var port = process.env.PORT || 3000;
var jwt = require('jsonwebtoken');
var cors = require('cors');
var auth = require('./lib/auth');
var tokenKey = "sfisdifdslfsld";
var mysql = require('mysql');
// ***********************************************************
// mysql-booster 관리
// var MysqlPoolBooster = require('mysql-pool-booster');
// mysql = MysqlPoolBooster(mysql);
// // db-configuration 적용
// mysql.createPool(db_config);
// ***********************************************************
//1.2.설정-연동
var connection = mysql.createConnection({
  host     : '127.0.0.1',//localhost로 하면 에러남
  user     : 'root',
  password : 'Flower5wantnight',
  database : 'KISA'
});
connection.connect();
app.use(express.static(__dirname + '/public'));

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(cors());
/*
  *
  *******  part2.프론트-화면 렌더링 *******
  *
*/
//2-1. 화면-메인
app.get('/', function (req, res) {
    res.render('index')
})
//2-2. 화면-가입
app.get('/join', function (req, res) {
    res.render('join')
});
//2-3. 화면-로그인
app.get('/login', function (req, res) {
    res.render('login');
})
//2-4. 화면-메인
//원래는 auth 변수 넣지만 지금은 개발중에 있으니 일단 test용으로는 뺀다.
app.get('/main', function (req, res) {
    res.render('main');
})
//2-5. 화면-잔액 조회
app.get('/balance', function(req, res){
    res.render('balance');
})
//2-6. 화면-qr
app.get('/qr', function(req, res) {
    res.render('qr');
})
//2-7. 화면-송금
app.get('/withdraw', function(req, res) {
    res.render('withdraw');
})
/*
  *
  ******* part3.서버-동작 선언 *******
  *
*/
//3-1. 서버처리-인증(API)
app.get('/authResult', function(req, res){
    var auth_code = req.query.code
    var getTokenUrl = "https://testapi.open-platform.or.kr/oauth/2.0/token";
    var option = {
        method : "POST",
        url :getTokenUrl,
        headers : {
        },
        form : {
            code : auth_code,
            client_id : "l7xxf08386a22ff9446d92a75312d5a290ac",
            client_secret : "44c0930fc871461287088ca73882af67",
            redirect_uri : "http://localhost:3000/authResult",
            grant_type : "authorization_code"
        }
    };
    //서버로 보내는 부분
    request(option, function(err, response, body){
        if(err) throw err;
        else {
            console.log(body);
            var accessRequestResult = JSON.parse(body);
            console.log(accessRequestResult);
            res.render('resultChild', {data : accessRequestResult})
        }
    })
})
//3-2. 서버처리-가입
app.post('/join', function(req, res) {
    //test
    // console.log(req.body);
    //POST - 데이터 세트 정의
    var mname = req.body.name;
    var mpwd = req.body.password;
    var memail = req.body.email;
    var maccessToken = req.body.accessToken;
    var mrefreshToken = req.body.refreshToken;
    var mnum = req.body.useseqnum;

    // console.log(mname, memail, mpwd, mnum);
    var sql = 'INSERT INTO `KISA`.`user` (`uname`, `upwd`, `uid`, `uaccessToken`, `urefreshToken`, `unum`) VALUES (?,?,?,?,?,?);';
    connection.query(sql,[mname, mpwd, memail, maccessToken, mrefreshToken, mnum], function (error, results) {
        if (error) throw error;
        else {
            console.log("SQL query is successed!!!!");
        }
    });
});
//3-3. 서버처리-로그인
app.post('/login', function (req, res) {
    var userEmail = req.body.email;
    var userPassword = req.body.password;
    // console.log(userEmail, userPassword);

    var sql = "SELECT * FROM user WHERE uid=?";
    connection.query(sql, [userEmail], function (error, results) {
        if (error) throw error;
        else {
            // console.log(userPassword, results[0].upwd);
            if(userPassword == results[0].upwd){
                jwt.sign(
                    {
                        userName : results[0].uname,
                        userId : results[0].uid
                    },
                    tokenKey,
                    {
                        expiresIn : '1d',
                        issuer : 'fintech.admin',
                        subject : 'user.login.info'
                    },
                    function(err, token){
                        console.log('로그인 성공', token)
                        res.json(token)
                    }
                )
            }
            else {
                res.json('등록정보가 없습니다');
            }
        }
    });
})
//3-4. 서버처리-계좌정보불러오기
app.post('/getUser', auth, function(req, res){
    var userId = req.decoded.userId;
    var sql = "SELECT unum, uaccessToken FROM user WHERE uid = ?";
    connection.query(sql,[userId], function(err, result){
        if(err){
            console.error(err);
            throw err;
        }
        else {
            var option = {
                method : "GET",
                url :'https://testapi.open-platform.or.kr/user/me?user_seq_no='+ result[0].unum,
                headers : {
                    'Authorization' : 'Bearer ' + result[0].uaccessToken
                }
            };
            request(option, function(err, response, body){
                if(err) throw err;
                else {
                    console.log(body);
                    res.json(JSON.parse(body));
                }
            })
        }
    })
})
//3-5. 서버처리-잔액조회
app.post('/balance', auth, function(req,res){
    var userId = req.decoded.userId;
    var finNum = req.body.finNum;
    var sql = "SELECT unum, uaccessToken FROM user WHERE uid = ?";
    connection.query(sql,[userId], function(err, result){
        if(err){
            console.error(err);
            throw err;
        }
        else {
            // console.log(result[0].uaccessToken);
            var balanceOption = {
                method : "GET",
                url :'https://testapi.open-platform.or.kr/v1.0/account/balance?fintech_use_num='+finNum+'&tran_dtime=20190523101921',
                headers : {
                    'Authorization' : 'Bearer ' + result[0].uaccessToken
                }
            };
            request(balanceOption, function(err, response, body){
                if(err) throw err;
                else {
                    // console.log(body);
                    res.json(JSON.parse(body));
                }
            })
        }
    })
})
//3-6. 서버처리-거래내역조회
app.post('/transaction_list', auth, function(req,res){
    var userId = req.decoded.userId;
    var finNum = req.body.finNum;
    var sql = "SELECT unum, uaccessToken FROM user WHERE uid= ?";
    connection.query(sql,[userId], function(err, result){
        if(err){
            console.error(err);
            throw err;
        }
        else {
            // console.log(result[0].uaccessToken);
            var option = {
                method : "GET",
                url :'https://testapi.open-platform.or.kr/v1.0/account/transaction_list?'
                  + 'fintech_use_num=' + finNum
                  + '&inquiry_type=A'
                  + '&from_date=20160601'
                  + '&to_date=20170101'
                  + '&sort_order=D'
                  + '&page_index=1'
                  + '&tran_dtime=20160101121212&',
                headers : {
                    'Authorization' : 'Bearer ' + result[0].uaccessToken
                }
            };
            request(option, function(err, response, body){
                if(err) throw err;
                else {
                    // console.log(body);
                    res.json(JSON.parse(body));
                }
            })
        }
    })
})
//3-7. 서버처리-송금
app.post('/withdraw', auth, function (req, res) {
    // console.log(req.decoded);
    // console.log(req.body);
    var userId = req.decoded.userId;
    var finnum = req.body.fintech_use_num;
    var point = req.body.tran_amt;
    console.log("\n>>>>>> 서버단-충전 로그");
    console.log("사용자 ID :", userId);
    console.log("사용자 FINNUM :", finnum);
    console.log("사용자 POINT :", point);
    var sql = "SELECT unum, uaccessToken FROM user WHERE uid = ?";
    connection.query(sql,[userId], function(err, result){
        if(err){
            console.error(err);
            throw err;
        }
        else {
            // console.log(result[0].uaccessToken);
            var option = {
                method : "POST",
                url :'https://testapi.open-platform.or.kr/transfer/withdraw',
                headers : {
                    'Authorization' : 'Bearer ' + result[0].uaccessToken,
                    'Content-Type' : 'application/json; charset=UTF-8'
                },
                json : {
                    dps_print_content : '권성욱',
                    fintech_use_num : finnum,
                    tran_amt : 1000,
                    print_content : '권성욱',
                    tran_dtime : '20190523101921'
                }
            };
            request(option, function(err, response, body){
               if(err) throw err;
               else {
                   console.log("\nreq :", body);
                   var requestResult = body
                   //예외처리
                   if(requestResult.rsp_code == "A0000"){
                       var sql = "UPDATE user set upoint = upoint + ? WHERE uid = ?"
                       connection.query(sql, [requestResult.tran_amt, userId], function(err, result){
                           if(err){
                               console.error(err);
                               throw err;
                           }
                           else {
                               res.json(JSON.parse(body));
                           }
                       })
                   }
                   else if(requestResult.rsp_code == "A0002"){
                     console.error("\n>>> 참가은행이 유효하지 않습니다.\n");
                   }
                   else if(requestResult.rsp_code == "A0005"){
                        console.error("\n>>> 핀테크 번호가 유효하지 않습니다.\n");
                   }
               }
           })
        }
    })
})
//3-8. 서버처리-qr결제
app.post('/withdrawQR', auth, function (req, res) {
    var userId = req.decoded.userId;
    var finNum = req.body.qrFin;
    var sql = "SELECT unum, uaccessToken FROM user WHERE uid = ?";
    connection.query(sql,[userId], function(err, result){
        if(err){
            console.error(err);
            throw err;
        }
        else {
            // console.log(result[0].uaccessToken);
            var option = {
                method : "POST",
                url :'https://testapi.open-platform.or.kr/transfer/withdraw',
                headers : {
                    'Authorization' : 'Bearer ' + result[0].uaccessToken,
                    'Content-Type' : 'application/json; charset=UTF-8'
                },
                json : {
                    dps_print_content : '권성욱',
                    fintech_use_num : finNum,
                    tran_amt : 1000,
                    print_content : '권성욱',
                    tran_dtime : '20190523101921'
                }
            };
            request(option, function(err, response, body){
                if(err) throw err;
                else {
                    if(body.rsp_code == "A0000"){
                        res.json(1);
                    }
                    else {
                        res.json(2);
                    }
                }
            })
        }
    })
})
//3-$. 서버처리-토큰테스트
app.get('/tokenTest', auth ,function(req, res){
    console.log(req.decoded);
})
//3-$. 서버처리-Test용
app.get('/ajaxTest',function(req, res){
    console.log('ajax call');
    var result = "hello";
    res.json(result);
})
//3.$. 서버처리-대기
app.listen(3000);
console.log("Listening on port", port);

//버려진 내 코드
// connection.connect();
// //express으로 public(디자인패턴이 들어있는)을 사용을 하겠다
// app.use(express.static(__dirname + '/public'));
// //'/' 경로에 대한 화면 세팅
// app.get("/", function (request, response) {
//     var user_name = request.query.user_name;
//     response.end("Hello " + user_name + "!");
// });
//
// //express에 ejs 적용
// app.set('view engine', 'ejs');
// app.set('views', './views');  //html템플릿파일에 기본주소값을 ./views로 지정
// //'/views'에 대한 화면 세팅
// app.get('/views',function(req,res){
//     res.render('index'); //rending을 함으로써 ejs로 활성화된 상태
// });
// //'/join'에 대한 화면 세팅
// app.get('/join', function(req, res) {
//     res.render('pageapp-register');
// });
// //express-json 사용
// app.use(express.json());
// app.use(express.urlencoded({extended:false}));
// app.post('/join', function(req, res) {
//     //test
//     console.log(req.body);
//     //POST - 데이터 세트 정의
//     var mname = req.body.name;
//     var mpwd = req.body.pwd;
//     var memail = req.body.email;
//     //SQL - 삽입구문
//     var sql = 'INSERT INTO `KISA`.`user` (`uname`, `upwd`, `uemail`) VALUES (?,?,?);'
//     connection.query(sql, [mname, mpwd, memail],function(error, results) {
//         if (error) throw error;
//         else {
//             console.log("SQL query is executed!!!!");
//         }
//     })
// });
// app.get('/authResult', function(req, res){
//     var auth_code = req.query.code
//     var getTokenUrl = "https://testapi.open-platform.or.kr/oauth/2.0/token";
//     var option = {
//         method : "POST",
//         url :getTokenUrl,
//         headers : {
//         },
//         form : {
//             code : auth_code,
//             client_id : "l7xxf08386a22ff9446d92a75312d5a290ac",
//             client_secret : "44c0930fc871461287088ca73882af67",
//             redirect_uri : "http://localhost:3000/authResult",
//             grant_type : "authorization_code"
//         }
//     };
//     request(option, function(err, response, body){
//         if(err) throw err;
//         else {
//             console.log(body);
//             var accessRequestResult = JSON.parse(body);
//             console.log(accessRequestResult);
//             res.render('resultChild', {data : accessRequestResult})
//         }
//     })
// })
// //'/ajaxTest'에 대한 화면 세팅
// app.get('/ajaxTest', function(req, res) {
//     var result = "멍청이";
//     res.json(result);
//     console.log("ajax call");
// });
// //서버 대기 시작
// app.listen(port);
// console.log("Listening on port", port);
