const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const svg = width => `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${width * 5}"><rect width="100%" height="100%" fill="teal"/></svg>`;
(async () => {
  const browser = await chromium.launch({ headless: true, channel: process.env.SLIDER_BROWSER_CHANNEL || 'chrome' });
  async function fixture({ slowStorage = false, images } = {}) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await page.route('https://www.pinterest.com/', r => r.fulfill({ contentType: 'text/html', body: '<html><body></body></html>' }));
    await page.route('https://i.pinimg.com/**', images || (r => r.fulfill({ contentType: 'image/svg+xml', body: svg(800) })));
    await page.goto('https://www.pinterest.com/');
    await page.setContent([1, 2].map(id => `<a href="/pin/${id}/"><img width="200" src="https://i.pinimg.com/236x/${id}.jpg" alt="Photo ${id}"></a>`).join(''));
    await page.evaluate(slow => {
      window.saved = { pinterestSliderCollections: [{ id: 'c', name: 'Collection', pins: [] }] };
      let handler;
      let gate = slow ? new Promise(r => { window.releaseStorage = r; }) : Promise.resolve();
      window.chrome = { runtime: {
        onMessage: { addListener(fn) { if (!handler) handler = fn; } },
        sendMessage(m) { return new Promise(r => handler(m, {}, r)); }
      }, storage: { local: {
        async get() { await gate; return structuredClone(window.saved); },
        async set(data) { Object.assign(window.saved, structuredClone(data)); }
      }, onChanged: { addListener() {} } } };
    }, slowStorage);
    await page.addScriptTag({ path: path.resolve('extension/background.js') });
    await page.addScriptTag({ path: path.resolve('extension/content.js') });
    await page.locator('.launch').click();
    await page.locator('.photo').waitFor({ state: 'visible' });
    return page;
  }
  const failures = [];
  async function check(name, run) {
    try { await run(); console.log('PASS:', name); }
    catch (error) { failures.push(name); console.error('FAIL:', name, error.message); }
  }
  try {
    await check('Save preserves the pin clicked before storage finishes', async () => {
      const page = await fixture({ slowStorage: true });
      await page.locator('.save').click();
      await page.keyboard.press('ArrowRight');
      await page.evaluate(() => window.releaseStorage());
      await page.waitForFunction(() => window.saved.pinterestSliderCollections[0].pins.length === 1);
      assert.equal(await page.evaluate(() => window.saved.pinterestSliderCollections[0].pins[0].id), '1');
      await page.close();
    });
    await check('Empty collection cancels a pending original image', async () => {
      let release, requested;
      const started = new Promise(r => { requested = r; });
      const page = await fixture({ images: async r => {
        if (r.request().url().includes('/originals/')) { requested(); await new Promise(resolve => { release = resolve; }); }
        await r.fulfill({ contentType: 'image/svg+xml', body: svg(r.request().url().includes('/originals/') ? 1600 : 800) }).catch(() => {});
      } });
      await page.locator('.save').click();
      await page.waitForFunction(() => window.saved.pinterestSliderCollections[0].pins.length === 1);
      await page.locator('.library-open').click(); await page.locator('.view-collection').click();
      await page.locator('.photo').waitFor({ state: 'visible' });
      await page.locator('.width').click(); await started;
      await page.locator('.remove').click();
      await page.waitForFunction(() => window.saved.pinterestSliderCollections[0].pins.length === 0);
      release(); await page.waitForTimeout(300);
      assert.equal(await page.locator('.photo').isVisible(), false);
      assert.equal(await page.locator('.photo').getAttribute('src'), null);
      await page.close();
    });
    await check('Info deduplicates requests and keeps markup inert', async () => {
      let requests = 0;
      const page = await fixture();
      await page.route('https://www.pinterest.com/pin/*/', async r => {
        requests++; await new Promise(resolve => setTimeout(resolve, 200));
        await r.fulfill({ contentType: 'text/html', body: '<script type="application/json">{"id":"1","description":"<img src=x onerror=alert(1)>","link":"javascript:alert(1)"}</script>' });
      });
      await page.locator('.info-open').dblclick();
      await page.waitForFunction(() => document.getElementById('pinterest-slider-root').shadowRoot.querySelector('.info-description').textContent.includes('onerror'));
      assert.equal(requests, 1);
      assert.equal(await page.locator('.info-description img').count(), 0);
      assert.equal(await page.locator('.info-source').getAttribute('href'), null);
      await page.close();
    });
    await check('Metadata size limit handles an oversized response', async () => {
      const page = await fixture();
      await page.route('https://www.pinterest.com/pin/*/', r => r.fulfill({ contentType: 'text/html', body: 'x'.repeat(5 * 1024 * 1024 + 1) }));
      await page.locator('.info-open').click();
      await page.waitForFunction(() => document.getElementById('pinterest-slider-root').shadowRoot.querySelector('.info-status').textContent.includes('Could not load'));
      assert.equal(await page.locator('.info-source').getAttribute('href'), null);
      await page.close();
    });
    await check('Fallback uses the existing thumbnail before a large original', async () => {
      let originals = 0;
      const page = await fixture({ images: r => {
        const url = r.request().url();
        if (url.includes('/originals/')) originals++;
        if (url.includes('/1200x/') || url.includes('/736x/')) return r.fulfill({ status: 404, body: '' });
        return r.fulfill({ contentType: 'image/svg+xml', body: svg(800) });
      } });
      assert.equal(await page.locator('.photo').getAttribute('src'), 'https://i.pinimg.com/236x/1.jpg');
      assert.equal(originals, 0);
      await page.locator('.close').click();
      assert.equal(await page.locator('.photo').getAttribute('src'), null);
      await page.close();
    });
    await check('Worker rejects unsafe image URLs and recovers after quota failure', async () => {
      const page = await fixture();
      const result = await page.evaluate(async () => {
        const send = pin => chrome.runtime.sendMessage({ type: 'SLIDER_COLLECTIONS', action: 'save', id: 'c', pin });
        const invalid = await send({ id: '9', src: 'https://i.pinimg.com.evil.example/9.jpg' });
        const set = chrome.storage.local.set;
        chrome.storage.local.set = async () => { throw new Error('QUOTA_BYTES exceeded'); };
        const quota = await send({ id: '9', src: 'https://i.pinimg.com/236x/9.jpg' });
        chrome.storage.local.set = set;
        const retry = await send({ id: '9', src: 'https://i.pinimg.com/236x/9.jpg' });
        return { invalid, quota, retry };
      });
      assert.match(result.invalid.error, /Could not save/);
      assert.match(result.quota.error, /Storage is full/);
      assert.equal(result.retry.collections[0].pins.length, 1);
      await page.close();
    });
    await check('Popup handles a rejected active-tab query', async () => {
      const page = await browser.newPage();
      const errors = []; page.on('pageerror', e => errors.push(e.message));
      await page.addInitScript(() => { window.chrome = { tabs: { async query() { throw new Error('Unavailable'); } } }; });
      await page.goto('file://' + path.resolve('extension/popup.html'));
      await page.locator('#open').click();
      assert.match(await page.locator('#status').textContent(), /Open a supported website/);
      assert.deepEqual(errors, []);
      await page.close();
    });
  } finally { await browser.close(); }
  if (failures.length) throw new Error(failures.join('; '));
})().catch(error => { console.error(error); process.exitCode = 1; });
