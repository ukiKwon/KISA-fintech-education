var express = require('express');
var app = express();

app.set('view engine', 'ejs');
app.set('views', './views');  //html템플릿파일에 기본주소값을 ./views로 지정

app.get('/', function(req, res) {
    res.render('view');
});

app.get('/next',function(req,res){
  res.render('view',{data:'lee'});
});

app.get('/next/:id',function(req,res){
  res.render('view',{data:'park'});
});

app.listen(5000,function(){
  console.log('hello ejs');
});
