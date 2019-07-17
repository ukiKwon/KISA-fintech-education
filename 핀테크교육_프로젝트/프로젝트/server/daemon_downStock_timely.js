const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

let driver = new webdriver.Builder()
    .forBrowser('firefox')
    .setChromeOptions(/* ... */)
    .setFirefoxOptions(/* ... */)
    .build();

const url = 'http://54.80.34.62:5555/index.ejs';
//html을 업로드한 경로에서 불러온다
driver.get(url);
