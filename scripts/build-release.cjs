const fs = require('node:fs');
const path = require('node:path');
const dependency = name => require(process.env.SLIDER_RUNTIME ? path.join(process.env.SLIDER_RUNTIME, name) : name);
const sharp = dependency('sharp');
const JSZip = dependency('jszip');
(async () => {
  fs.mkdirSync('extension/icons', { recursive: true }); fs.mkdirSync('dist', { recursive: true });
  for (const size of [16, 32, 48, 128]) await sharp('assets/icon.svg').resize(size, size).png().toFile(`extension/icons/icon-${size}.png`);
  await sharp('assets/icon.svg').resize(512,512).png().toFile('store/icon-preview.png');
  await sharp('assets/promo.svg').resize(440,280).removeAlpha().png().toFile('store/promo-440x280.png');
  const manifest = JSON.parse(fs.readFileSync('extension/manifest.json'));
  const zip = new JSZip();
  function add(dir, prefix = '') {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith('.')) continue;
      const rel = prefix + entry.name, full = path.join(dir, entry.name);
      if (entry.isDirectory()) add(full, rel + '/'); else zip.file(rel, fs.readFileSync(full));
    }
  }
  add('extension');
  if (!zip.file('manifest.json')) throw new Error('Manifest missing from ZIP root');
  for (const p of Object.values(manifest.icons)) if (!zip.file(p)) throw new Error('Icon missing: ' + p);
  const out = `dist/reference-slider-${manifest.version}.zip`;
  fs.writeFileSync(out, await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' }));
  console.log('Built', out);
})().catch(e => { console.error(e); process.exitCode = 1; });
