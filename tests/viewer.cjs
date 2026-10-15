const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const artifact = name => path.join(require('node:os').tmpdir(), name);
(async () => {
  const browser = await chromium.launch({ headless: true, channel: process.env.SLIDER_BROWSER_CHANNEL || 'chrome' });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await page.route('https://i.pinimg.com/**', route => {
      if (route.request().url().endsWith('/1.jpg') && !route.request().url().includes('/236x/')) return route.fulfill({ status: 404, body: '' });
      const [width, height] = route.request().url().includes('/originals/') ? [1600, 8000] : [800, 4000];
      return route.fulfill({ contentType: 'image/svg+xml', body: `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="${width}" height="${height}" fill="teal"/></svg>` });
    });
    await page.route('https://www.pinterest.com/pin/*/', route => route.fulfill({ contentType: 'text/html', body: '<script type="application/json">{"pin":{"id":"4","title":"Kitchen reference","description":"Materials and colors","link":"https://example.com/design","images":{}}}</script>' }));
    await page.route('https://www.pinterest.com/', route => route.fulfill({ contentType: 'text/html', body: '<html><body></body></html>' }));
    await page.goto('https://www.pinterest.com/');
    await page.setContent(`<button id="original">Feed</button>${[1, 2, 3].map(i => `<a href="https://www.pinterest.com/pin/${i}/"><img width="240" src="https://i.pinimg.com/236x/${i}.jpg" alt="Photo ${i}"></a>`).join('')}`);
    async function installStorage(seed = {}) {
      await page.evaluate(seed => {
        window.testStore = seed;
        let handler;
        window.chrome = {
          runtime: {
            onMessage: { addListener(fn) { if (!handler) handler = fn; } },
            sendMessage(message) { return new Promise(resolve => handler(message, {}, resolve)); }
          },
          storage: {
            local: { async get(key) { window.storageReads = (window.storageReads || 0) + 1; return structuredClone(window.testStore); }, async set(value) { Object.assign(window.testStore, structuredClone(value)); } },
            onChanged: { addListener() {} }
          }
        };
      }, seed);
      await page.addScriptTag({ path: path.resolve(__dirname, '../extension/background.js') });
    }
    await installStorage();
    await page.addScriptTag({ path: path.resolve(__dirname, '../extension/content.js') });
    assert.equal(await page.locator('.brand').textContent(), 'Reference Slider');
    assert.equal(await page.locator('.viewer').getAttribute('aria-label'), 'Reference Slider image viewer');
    // Collections stay unloaded until the viewer is opened.
    assert.equal(await page.evaluate(() => window.storageReads || 0), 0);
    await page.locator('.launch:not(.launch-library)').click();
    await page.locator('header .count').waitFor();
    assert.equal(await page.locator('header .count').textContent(), '1 / 3');
    await page.waitForFunction(() => window.storageReads === 1);
    assert.equal(await page.locator('.close').evaluate(el => getComputedStyle(el).outlineStyle), 'none');
    await page.locator('.photo').waitFor({ state: 'visible' });
    assert.equal(await page.locator('.photo').getAttribute('src'), 'https://i.pinimg.com/236x/1.jpg');
    await page.keyboard.press('ArrowRight');
    assert.equal(await page.locator('.caption').textContent(), 'Photo 2');
    await page.locator('.photo').waitFor({ state: 'visible' });
    await page.mouse.move(800, 400); await page.mouse.down(); await page.mouse.move(600, 400); await page.mouse.up();
    assert.equal(await page.locator('header .count').textContent(), '3 / 3');
    await page.keyboard.press('ArrowLeft');
    assert.equal(await page.locator('header .count').textContent(), '2 / 3');
    await page.locator('.photo').waitFor({ state: 'visible' });
    assert.equal(await page.locator('.photo').getAttribute('src'), 'https://i.pinimg.com/1200x/2.jpg');
    await page.locator('.width').click();
    const widthZoom = await page.locator('.zoom-value').textContent();
    assert.ok(parseInt(widthZoom) > 100);
    // Zooming past the preview's pixels swaps in the original without resetting the view.
    await page.waitForFunction(() => document.getElementById('pinterest-slider-root').shadowRoot.querySelector('.photo').naturalWidth === 1600);
    assert.equal(await page.locator('.photo').getAttribute('src'), 'https://i.pinimg.com/originals/2.jpg');
    assert.equal(await page.locator('.zoom-value').textContent(), widthZoom);
    const before = await page.locator('.photo').getAttribute('style');
    await page.mouse.move(640, 400); await page.mouse.wheel(0, 400);
    await page.waitForTimeout(100);
    assert.notEqual(await page.locator('.photo').getAttribute('style'), before);
    await page.mouse.move(800, 400); await page.mouse.down(); await page.mouse.move(600, 300); await page.mouse.up();
    assert.equal(await page.locator('header .count').textContent(), '2 / 3');
    await page.locator('.fit').click();
    assert.equal(await page.locator('.zoom-value').textContent(), '100%');
    await page.evaluate(() => {
      const stage = document.getElementById('pinterest-slider-root').shadowRoot.querySelector('.stage');
      stage.setPointerCapture = () => {};
      for (const [type, id, x] of [['pointerdown', 11, 550], ['pointerdown', 12, 700], ['pointermove', 12, 900], ['pointerup', 12, 900], ['pointerup', 11, 550]]) {
        stage.dispatchEvent(new PointerEvent(type, { pointerId: id, pointerType: 'touch', clientX: x, clientY: 400, button: 0, bubbles: true }));
      }
    });
    assert.ok(parseInt(await page.locator('.zoom-value').textContent()) > 100);
    assert.equal(await page.locator('header .count').textContent(), '2 / 3');
    await page.locator('.fit').click();
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('.viewer').isVisible(), false);
    assert.equal(await page.locator('.launch:not(.launch-library)').isVisible(), true);
    await page.locator('.launch:not(.launch-library)').click();
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => document.getElementById('pinterest-slider-root').shadowRoot.activeElement.className), 'tool prev');
    assert.equal(await page.locator('.prev').evaluate(el => getComputedStyle(el).outlineStyle), 'solid');
    await page.keyboard.press('ArrowRight');
    await page.evaluate(() => setTimeout(() => {
      const a = document.createElement('a'); a.href = 'https://www.pinterest.com/pin/4/';
      a.innerHTML = '<img width="240" src="https://i.pinimg.com/236x/4.jpg" alt="Photo 4">'; document.body.append(a);
    }, 200));
    await page.keyboard.press('ArrowRight');
    await page.waitForFunction(() => document.getElementById('pinterest-slider-root').shadowRoot.querySelector('.count').textContent === '4 / 4');
    await page.keyboard.press('Escape');
    await page.locator('.launch:not(.launch-library)').click();
    await page.locator('.info-open').click();
    await page.locator('.info-source').waitFor({ state: 'visible' });
    assert.equal(await page.locator('.info-source').getAttribute('href'), 'https://example.com/design');
    assert.equal(await page.locator('.info-description').textContent(), 'Materials and colors');
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('.info-open').evaluate(el => getComputedStyle(el).outlineStyle), 'none');
    assert.equal(await page.locator('.viewer').evaluate(el => getComputedStyle(el).outlineStyle), 'none');
    await page.locator('.save').click();
    await page.locator('.create-form input').fill('Кухня <референсы>');
    await page.locator('.create-form button').click();
    await page.waitForFunction(() => window.testStore.pinterestSliderCollections?.length === 1);
    await page.locator('.library-back').click();
    await page.locator('.save').click();
    await page.waitForFunction(() => window.testStore.pinterestSliderCollections[0].pins.length === 1);
    assert.equal(await page.locator('.save').getAttribute('aria-label'), 'Reference saved');
    assert.equal(await page.locator('.save').isDisabled(), true);
    await page.keyboard.press('ArrowLeft');
    await page.locator('.save').click();
    await page.waitForFunction(() => window.testStore.pinterestSliderCollections[0].pins.length === 2);
    assert.equal(await page.evaluate(() => window.testStore.pinterestSliderCollections[0].pins[0].source), 'https://example.com/design');
    const saved = await page.evaluate(() => window.testStore);
    await page.keyboard.press('Escape');
    await page.evaluate(() => document.querySelectorAll('a').forEach(a => a.remove()));
    // A new document has an empty feed.
    await page.reload();
    await installStorage(saved);
    await page.addScriptTag({ path: path.resolve(__dirname, '../extension/content.js') });
    await page.locator('.launch:not(.launch-library)').click();
    assert.match(await page.locator('.message').textContent(), /No images yet/);
    await page.locator('.library-open').click();
    await page.screenshot({ path: artifact('pinterest-collections.png') });
    assert.equal(await page.locator('.collection-card h3').textContent(), 'Кухня <референсы>');
    await page.locator('.view-collection').click();
    assert.equal(await page.locator('header .count').textContent(), '1 / 2');
    await page.keyboard.press('ArrowRight');
    assert.equal(await page.locator('header .count').textContent(), '2 / 2');
    assert.equal(await page.locator('.next').isDisabled(), true);
    await page.locator('.remove').click();
    await page.waitForFunction(() => window.testStore.pinterestSliderCollections[0].pins.length === 1);
    assert.equal(await page.locator('header .count').textContent(), '1 / 1');
    // Starting on an already open detail page must pick its unlinked image first.
    await page.keyboard.press('Escape');
    await page.evaluate(() => {
      history.pushState({}, '', '/pin/99/');
      document.body.insertAdjacentHTML('beforeend', '<article data-test-id="closeup-body"><h1>Open pin reference</h1><img data-test-id="pin-closeup-image" width="300" height="500" src="https://i.pinimg.com/736x/99.jpg"><a data-test-id="visit-site-button" href="https://example.com/current">Visit site</a></article><a href="/pin/100/"><img width="240" src="https://i.pinimg.com/236x/100.jpg" alt="Related pin"></a>');
    });
    await page.locator('.launch').click();
    assert.equal(await page.locator('.caption').textContent(), 'Open pin reference');
    assert.equal(await page.locator('header .count').textContent(), '1 / 2');
    assert.equal(await page.locator('.link').getAttribute('href'), 'https://www.pinterest.com/pin/99/');
    await page.locator('.photo').waitFor({ state: 'visible' });
    await page.keyboard.press('ArrowRight');
    assert.equal(await page.locator('.caption').textContent(), 'Related pin');
    await page.keyboard.press('Escape');
    await page.locator('.launch').click();
    assert.equal(await page.locator('.caption').textContent(), 'Open pin reference');
    assert.equal(await page.locator('.launch-library').count(), 0);
    assert.equal(await page.locator('.launch').textContent(), 'Open Slider');
    assert.equal(await page.locator('.launch').evaluate(el => getComputedStyle(el).borderRadius), '12px');
    await page.screenshot({ path: artifact('pinterest-slider-updated.png') });
    await page.locator('.photo').waitFor({ state: 'visible' });
    // Custom collection menu is keyboard operable and bounded on mobile.
    await page.locator('.destination').click();
    assert.equal(await page.locator('.destination').getAttribute('aria-expanded'), 'true');
    await page.screenshot({ path: artifact('pinterest-slider-menu.png') });
    assert.equal(await page.getByRole('menuitemradio').getAttribute('aria-checked'), 'true');
    await page.keyboard.press('ArrowDown');
    assert.equal(await page.evaluate(() => document.getElementById('pinterest-slider-root').shadowRoot.activeElement.textContent), 'New collection');
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('.collection-menu').isVisible(), false);
    // Space activates the focused control instead of advancing the image.
    await page.locator('.library-open').focus();
    await page.keyboard.press('Space');
    assert.equal(await page.locator('.library-panel').isVisible(), true);
    assert.equal(await page.locator('header .count').textContent(), '1 / 2');
    assert.equal(await page.locator('footer').isVisible(), false);
    await page.keyboard.press('Escape');
    for (const width of [390, 320]) {
      await page.setViewportSize({ width, height: 844 });
      await page.waitForTimeout(100);
      const outOfBounds = await page.evaluate(() => {
        const root = document.getElementById('pinterest-slider-root').shadowRoot;
        return [...root.querySelectorAll('header button,header select,footer button,footer a')].filter(el => {
          if (!el.getClientRects().length) return false;
          const r = el.getBoundingClientRect(); return r.left < 0 || r.right > innerWidth + 1;
        }).map(el => el.textContent);
      });
      assert.deepEqual(outOfBounds, []);
      await page.screenshot({ path: artifact(`pinterest-slider-mobile-${width}.png`) });
      await page.locator('.destination').click();
      const menuBounds = await page.locator('.collection-menu').boundingBox();
      assert.ok(menuBounds.x >= 0 && menuBounds.x + menuBounds.width <= width);
      await page.keyboard.press('Escape');
    }
    await page.locator('.info-open').click();
    await page.screenshot({ path: artifact('pinterest-slider-info-mobile.png') });
    await page.keyboard.press('Escape');
    await page.locator('.library-open').click();
    await page.locator('.collection-search').fill('nothing matches');
    assert.equal(await page.locator('.collection-card').count(), 0);
    assert.match(await page.locator('.empty-state').textContent(), /No matching/);
    await page.locator('.collection-search').fill('');
    await page.screenshot({ path: artifact('pinterest-slider-library-mobile.png') });
    await page.keyboard.press('Escape');
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.locator('.photo').waitFor({ state: 'visible' });
    await page.screenshot({ path: artifact('pinterest-slider-polished.png') });
    // Replay press feedback at 10% speed, then verify reduced-motion support.
    await page.locator('.plus').evaluate(el => el.style.transitionDuration = '1.5s');
    await page.locator('.plus').hover();
    await page.mouse.down(); await page.waitForTimeout(1600);
    const pressScale = await page.locator('.plus').evaluate(el => getComputedStyle(el).scale);
    assert.equal(pressScale, '0.96');
    await page.mouse.up();
    await page.locator('.plus').evaluate(el => el.style.transitionDuration = '');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    assert.equal(await page.locator('.plus').evaluate(el => getComputedStyle(el).transitionDuration), '0s');
    // Worker serializes simultaneous saves from multiple callers.
    await page.evaluate(async () => {
      const id = window.testStore.pinterestSliderCollections[0].id;
      await Promise.all([7, 8].map(value => chrome.runtime.sendMessage({ type: 'SLIDER_COLLECTIONS', action: 'save', id, pin: { id: String(value), src: `https://i.pinimg.com/236x/${value}.jpg`, title: 'Reference' } })));
    });
    assert.equal(await page.evaluate(() => window.testStore.pinterestSliderCollections[0].pins.length), 3);
    const popup = await browser.newPage({ viewport: { width: 318, height: 360 } });
    await popup.addInitScript(() => { window.chrome = { tabs: { async query() { return [{ id: 1 }]; }, create() {} }, runtime: { async sendMessage() { throw new Error('No Pinterest'); }, getURL: value => value } }; });
    await popup.goto('file://' + path.resolve(__dirname, '../extension/popup.html'));
    await popup.locator('#library').hover();
    await popup.screenshot({ path: artifact('pinterest-slider-popup.png') });
    await popup.locator('#open').click();
    assert.match(await popup.locator('#status').textContent(), /Open a supported website/);
    await popup.close();
    console.log('PASS: lazy collection loading, screen-sized preview with original on zoom, custom keyboard menu, mobile menu bounds, collection search, responsive 320/390px controls, keyboard Space activation, slow press feedback, reduced motion, open pin detail priority, single English launcher, button shape, persistent task collections, duplicate prevention, saved-only viewer, remove, concurrent saves, zoom, pan, long image scrolling, pinch, quality fallback, collection, keyboard, mouse swipe, close, focus trap, feed pagination, empty state');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
