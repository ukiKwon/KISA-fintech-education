//express 선언
var express = require("express"); //express-include
var app = express(); //express 할당
//request
var request = require('request');
//port 선언
var port = process.env.PORT || 3000;
//mysql 선언
var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : '127.0.0.1',//localhost로 하면 에러남
  user     : 'root',
  password : 'Flower5wantnight',
  database : 'KISA'
});
// ***********************************************************
// mysql-booster 관리
// var MysqlPoolBooster = require('mysql-pool-booster');
// mysql = MysqlPoolBooster(mysql);
// // db-configuration 적용
// mysql.createPool(db_config);
// ***********************************************************

//마스터 코드
connection.connect();
app.use(express.static(__dirname + '/public'));

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.get('/', function (req, res) {
    res.render('index')
})
app.get('/views',function(req,res){
    res.render('index'); //rending을 함으로써 ejs로 활성화된 상태
});
app.get('/join', function (req, res) {
    res.render('pageapp-register')
})

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
//SQL 코드
app.post('/join', function(req, res) {
    //test
    console.log(req.body);
    //POST - 데이터 세트 정의
    var mname = req.body.name;
    var mpwd = req.body.pwd;
    var memail = req.body.email;
    var maccessToken = req.body.accessToken;
    var mrefreshToken = req.body.refreshToken;
    //SQL - 삽입구문
    var sql = 'INSERT INTO `KISA`.`user` (`uname`, `upwd`, `uemail`, `uaccessToken`, `refreshToken`) VALUES (?,?,?,?,?);'
    connection.query(sql,[mname, mpwd, memail, maccessToken, mrefreshToken], function (error, results) {
        if (error) throw error;
        else {
            console.log("SQL query is executed!!!!");
        }
    })
});
app.get('/ajaxTest',function(req, res){
    console.log('ajax call');
    var result = "hello";
    res.json(result);
})

app.listen(3000);
console.log("Listening on port", port);

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
