const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const driver = new webdriver.Builder()
    .forBrowser('chrome')
    .build();

//const url = 'http://54.80.34.62:5555/index.ejs';
const url = 'https://www.naver.com';
driver.get(url);
