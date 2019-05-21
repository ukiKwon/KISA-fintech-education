//# NPM 1단계 : npm 모듈 사용과 긁어오기
var request = require('request');
var to_json = require('xmljson').to_json;
//request('http://www.naver.com', function(error, response, body) {
request('http://www.weather.go.kr/weather/forecast/mid-term-rss3.jsp?stnld=109', function (error, response, body) {
    console.log('error:', error);
    console.log('statusCode:', response && response.statusCode);
    console.log('body:', body);
    //xml-json
    to_json(body, function (error, data) {
      console.log(data);
      console.log(JSON.stringify(data));
    })

});
//날씨정보 가져오기
//request는 서버로 요청('어떠한')을 보내기 위한 함수
// * 현재 parser 정의되지 않았다고 뜸
// request('http://www.weather.go.kr/weather/forecast/mid-term-rss3.jsp?stnld=109', function (error, response, body) {
//     parser.parseString(body, function (err, jsonData) {
//         console.log(body);
//         console.log(jsonData);
//         callback(jsonData.rss.channel[0].item[0].description[0].header[0].wf[0]);
//     })
// });


//# NPM 2단계 : 
