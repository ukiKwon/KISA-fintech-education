//Declare
var express = require('express');
var app = express();
var request = require('request');
var port = process.env.PORT || 5555;
var cors = require('cors');

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

//3.$. 서버처리-대기
app.listen(5555);
console.log("Listening on port", port);
