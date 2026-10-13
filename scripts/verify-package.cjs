const fs = require('node:fs');
const assert = require('node:assert/strict');
const manifest = JSON.parse(fs.readFileSync('extension/manifest.json'));
assert.equal(manifest.manifest_version, 3);
assert.equal(manifest.name, 'Reference Slider');
assert.equal(manifest.action.default_title, 'Reference Slider');
for (const file of ['extension/popup.html', 'extension/library.html', 'README.md', 'store/listing.txt', 'store/privacy.html', 'docs/index.html']) {
  const text = fs.readFileSync(file, 'utf8');
  assert.ok(text.includes('Reference Slider'), 'Missing current branding: ' + file);
  assert.ok(!/Pinterest Slider/i.test(text), 'Outdated branding: ' + file);
}
assert.equal(fs.readFileSync('docs/index.html', 'utf8'), fs.readFileSync('store/privacy.html', 'utf8'), 'Published privacy policy must match store copy');
assert.ok(manifest.description.length <= 132);
const paths = [manifest.background.service_worker, manifest.action.default_popup, ...Object.values(manifest.icons), ...Object.values(manifest.action.default_icon), ...manifest.content_scripts.flatMap(c => c.js)];
for (const value of paths) assert.ok(fs.existsSync('extension/' + value), 'Missing: ' + value);
for (const [size, value] of Object.entries(manifest.icons)) {
  const image = fs.readFileSync('extension/' + value);
  assert.equal(image.readUInt32BE(16), Number(size));
  assert.equal(image.readUInt32BE(20), Number(size));
}
for (const p of ['viewer','zoom','menu','collections']) {
  const image = fs.readFileSync('store/screenshot-' + p + '.png');
  assert.equal(image.readUInt32BE(16), 1280); assert.equal(image.readUInt32BE(20), 800);
}
const promo = fs.readFileSync('store/promo-440x280.png');
assert.equal(promo.readUInt32BE(16), 440); assert.equal(promo.readUInt32BE(20), 280);
console.log('PASS: manifest, referenced files, PNG icons, store screenshots and promo dimensions');
