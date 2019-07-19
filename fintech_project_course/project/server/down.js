var webdriver = require('./node_modules/selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

var driver = new webdriver.Builder()
    .forBrowser('chrome')
    .build();

//options
var chromeCapabilities = webdriver.Capabilities.chrome();
var chromeOptions = {
    'args': ['--test-type', '--start-maximized'],
    'prefs': {"download.default_directory":"/home/uki408/Downloads/Chrome_test/"}
};
chromeCapabilities.set('chromeOptions', chromeOptions);
//set-worker
const worker = new webdriver.Builder()
  .forBrowser('chrome')
  .withCapabilities(chromeCapabilities)
  .build();
//ready-worker
const stock_url = 'http://marketdata.krx.co.kr/mdi#document=040402';
worker.get(stock_url);
//event

worker.sleep(2000).then(function() {
    driver.sleep(300);
})
