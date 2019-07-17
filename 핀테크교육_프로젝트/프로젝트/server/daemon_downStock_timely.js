const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

let driver = new webdriver.Builder()
    .forBrowser('chrome')
    .build();

const url = 'http://marketdata.krx.co.kr/mdi#document=040402/';
//html을 업로드한 경로에서 불러온다
driver.get(url);
