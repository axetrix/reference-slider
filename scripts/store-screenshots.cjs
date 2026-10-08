const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
(async () => {
  const browser = await chromium.launch({ headless: true, channel: process.env.SLIDER_BROWSER_CHANNEL || 'chrome' });
  try {
    fs.mkdirSync('store', { recursive: true });
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    const art = fs.readFileSync('assets/demo-art.svg', 'utf8');
    await page.route('https://i.pinimg.com/**', route => route.fulfill({ contentType: 'image/svg+xml', body: art }));
    await page.route('https://www.pinterest.com/', route => route.fulfill({ contentType: 'text/html', body: '<html><body></body></html>' }));
    await page.goto('https://www.pinterest.com/');
    await page.setContent('<a href="/pin/500/"><img width="240" src="https://i.pinimg.com/736x/500.jpg" alt="Alpine palette — original demo illustration"></a><a href="/pin/501/"><img width="240" src="https://i.pinimg.com/736x/501.jpg" alt="Landscape study"></a>');
    await page.evaluate(() => {
      const pin = { id: '500', src: 'https://i.pinimg.com/736x/500.jpg', url: 'https://www.pinterest.com/pin/500/', title: 'Alpine palette', description: 'Original demo artwork used to showcase the viewer.', metadataLoaded: true };
      window.demoStore = { pinterestSliderCollections: [
        { id: 'a', name: 'Brand direction', pins: [pin] }, { id: 'b', name: 'Interior moodboard', pins: [pin] }, { id: 'c', name: 'Weekend inspiration', pins: [pin] }
      ] };
      let handler;
      window.chrome = { runtime: {
        onMessage: { addListener(fn) { if (!handler) handler = fn; } },
        sendMessage(message) { return new Promise(resolve => handler(message, {}, resolve)); }
      }, storage: { local: { async get() { return structuredClone(window.demoStore); }, async set(value) { Object.assign(window.demoStore, structuredClone(value)); } }, onChanged: { addListener() {} } } };
    });
    await page.addScriptTag({ path: path.resolve('extension/background.js') });
    await page.addScriptTag({ path: path.resolve('extension/content.js') });
    await page.locator('.launch').click(); await page.locator('.photo').waitFor({ state: 'visible' });
    await page.locator('.stage').click({ position: { x: 600, y: 300 } });
    await page.screenshot({ path: 'store/screenshot-viewer.png' });
    await page.locator('.plus').click(); await page.locator('.stage').click({ position: { x: 600, y: 300 } });
    await page.screenshot({ path: 'store/screenshot-zoom.png' });
    await page.locator('.fit').click(); await page.locator('.destination').click();
    await page.screenshot({ path: 'store/screenshot-menu.png' });
    await page.keyboard.press('Escape'); await page.locator('.library-open').click();
    await page.locator('.create-form input').evaluate(el => el.blur());
    await page.screenshot({ path: 'store/screenshot-collections.png' });
    console.log('Saved four 1280 × 800 screenshots with original demo artwork.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
