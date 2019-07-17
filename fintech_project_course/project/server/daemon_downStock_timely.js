//initial variables
const webdriver = require('selenium-webdriver'),
  By = webdriver.By,
  until = webdriver.until;
const chrome = require('selenium-webdriver/chrome');
//options
var chromeCapabilities = webdriver.Capabilities.chrome();
var chromeOptions = {
    'args': ['--test-type', '--start-maximized'],
    'prefs': {"download.default_directory":"/home/uki408/Downloads/Chrome_test"}
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
//*[@id="37693cfc748049e45d87b8c7d8b9aacd"]/button[4]
worker.sleep(2000).then(function() {
    driver.sleep(300);
    driver.find_element_by_xpath('//*[@id="37693cfc748049e45d87b8c7d8b9aacd"]/button[4]').click()
})
