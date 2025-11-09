const {Builder, By, until} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

(async function run() {
  // Config
  const BASE_UI = process.env.UI_URL || 'http://localhost:8081';
  const API_BASE = process.env.API_URL || 'http://localhost:3001';
  const BROKER_FULL_NAME = process.env.BROKER || 'Богатов Илья';
  const STOCK = process.env.STOCK || 'AAPL';

  // Start sale via REST (requires Lab 5 Nest to be running)
  try {
    await fetch(API_BASE + '/startSale', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ stocks: [STOCK], startDate: '2019-12-09', changeSpeed: 1 })
    });
  } catch (e) {
    console.warn('WARN: cannot start sale via REST, continuing test:', e.message);
  }

  // Chrome headless
  const options = new chrome.Options().addArguments('--headless=new', '--no-sandbox', '--disable-gpu');
  let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

  try {
    // Open app
    await driver.get(BASE_UI + '/#/login');

    // Fill surname and name
    const [surname, name] = BROKER_FULL_NAME.split(' ');
    await driver.findElement(By.css('input[type="text"]:nth-of-type(1)')).sendKeys(surname || 'Богатов');
    await driver.findElement(By.css('input[type="text"]:nth-of-type(2)')).sendKeys(name || 'Илья');

    // Click login
    await driver.findElement(By.css('button.button.primary')).click();

    // Navigate to exchange
    await driver.get(BASE_UI + '/#/exchange');

    // Wait for prices to appear
    await driver.wait(until.elementLocated(By.css('.stock-row')), 15000);

    // Select first row or specific stock
    let row;
    try {
      row = await driver.findElement(By.css(`.stock-row#${STOCK}`));
    } catch {
      const rows = await driver.findElements(By.css('.stock-row'));
      row = rows[0];
    }

    // Read balance before
    const balanceText = await driver.findElement(By.css('.header-small-elem .balance')).getText();
    const balanceBefore = parseFloat((balanceText.match(/([0-9]+(?:\.[0-9]+)?)/) || [0, '0'])[1]);

    // Set qty=1 and buy
    const input = await row.findElement(By.css('input.qty'));
    await input.clear();
    await input.sendKeys('1');
    await row.findElement(By.css('button.btn.primary')).click();

    // Wait a bit, then read balance after
    await driver.sleep(1000);
    const balanceAfterText = await driver.findElement(By.css('.header-small-elem .balance')).getText();
    const balanceAfter = parseFloat((balanceAfterText.match(/([0-9]+(?:\.[0-9]+)?)/) || [0, '0'])[1]);

    console.log(JSON.stringify({ balanceBefore, balanceAfter }));

    if (isFinite(balanceBefore) && isFinite(balanceAfter) && balanceAfter <= balanceBefore) {
      console.log('OK: balance decreased after BUY');
      process.exit(0);
    } else {
      console.error('FAIL: balance did not decrease');
      process.exit(1);
    }
  } catch (e) {
    console.error('Test error:', e);
    process.exit(2);
  } finally {
    if (driver) await driver.quit();
  }
})();
