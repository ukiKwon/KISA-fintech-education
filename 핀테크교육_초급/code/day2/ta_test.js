var express = require("express");
// var parseString = require('xml2js').parseString;
var to_json = require('xmljson').to_json;

app = express();
var port = process.env.PORT || 5000;
app.use(express.static(__dirname + '/public'));

app.get('/main', function(req, res){
    res.send('HELLO EXPRESS');
})

app.get('/weather', function(req, res){
    request('https://openapi.open-platform.or.kr/account/balance', function (error, response, body) {
        var originalXml = body;
        // parseString(originalXml, function (err, result) {
        //       console.log(result.rss.channel[0].item[0].description[0].header[0].wf[0]);
        //       res.send(result.rss.channel[0].item[0].description[0].header[0].wf[0]);
        //   });
        // });
        to_json(body, function (error, data) {
          console.log(data);
          console.log(JSON.stringify(data));
        })
});

app.get("/sayHello", function (request, response) {
	var user_name = request.query.user_name;
	response.send("Hello " + user_name + "!");
});

app.get("/sayHello", function (request, response) {
	var user_name = request.query.user_name;
	response.send("Hello " + user_name + "!");
});

app.listen(port);
console.log("Listening on port ", port);
