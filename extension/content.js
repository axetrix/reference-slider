(() => {
  if (document.getElementById('pinterest-slider-root')) return;
  const host = document.createElement('div');
  host.id = 'pinterest-slider-root';
  document.documentElement.append(host);
  const root = host.attachShadow({ mode: 'open' });
  // Lucide icons, ISC license; see LUCIDE-LICENSE.txt.
  const icons = {"Info":[["circle",{"cx":"12","cy":"12","r":"10"}],["path",{"d":"M12 16v-4"}],["path",{"d":"M12 8h.01"}]],"PanelsTopLeft":[["rect",{"width":"18","height":"18","x":"3","y":"3","rx":"2"}],["path",{"d":"M3 9h18"}],["path",{"d":"M9 21V9"}]],"ArrowLeft":[["path",{"d":"m12 19-7-7 7-7"}],["path",{"d":"M19 12H5"}]],"Folder":[["path",{"d":"M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"}]],"ChevronDown":[["path",{"d":"m6 9 6 6 6-6"}]],"Bookmark":[["path",{"d":"M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z"}]],"BookmarkCheck":[["path",{"d":"M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z"}],["path",{"d":"m9 10 2 2 4-4"}]],"Trash2":[["path",{"d":"M10 11v6"}],["path",{"d":"M14 11v6"}],["path",{"d":"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"}],["path",{"d":"M3 6h18"}],["path",{"d":"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"}]],"X":[["path",{"d":"M18 6 6 18"}],["path",{"d":"m6 6 12 12"}]],"ChevronLeft":[["path",{"d":"m15 18-6-6 6-6"}]],"ChevronRight":[["path",{"d":"m9 18 6-6-6-6"}]],"Minus":[["path",{"d":"M5 12h14"}]],"Plus":[["path",{"d":"M5 12h14"}],["path",{"d":"M12 5v14"}]],"Maximize":[["path",{"d":"M8 3H5a2 2 0 0 0-2 2v3"}],["path",{"d":"M21 8V5a2 2 0 0 0-2-2h-3"}],["path",{"d":"M3 16v3a2 2 0 0 0 2 2h3"}],["path",{"d":"M16 21h3a2 2 0 0 0 2-2v-3"}]],"MoveHorizontal":[["path",{"d":"m18 8 4 4-4 4"}],["path",{"d":"M2 12h20"}],["path",{"d":"m6 8-4 4 4 4"}]],"ExternalLink":[["path",{"d":"M15 3h6v6"}],["path",{"d":"M10 14 21 3"}],["path",{"d":"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"}]],"Check":[["path",{"d":"M20 6 9 17l-5-5"}]],"Pencil":[["path",{"d":"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"}],["path",{"d":"m15 5 4 4"}]],"Play":[["path",{"d":"M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"}]],"FolderPlus":[["path",{"d":"M12 10v6"}],["path",{"d":"M9 13h6"}],["path",{"d":"M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"}]],"Search":[["path",{"d":"m21 21-4.34-4.34"}],["circle",{"cx":"11","cy":"11","r":"8"}]]};
  function icon(name) {
    return '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + icons[name].map(([tag, attrs]) => '<' + tag + ' ' + Object.entries(attrs).map(([key, value]) => key + '="' + value + '"').join(' ') + '></' + tag + '>').join('') + '</svg>';
  }
  function tool(cls, name, label, extra = '') { return '<button class="tool ' + cls + '" type="button" aria-label="' + label + '" title="' + label + '" ' + extra + '>' + icon(name) + '</button>'; }
  root.innerHTML = `
    <style>:host{all:initial;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;-webkit-font-smoothing:antialiased;color:#f5f5f7;color-scheme:dark}*{box-sizing:border-box}button,input,a{font:inherit}button{cursor:pointer;border:0;color:inherit}button,a{-webkit-tap-highlight-color:transparent}button:focus,a:focus{outline:none}.viewer:focus{outline:none}.viewer.keyboard-focus button:focus,.viewer.keyboard-focus a:focus,input:focus-visible{outline:2px solid #92bdff;outline-offset:3px}[hidden]{display:none!important}
.launch{position:fixed;bottom:24px;right:24px;z-index:2147483646;background:#a32d46;border-radius:12px;padding:15px 23px;font-weight:600;font-size:15px;box-shadow:0 4px 24px #0003;transition:scale .15s ease-out}button:active,a.tool:active{scale:.96}button:disabled{cursor:default;opacity:.3}button:disabled:active{scale:1}
.viewer{position:fixed;inset:0;z-index:2147483647;background:#131416;display:grid;grid-template-rows:auto minmax(0,1fr) auto;padding:18px 24px;gap:18px}header{display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);align-items:center;gap:16px;z-index:6}.brand{font-size:14px;letter-spacing:-.25px;white-space:nowrap;font-weight:600}.brand span{font-weight:400;color:#96989f}.close{justify-self:end}.controls,.zoom{display:flex;align-items:center;justify-content:center;gap:6px;max-width:100%;padding:6px;border-radius:32px;background:#292a2ed9;box-shadow:0 1px 0 #ffffff0c inset,0 8px 24px #0002;backdrop-filter:blur(18px)}.controls{backdrop-filter:none}.tool{width:44px;height:44px;min-width:44px;flex-shrink:0;padding:0;border:0;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;background:transparent;color:#d9dbe1;text-decoration:none;transition:background-color .15s ease-out,color .15s ease-out,scale .15s ease-out}.tool svg{display:block;pointer-events:none}.tool:hover:not(:disabled){background:#ffffff12;color:white}.tool:focus-visible{outline-offset:1px}.close,.prev,.next{background:#2b2c30d9;box-shadow:0 1px 0 #ffffff0a inset}.close:hover,.prev:hover,.next:hover{background:#3a3c42}.save.saved:disabled{opacity:1;color:#90b9ff;background:#397adf20}.remove{color:#ef9b9b}.toolbar-divider{height:20px;width:1px;background:#ffffff16;margin:0 3px;flex-shrink:0}.count,.zoom-value{font-variant-numeric:tabular-nums;font-size:12px;color:#a8abb3;white-space:nowrap;min-width:46px;text-align:center}.count{padding:0 8px}
.picker{position:relative;min-width:0}.destination{display:flex;gap:8px;align-items:center;background:transparent;color:#e5e6e9;border-radius:22px;padding:0 12px;height:44px;max-width:200px;font-size:13px}.destination:hover,.destination[aria-expanded=true]{background:#ffffff10}.destination>svg:first-child{width:18px;flex-shrink:0}.destination>svg:last-child{width:14px;flex-shrink:0;color:#9599a1}.destination-name{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.collection-menu{position:absolute;top:calc(100% + 12px);left:0;width:280px;max-width:calc(100vw - 32px);max-height:min(420px,60vh);overflow:auto;overscroll-behavior:contain;padding:6px;border-radius:16px;background:#2c2d32;box-shadow:0 0 0 1px #ffffff12,0 12px 50px #0007}.menu-heading{padding:9px 10px;font-size:11px;font-weight:600;color:#8f939c;text-transform:uppercase;letter-spacing:.5px}.menu-item{width:100%;min-height:44px;display:flex;align-items:center;gap:10px;text-align:left;background:transparent;border-radius:10px;padding:9px 10px;font-size:13px}.menu-item:hover,.menu-item:focus-visible{background:#ffffff10}.menu-item[aria-checked=true]{background:#3e74bd30;color:#d0e2ff}.menu-item svg{width:18px;height:18px;flex-shrink:0}.menu-item .menu-label{min-width:0;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.menu-count{font-size:11px;color:#9da1aa;font-variant-numeric:tabular-nums}.menu-create{margin-top:5px;border-top:1px solid #ffffff10;border-radius:0 0 10px 10px}
.stage{position:relative;display:grid;place-items:center;min-height:0;overflow:hidden;touch-action:none;user-select:none}.photo{position:absolute;object-fit:contain;transform-origin:center;outline:1px solid #ffffff1a;border-radius:10px;min-width:0;min-height:0}.message{position:absolute;text-align:center;color:#aaaeb6;max-width:min(340px,80%);line-height:1.6;font-size:14px;pointer-events:none}.prev,.next{position:absolute;top:calc(50% - 24px);z-index:1;width:48px;height:48px}.prev{left:4px}.next{right:4px}.stage.zoomed{cursor:grab}.stage.dragging{cursor:grabbing}footer{display:flex;justify-content:center;align-items:center}.zoom{padding:6px}.stage:has(.library-panel:not([hidden])),.stage:has(.info-panel:not([hidden])){touch-action:pan-y}
.info-panel{position:absolute;right:0;top:0;bottom:0;width:min(400px,100%);z-index:4;overflow:auto;overscroll-behavior:contain;touch-action:pan-y;user-select:text;background:#24252a;border-radius:20px;padding:20px;box-shadow:0 0 0 1px #ffffff0c inset,0 10px 50px #0004}.panel-top{display:flex;justify-content:space-between;align-items:center;gap:12px}.panel-top h2{font-size:15px;font-weight:600;margin:0}.info-title{font-size:20px;line-height:1.35;letter-spacing:-.4px;text-wrap:balance;overflow-wrap:anywhere}.info-panel p{font-size:13px;line-height:1.7;color:#b1b4bd;white-space:pre-wrap;overflow-wrap:anywhere}.info-resolution{font-variant-numeric:tabular-nums}.info-panel a{display:flex;align-items:center;min-height:44px;padding:12px;margin-top:12px;border-radius:12px;background:#ffffff08;color:#9cc5ff;font-size:13px;text-decoration:none;overflow-wrap:anywhere}.info-panel a:hover{background:#ffffff12}
.library-panel{position:absolute;inset:0;background:#18191d;z-index:3;padding:28px;overflow:auto;overscroll-behavior:contain;touch-action:pan-y;border-radius:24px}.library-content{max-width:1080px;margin:auto}.library-top{display:flex;align-items:center;justify-content:space-between;gap:16px}.library-top h2{font-size:26px;font-weight:600;letter-spacing:-.7px;margin:0;text-wrap:balance}.library-subtitle{font-size:13px;color:#90949e;margin:8px 0 0}.library-tools{display:flex;gap:14px;justify-content:space-between;margin-top:24px;flex-wrap:wrap}.search-box,.create-form{display:flex;align-items:center;background:#24252a;border-radius:14px;min-height:48px;box-shadow:0 0 0 1px #ffffff08 inset}.search-box{gap:10px;padding:0 14px;flex:1;min-width:180px}.search-box svg{color:#858995;width:18px}.create-form{margin:0;padding:2px 4px 2px 12px;flex:1;max-width:360px}.search-box input,.create-form input{border:0;background:transparent;color:white;min-width:0;width:100%;font-size:13px;height:44px;outline-offset:-2px}.search-box:focus-within,.create-form:focus-within{box-shadow:0 0 0 2px #92bdff80}.search-box input:focus-visible,.create-form input:focus-visible{outline:none}.create-form .tool{background:#3378ec;color:white;width:40px;height:40px;min-width:40px}.library-status{font-size:13px;color:#a6abb7;min-height:20px;margin:12px 0}.collection-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(230px,100%),1fr));gap:16px}.collection-card{background:#24252a;border-radius:20px;padding:12px;min-width:0;box-shadow:0 1px 0 #ffffff08 inset}.card-cover{display:block;width:100%;height:150px;object-fit:cover;border-radius:8px;background:#2c2e35;outline:1px solid #ffffff1a}.empty-cover{display:grid;place-items:center;color:#5e6471}.empty-cover svg{width:36px;height:36px}.collection-card h3{font-size:15px;font-weight:600;letter-spacing:-.2px;margin:14px 4px 6px;overflow-wrap:anywhere}.collection-card .count{display:block;text-align:left;padding:0 4px;min-width:0;font-size:12px}.card-buttons{display:flex;gap:4px;align-items:center;margin-top:10px}.card-buttons .view-collection{margin-right:auto;background:#ffffff08}.card-buttons .delete-collection{color:#bc9295}.empty-state{grid-column:1/-1;text-align:center;color:#989da8;padding:60px 20px;line-height:1.7;font-size:14px}.viewer:has(.library-panel:not([hidden])){grid-template-rows:auto minmax(0,1fr)}.viewer:has(.library-panel:not([hidden])) footer,.viewer:has(.library-panel:not([hidden])) .controls{display:none}.viewer:has(.library-panel:not([hidden])) header{grid-template-columns:1fr auto}
@media(max-width:1000px){.brand{display:none}header{grid-template-columns:minmax(0,1fr) auto}.controls{justify-self:center}.viewer:has(.library-panel:not([hidden])) .brand{display:block}}
@media(max-width:600px){.viewer{padding:12px;gap:12px}header{grid-template-columns:minmax(0,1fr) 44px;gap:8px;align-items:start}.controls{justify-content:center;flex-wrap:wrap;width:100%;border-radius:24px;padding:4px;gap:2px}.destination{max-width:150px;padding:0 8px}.count{min-width:30px;padding:0 4px}.controls .toolbar-divider{display:none}.zoom{gap:2px;padding:4px}.zoom .tool{width:40px;height:44px;min-width:40px}.zoom .toolbar-divider{margin:0 1px}.zoom-value{min-width:40px}.library-panel{padding:18px;border-radius:18px}.library-tools{gap:10px}.search-box,.create-form{flex-basis:100%;max-width:none}.info-panel{padding:18px}.launch{bottom:18px;right:18px}}
@media(prefers-reduced-motion:reduce){button,.tool,a.tool{transition:none}}
</style>
    <button class="launch" type="button">Open Slider</button>
    <section class="viewer" hidden role="dialog" aria-modal="true" aria-label="Reference Slider image viewer" tabindex="-1">
      <header>
        <strong class="brand">Reference <span>Slider</span></strong>
        <div class="controls" role="toolbar" aria-label="Image actions">
          ${tool('feed', 'ArrowLeft', 'Back to feed', 'hidden')}
          ${tool('library-open', 'PanelsTopLeft', 'Collections')}
          <div class="picker"><button class="destination" type="button" aria-label="Save to collection" aria-haspopup="menu" aria-expanded="false">${icon('Folder')}<span class="destination-name">Collection</span>${icon('ChevronDown')}</button><div class="collection-menu" role="menu" aria-label="Save to collection" hidden></div></div>
          ${tool('save', 'Bookmark', 'Save reference')}
          ${tool('remove', 'Trash2', 'Remove reference', 'hidden')}
          <span class="toolbar-divider"></span>
          ${tool('info-open', 'Info', 'Image details')}
          <span class="count" aria-live="polite"></span>
        </div>
        ${tool('close', 'X', 'Close (Esc)')}
        <span class="collection-name" hidden></span>
      </header>
      <div class="stage">
        <aside class="info-panel" hidden aria-label="Image details"><div class="panel-top"><h2>Image details</h2>${tool('info-close','X','Close details')}</div><h3 class="info-title"></h3><p class="info-description"></p><p class="info-resolution"></p><p class="info-status" role="status"></p><a class="info-source" target="_blank" rel="noopener noreferrer" hidden></a><a class="info-pin" target="_blank" rel="noopener noreferrer">Open original pin</a></aside>
        <section class="library-panel" hidden aria-label="My collections"><div class="library-content"><div class="library-top"><div><h2>My collections</h2><p class="library-subtitle">References for your next project.</p></div>${tool('library-back','ArrowLeft','Back to viewer')}</div><div class="library-tools"><label class="search-box">${icon('Search')}<input class="collection-search" type="search" placeholder="Search collections" aria-label="Search collections"></label><form class="create-form"><input maxlength="100" aria-label="Collection name" placeholder="New collection" required><button class="tool" type="submit" title="Create collection" aria-label="Create collection">${icon('Plus')}</button></form></div><p class="library-status" role="status"></p><div class="collection-list"></div></div></section>
        <p class="message" role="status"></p><img class="photo" draggable="false" hidden>
        ${tool('prev','ChevronLeft','Previous image')}${tool('next','ChevronRight','Next image')}
      </div>
      <footer><div class="zoom" role="toolbar" aria-label="Image zoom">
        ${tool('minus','Minus','Zoom out')}<span class="zoom-value">100%</span>${tool('plus','Plus','Zoom in')}<span class="toolbar-divider"></span>${tool('fit','Maximize','Fit image')}${tool('width','MoveHorizontal','Fit to width')}<span class="toolbar-divider"></span><a class="tool link" target="_blank" rel="noopener noreferrer" aria-label="Open pin" title="Open pin">${icon('ExternalLink')}</a>
      </div><span class="caption" hidden></span></footer>
    </section>`;
  const $ = (s) => root.querySelector(s);
  const viewer = $('.viewer'), photo = $('.photo');
  let pins = [], index = 0, opened = false, loading = false, session = 0, previousFocus, scrollPosition;
  let route = location.href;
  let collections = [], selectedCollection = '', activeCollection = null, feedPins = null, feedIndex = 0, busy = false;
  const standalone = location.protocol === 'chrome-extension:';
  let storageError = '';
  async function collectionAction(action, values = {}) {
    const result = await chrome.runtime.sendMessage({ type: 'SLIDER_COLLECTIONS', action, ...values });
    if (!result || result.error) throw new Error(result?.error || 'Could not load collections.');
    collections = result.collections;
    storageError = '';
    updateCollectionControls();
    return result;
  }
  function updateCollectionControls() {
    if (!collections.some(c => c.id === selectedCollection)) selectedCollection = collections[0]?.id || '';
    const selected = collections.find(c => c.id === selectedCollection);
    $('.destination-name').textContent = selected?.name || 'Collection';
    $('.destination').title = selected ? `Save to: ${selected.name}` : 'Choose a collection';
    if (!$('.collection-menu').hidden) renderCollectionMenu();
    const saved = selected?.pins.some(p => p.id === pins[index]?.id);
    $('.save').innerHTML = icon(saved ? 'BookmarkCheck' : 'Bookmark');
    $('.save').setAttribute('aria-label', saved ? 'Reference saved' : 'Save reference');
    $('.save').title = saved ? 'Reference saved' : 'Save reference';
    $('.save').classList.toggle('saved', !!saved);
    $('.save').disabled = busy || !pins[index] || !!saved;
    $('.remove').hidden = !activeCollection || !pins[index];
    $('.remove').disabled = busy;
    $('.feed').hidden = !activeCollection || standalone;
    $('.collection-name').textContent = collections.find(c => c.id === activeCollection)?.name || '';
  }
  function closeCollectionMenu(focus = false) {
    $('.collection-menu').hidden = true;
    $('.destination').setAttribute('aria-expanded', 'false');
    if (focus) $('.destination').focus();
  }
  function renderCollectionMenu() {
    const menu = $('.collection-menu'); menu.replaceChildren();
    const heading = document.createElement('div'); heading.className = 'menu-heading'; heading.textContent = 'Save to collection'; menu.append(heading);
    for (const c of collections) {
      const button = document.createElement('button'); button.className = 'menu-item'; button.type = 'button';
      button.setAttribute('role', 'menuitemradio'); button.setAttribute('aria-checked', String(c.id === selectedCollection));
      button.innerHTML = icon(c.id === selectedCollection ? 'Check' : 'Folder');
      const label = document.createElement('span'); label.className = 'menu-label'; label.textContent = c.name;
      const count = document.createElement('span'); count.className = 'menu-count'; count.textContent = c.pins.length;
      button.append(label, count);
      button.onclick = () => { selectedCollection = c.id; closeCollectionMenu(true); updateCollectionControls(); };
      menu.append(button);
    }
    const create = document.createElement('button'); create.type = 'button'; create.className = 'menu-item menu-create'; create.setAttribute('role', 'menuitem');
    create.innerHTML = icon('FolderPlus'); const label = document.createElement('span'); label.textContent = 'New collection'; create.append(label);
    create.onclick = () => { closeCollectionMenu(); showLibrary(); }; menu.append(create);
  }
  $('.destination').onclick = () => {
    if (!$('.collection-menu').hidden) { closeCollectionMenu(); return; }
    renderCollectionMenu(); $('.collection-menu').hidden = false;
    $('.destination').setAttribute('aria-expanded', 'true');
    const menu = $('.collection-menu'); menu.style.marginLeft = '0px';
    const rect = menu.getBoundingClientRect();
    menu.style.marginLeft = `${Math.min(0, innerWidth - 16 - rect.right) + Math.max(0, 16 - rect.left)}px`;
    (menu.querySelector('[aria-checked="true"]') || menu.querySelector('button'))?.focus();
  };
  root.addEventListener('keydown', e => {
    if ($('.collection-menu').hidden || !['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) return;
    e.preventDefault(); e.stopPropagation();
    const items = [...$('.collection-menu').querySelectorAll('button')];
    let index = items.indexOf(root.activeElement);
    index = e.key === 'Home' ? 0 : e.key === 'End' ? items.length - 1 : (index + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
    items[index].focus();
  });
  document.addEventListener('pointerdown', e => {
    viewer.classList.remove('keyboard-focus');
    if (!e.composedPath().includes($('.picker'))) closeCollectionMenu();
  }, true);
  function showLibrary() {
    cancelMetadata();
    closeCollectionMenu();
    $('.info-panel').hidden = true;
    $('.library-panel').hidden = false;
    $('.library-status').textContent = storageError;
    renderLibrary(); $('.create-form input').focus();
  }
  function hideLibrary() { $('.library-panel').hidden = true; $('.library-open').focus(); }
  function renderLibrary() {
    const list = $('.collection-list'); list.replaceChildren();
    const query = $('.collection-search').value.trim().toLocaleLowerCase();
    const filtered = collections.filter(c => c.name.toLocaleLowerCase().includes(query));
    if (!filtered.length) { const p = document.createElement('p'); p.className = 'empty-state'; p.textContent = query ? 'No matching collections.' : 'Create your first collection to start saving references.'; list.append(p); }
    for (const c of filtered) {
      const card = document.createElement('article'); card.className = 'collection-card';
      if (c.pins[0]) { const img = document.createElement('img'); img.className = 'card-cover'; img.src = c.pins[0].src; img.alt = ''; img.loading = 'lazy'; card.append(img); }
      if (!c.pins[0]) { const cover = document.createElement('div'); cover.className = 'card-cover empty-cover'; cover.innerHTML = icon('Folder'); card.append(cover); }
      const title = document.createElement('h3'); title.textContent = c.name;
      const count = document.createElement('span'); count.className = 'count'; count.textContent = `References: ${c.pins.length}`;
      const buttons = document.createElement('div'); buttons.className = 'card-buttons';
      const addButton = (label, name, handler, cls = '') => { const button = document.createElement('button'); button.type = 'button'; button.className = `tool ${cls}`; button.innerHTML = icon(name); button.title = label; button.setAttribute('aria-label', label); button.onclick = handler; buttons.append(button); };
      addButton('View collection', 'Play', () => {
        if (!activeCollection) { feedPins = pins; feedIndex = index; }
        activeCollection = c.id; selectedCollection = c.id; pins = [...c.pins]; index = 0;
        session++; loading = false; hideLibrary(); render();
      }, 'view-collection');
      addButton('Rename collection', 'Pencil', async () => {
        const name = window.prompt('Collection name', c.name);
        if (name === null) return;
        await editCollection('rename', { id: c.id, name });
      });
      addButton('Delete collection', 'Trash2', async () => {
        if (!window.confirm(`Delete collection “${c.name}” and its saved references?`)) return;
        await editCollection('delete', { id: c.id });
      }, 'delete-collection');
      card.append(title, count, buttons); list.append(card);
    }
  }
  async function editCollection(action, values) {
    try {
      await collectionAction(action, values);
      if (activeCollection && !collections.some(c => c.id === activeCollection)) returnToFeed();
      renderLibrary(); $('.library-status').textContent = '';
    } catch (error) { $('.library-status').textContent = error.message; }
  }
  function returnToFeed() {
    activeCollection = null; pins = feedPins || []; index = feedIndex; feedPins = null;
    session++; loading = false; collect(); render();
  }
  $('.feed').onclick = returnToFeed;
  $('.library-back').onclick = hideLibrary;
  $('.library-open').onclick = showLibrary;
  $('.collection-search').oninput = renderLibrary;
  $('.create-form').onsubmit = async e => {
    e.preventDefault(); const input = $('.create-form input');
    const button = $('.create-form button'); button.disabled = true;
    try {
      await collectionAction('create', { name: input.value });
      selectedCollection = collections.at(-1).id; input.value = ''; updateCollectionControls(); renderLibrary();
      $('.library-status').textContent = 'Collection created. Return to the viewer to save references.';
    } catch (error) { $('.library-status').textContent = error.message; }
    finally { button.disabled = false; }
  };
  $('.save').onclick = async () => {
    // Capture the user's choice before storage/network work yields to navigation.
    const pin = pins[index], collectionId = selectedCollection;
    if (busy || !pin) return;
    busy = true; updateCollectionControls();
    try {
      await loadCollections();
      if (storageError) throw new Error(storageError);
      const id = collectionId || selectedCollection;
      if (!id) { showLibrary(); return; }
      await collectionAction('save', { id, pin });
    }
    catch (error) { storageError = error.message; showLibrary(); }
    finally { busy = false; updateCollectionControls(); }
  };
  $('.remove').onclick = async () => {
    busy = true; updateCollectionControls();
    try {
      const pinId = pins[index]?.id;
      await collectionAction('remove', { id: activeCollection, pinId });
      pins = [...(collections.find(c => c.id === activeCollection)?.pins || [])];
      index = Math.max(0, Math.min(index, pins.length - 1)); render();
    } catch (error) { storageError = error.message; showLibrary(); }
    finally { busy = false; updateCollectionControls(); }
  };
  // Collections load on first open, so Pinterest tabs where the viewer is never
  // used neither hold a copy nor receive every storage change.
  let collectionsReady = null, watchingStorage = false;
  function loadCollections() {
    if (!watchingStorage) { watchingStorage = true; chrome.storage?.onChanged.addListener(storageChanged); }
    collectionsReady ||= collectionAction('get').catch(error => { storageError = error.message; collectionsReady = null; });
    return collectionsReady;
  }
  function storageChanged(changes, area) {
    if (area !== 'local' || !changes.pinterestSliderCollections) return;
    collections = changes.pinterestSliderCollections.newValue || [];
    if (activeCollection) {
      const c = collections.find(c => c.id === activeCollection);
      if (!c) returnToFeed();
      else {
        const currentId = pins[index]?.id; pins = [...c.pins];
        const found = pins.findIndex(p => p.id === currentId); index = found >= 0 ? found : Math.max(0, Math.min(index, pins.length - 1));
        if (pins[index]?.id !== currentId) render();
        else { $('.count').textContent = pins.length ? `${index + 1} / ${pins.length}` : ''; $('.next').disabled = index >= pins.length - 1; }
      }
    }
    updateCollectionControls(); if (!$('.library-panel').hidden) renderLibrary();
  }
  let imageCandidates = [], candidateIndex = 0, upgrade = null, preload = null, keepView = false;
  function clearImageRequests() {
    for (const image of [upgrade, preload]) {
      if (image) { image.onload = image.onerror = null; image.removeAttribute('src'); }
    }
    upgrade = preload = null; keepView = false; imageCandidates = []; candidateIndex = 0;
    photo.hidden = true; photo.removeAttribute('src');
  }
  const size = /\/(?:\d+x(?:\d+)?(?:_[^/]+)?|originals)\//;
  // Start with a screen-sized copy: originals can decode to 100+ MB each,
  // so they are requested only once zooming needs more pixels (see sharpen).
  function sources(src) {
    return [...new Set(['1200x', '736x'].map(value => src.replace(size, `/${value}/`)).concat(src, src.replace(size, '/originals/')))];
  }
  function sharpen() {
    const pin = pins[index];
    if (upgrade || !pin || photo.hidden || zoom <= 1.01 || !size.test(pin.src)) return;
    if (photo.naturalWidth >= baseWidth * zoom * devicePixelRatio) return;
    const original = pin.src.replace(size, '/originals/');
    if (photo.currentSrc === original) return;
    const image = upgrade = new Image();
    image.onload = () => {
      // Ignore results for a pin the viewer has already left.
      if (upgrade !== image || !opened || pins[index] !== pin || image.naturalWidth <= photo.naturalWidth) return;
      keepView = true; photo.src = original;
    };
    image.src = original;
  }
  function externalUrl(value) {
    try {
      const url = new URL(value);
      if (url.username || url.password || !['http:', 'https:'].includes(url.protocol) || /(^|\.)(pinterest\.[a-z.]+|pinimg\.com)$/.test(url.hostname)) return '';
      return url.href;
    } catch { return ''; }
  }
  function updateInfo() {
    const pin = pins[index];
    $('.info-open').disabled = !pin;
    if (!pin) { $('.info-panel').hidden = true; return; }
    $('.info-title').textContent = pin.title;
    $('.info-description').textContent = pin.description || 'No description provided.';
    $('.info-resolution').textContent = !photo.hidden ? `Image: ${photo.naturalWidth} × ${photo.naturalHeight} px` : '';
    $('.info-pin').href = pin.url;
    const source = externalUrl(pin.source);
    $('.info-source').hidden = !source;
    if (source) {
      $('.info-source').href = source;
      $('.info-source').textContent = `Visit source: ${new URL(source).hostname}`;
    } else $('.info-source').removeAttribute('href');
    $('.info-status').textContent = source ? '' : (pin.metadataLoaded ? 'No external link is listed for this pin.' : 'Loading image details…');
  }
  let metadataRequest = null;
  function cancelMetadata() {
    metadataRequest?.controller.abort(); metadataRequest = null;
  }
  async function boundedHtml(response) {
    const limit = 5 * 1024 * 1024;
    if (Number(response.headers.get('content-length')) > limit) throw new Error('Pin page is too large.');
    const reader = response.body.getReader(), decoder = new TextDecoder();
    let bytes = 0, text = '';
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) return text + decoder.decode();
        bytes += value.byteLength;
        if (bytes > limit) throw new Error('Pin page is too large.');
        text += decoder.decode(value, { stream: true });
      }
    } finally { await reader.cancel().catch(() => {}); reader.releaseLock(); }
  }
  async function showInfo() {
    const pin = pins[index]; if (!pin) return;
    closeCollectionMenu();
    $('.info-panel').hidden = false; updateInfo(); $('.info-close').focus();
    if (pin.metadataLoaded || pin.source || metadataRequest?.pin === pin) return;
    cancelMetadata();
    const request = metadataRequest = { pin, controller: new AbortController() };
    const timeout = setTimeout(() => request.controller.abort(), 15000);
    try {
      const response = await fetch(new URL(`/pin/${pin.id}/`, standalone ? 'https://www.pinterest.com' : location.origin), { credentials: 'same-origin', signal: request.controller.signal });
      if (!response.ok) throw new Error('This pin is unavailable.');
      const html = await boundedHtml(response);
      if (metadataRequest !== request) return;
      const doc = new DOMParser().parseFromString(html, 'text/html');
      let data, visited = 0;
      // Pinterest embeds pin metadata in JSON. Only accept an object for this exact pin.
      for (const script of doc.querySelectorAll('script[type="application/json"]')) {
        let parsed; try { parsed = JSON.parse(script.textContent); } catch { continue; }
        const pending = [parsed];
        while (pending.length && visited++ < 50000) {
          const value = pending.pop();
          if (!value || typeof value !== 'object') continue;
          if (String(value.id) === pin.id && ('description' in value || 'link' in value || 'images' in value)) { data = value; break; }
          for (const child of Object.values(value)) if (child && typeof child === 'object') pending.push(child);
        }
        if (data || visited >= 50000) break;
      }
      if (data) {
        pin.title = String(data.title || data.grid_title || pin.title);
        pin.description = String(data.description || ''); pin.source = externalUrl(data.link);
      } else {
        const title = doc.querySelector('meta[property="og:title"]')?.content;
        const description = doc.querySelector('meta[property="og:description"]')?.content;
        if (title) pin.title = title;
        if (description) pin.description = description;
        const link = doc.querySelector('[data-test-id="visit-site-button"] a[href],a[data-test-id="pin-link"][href],a[data-test-id="visit-site-button"][href]');
        pin.source = externalUrl(link?.getAttribute('href'));
        if (!title && !description && !pin.source) throw new Error('The source did not return pin details.');
      }
      pin.metadataLoaded = true;
      if (pins[index] === pin) { $('.caption').textContent = pin.title; updateInfo(); }
      if (collections.some(c => c.pins.some(p => p.id === pin.id))) {
        await collectionAction('metadata', { pin });
      }
    } catch {
      if (metadataRequest === request && pins[index] === pin) $('.info-status').textContent = 'Could not load the source. Open the original pin to check its link.';
    } finally {
      clearTimeout(timeout); request.controller.abort();
      if (metadataRequest === request) metadataRequest = null;
    }
  }
  $('.info-open').onclick = showInfo;
  $('.info-close').onclick = () => { cancelMetadata(); $('.info-panel').hidden = true; $('.info-open').focus(); };
  function currentPagePin() {
    const match = location.pathname.match(/^\/pin\/(\d+)\/?$/);
    if (!match) return null;
    const id = match[1];
    const detail = document.querySelector('[data-test-id="pin-closeup-image"], [data-test-id="closeup-body"], [data-test-id="pin-closeup"]');
    const candidates = [...(detail ? detail.querySelectorAll('img') : document.querySelectorAll('img'))];
    if (detail?.tagName === 'IMG') candidates.unshift(detail);
    const eligible = candidates.filter(img => {
      const src = img.currentSrc || img.src;
      if (!/^https:\/\/i\.pinimg\.com\//.test(src)) return false;
      const link = img.closest('a[href*="/pin/"]');
      if (link && link.pathname.match(/^\/pin\/(\d+)/)?.[1] !== id) return false;
      const rect = img.getBoundingClientRect();
      return rect.width >= 100 && rect.height >= 100;
    });
    // Measure once instead of forcing layout reads inside every comparison.
    const area = img => { const rect = img.getBoundingClientRect(); return rect.width * rect.height; };
    const img = eligible.map(img => [area(img), img]).sort((a, b) => b[0] - a[0])[0]?.[1];
    // Metadata fallback is allowed only when it belongs to this exact page,
    // since Pinterest can retain stale meta tags during client-side navigation.
    const metaUrl = document.querySelector('meta[property="og:url"]')?.content;
    let metaMatches = false;
    try { metaMatches = !!metaUrl && new URL(metaUrl, location.href).pathname.match(/^\/pin\/(\d+)/)?.[1] === id; } catch { /* Ignore invalid page metadata. */ }
    const src = img?.currentSrc || img?.src || (metaMatches ? document.querySelector('meta[property="og:image"]')?.content : '');
    if (!/^https:\/\/i\.pinimg\.com\//.test(src || '')) return null;
    const body = document.querySelector('[data-test-id="closeup-body"], [data-test-id="pin-closeup"]');
    const source = body?.querySelector('[data-test-id="visit-site-button"] a[href],a[data-test-id="visit-site-button"],a[data-test-id="pin-link"]');
    return { id, src, url: `${location.origin}/pin/${id}/`,
      title: body?.querySelector('h1')?.textContent || img?.alt || (metaMatches ? document.querySelector('meta[property="og:title"]')?.content : '') || 'Reference image',
      description: body?.querySelector('[data-test-id="pin-description"]')?.textContent || '', source: externalUrl(source?.href) };
  }
  function collect() {
    if (activeCollection || standalone) return;
    const current = currentPagePin();
    if (current) {
      const existing = pins.find(p => p.id === current.id);
      if (existing) Object.assign(existing, current);
      else pins.unshift(current);
    }
    const seen = new Set(pins.map(p => p.id));
    for (const img of document.querySelectorAll('a[href*="/pin/"] img')) {
      const anchor = img.closest('a[href*="/pin/"]');
      const match = anchor?.pathname.match(/^\/pin\/(\d+)\/?$/);
      const src = img.currentSrc || img.src;
      if (!match || seen.has(match[1]) || !/^https:\/\/i\.pinimg\.com\//.test(src)) continue;
      if ((img.naturalWidth || img.width) < 100) continue;
      seen.add(match[1]);
      const card = anchor.closest('[data-test-id="pin"],[data-test-id="pinWrapper"],[data-grid-item]');
      const sourceAnchor = card?.querySelector('a[data-test-id="pin-link"],a[data-test-id="visit-site-button"]');
      pins.push({ id: match[1], src, title: img.alt || 'Reference image', url: `${location.origin}/pin/${match[1]}/`,
        description: card?.querySelector('[data-test-id="pin-description"]')?.textContent || '', source: externalUrl(sourceAnchor?.href) });
    }
  }
  const stage = $('.stage');
  let zoom = 1, panX = 0, panY = 0, baseWidth = 0, baseHeight = 0;
  const pointers = new Map();
  let gesture = null;
  function paint() {
    const maxX = Math.max(0, (baseWidth * zoom - stage.clientWidth) / 2);
    const maxY = Math.max(0, (baseHeight * zoom - stage.clientHeight) / 2);
    panX = Math.max(-maxX, Math.min(maxX, panX));
    panY = Math.max(-maxY, Math.min(maxY, panY));
    photo.style.width = `${baseWidth}px`; photo.style.height = `${baseHeight}px`;
    photo.style.transform = `translate(${panX}px, ${panY}px) scale(${zoom})`;
    stage.classList.toggle('zoomed', zoom > 1.01);
    $('.zoom-value').textContent = `${Math.round(zoom * 100)}%`;
    $('.minus').disabled = zoom <= 1;
    $('.plus').disabled = !baseWidth || zoom >= 32;
    $('.fit').disabled = $('.width').disabled = !baseWidth;
    sharpen();
  }
  function fit() {
    if (photo.hidden || !photo.naturalWidth) return;
    const ratio = Math.min(stage.clientWidth / photo.naturalWidth, stage.clientHeight / photo.naturalHeight);
    baseWidth = photo.naturalWidth * ratio || 0; baseHeight = photo.naturalHeight * ratio || 0;
    zoom = 1; panX = panY = 0; paint();
  }
  function magnify(value, x = stage.clientWidth / 2, y = stage.clientHeight / 2) {
    if (photo.hidden || !baseWidth) return;
    const next = Math.max(1, Math.min(32, value));
    const factor = next / zoom;
    panX = (panX - (x - stage.clientWidth / 2)) * factor + x - stage.clientWidth / 2;
    panY = (panY - (y - stage.clientHeight / 2)) * factor + y - stage.clientHeight / 2;
    zoom = next; paint();
  }
  $('.plus').onclick = () => magnify(zoom * 1.5);
  $('.minus').onclick = () => magnify(zoom / 1.5);
  $('.fit').onclick = fit;
  $('.width').onclick = () => {
    magnify(stage.clientWidth / baseWidth);
    panY = Math.max(0, (baseHeight * zoom - stage.clientHeight) / 2); paint();
  };
  new ResizeObserver(() => { if (opened && !photo.hidden) fit(); }).observe(stage);
  function render() {
    cancelMetadata(); clearImageRequests();
    $('.info-panel').hidden = true;
    pointers.clear(); gesture = null; stage.classList.remove('dragging');
    zoom = 1; panX = panY = 0; baseWidth = baseHeight = 0; paint();
    const pin = pins[index];
    $('.prev').disabled = !pin || index === 0;
    $('.next').disabled = loading || (!!activeCollection && index >= pins.length - 1);
    updateCollectionControls();
    updateInfo();
    $('.count').textContent = pin ? `${index + 1} / ${pins.length}` : '';
    $('.caption').textContent = pin?.title || '';
    $('.link').hidden = !pin;
    if (!pin) { photo.hidden = true; $('.message').textContent = activeCollection ? 'This collection is empty. Return to the feed and save some references.' : 'No images yet. Open a supported feed, search, board or pin and wait for it to load.'; return; }
    $('.link').href = pin.url;
    photo.hidden = true;
    $('.message').textContent = 'Loading image…';
    photo.alt = pin.title;
    imageCandidates = sources(pin.src);
    candidateIndex = 0; upgrade = null; keepView = false;
    photo.src = imageCandidates[0];
    const next = pins[index + 1];
    if (next) { preload = new Image(); preload.src = sources(next.src)[0]; }
  }
  photo.onload = () => {
    if (!opened || !pins[index] || !photo.getAttribute('src')) return;
    photo.hidden = false;
    // A sharper copy replaces the preview without resetting the user's zoom.
    if (keepView) keepView = false; else fit();
    updateInfo(); $('.message').textContent = '';
  };
  photo.onerror = () => {
    if (!opened || !pins[index] || !photo.getAttribute('src')) return;
    keepView = false;
    if (candidateIndex + 1 < imageCandidates.length) {
      photo.src = imageCandidates[++candidateIndex];
      return;
    }
    $('.message').textContent = 'Could not load this image. You can skip to the next pin.';
  };
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
  async function move(direction) {
    if (!opened || loading) return;
    collect();
    if (index + direction >= 0 && index + direction < pins.length) { index += direction; render(); return; }
    if (direction < 0 || activeCollection || standalone) return;
    loading = true;
    const token = session, count = pins.length;
    $('.next').disabled = true;
    $('.message').textContent = 'Looking for more images…';
    // Scroll the underlying feed so Pinterest can load its next batch.
    for (let attempt = 0; attempt < 6 && opened && token === session; attempt++) {
      window.scrollBy({ top: Math.max(innerHeight * .85, 600), behavior: 'instant' });
      await delay(700);
      if (!opened || token !== session) return;
      collect();
      if (pins.length > count) break;
    }
    loading = false;
    if (pins.length > count) { index++; render(); }
    else { $('.next').disabled = false; $('.message').textContent = 'No more images yet. Try again in a few seconds.'; }
  }
  function open() {
    if (opened) return;
    if (route !== location.href) { activeCollection = null; feedPins = null; pins = []; index = 0; route = location.href; }
    collect();
    if (!activeCollection) {
      const id = location.pathname.match(/^\/pin\/(\d+)/)?.[1];
      const currentIndex = pins.findIndex(p => p.id === id);
      if (currentIndex >= 0) index = currentIndex;
    }
    previousFocus = document.activeElement;
    scrollPosition = { left: scrollX, top: scrollY };
    viewer.classList.remove('keyboard-focus');
    opened = true; session++; loading = false;
    loadCollections();
    viewer.hidden = false; $('.launch').hidden = true;
    render(); $('.close').focus();
  }
  function close() {
    cancelMetadata(); clearImageRequests();
    closeCollectionMenu();
    opened = false; session++; loading = false; pointers.clear(); gesture = null; stage.classList.remove('dragging');
    viewer.hidden = true; $('.launch').hidden = false; $('.library-panel').hidden = true;
    window.scrollTo({ ...scrollPosition, behavior: 'instant' });
    previousFocus?.focus({ preventScroll: true });
  }
  $('.launch').onclick = open; $('.close').onclick = close;
  $('.prev').onclick = () => move(-1); $('.next').onclick = () => move(1);
  document.addEventListener('keydown', e => {
    if (!opened) return;
    if (e.key === 'Tab') viewer.classList.add('keyboard-focus');
    if (['Escape', 'ArrowLeft', 'ArrowRight'].includes(e.key)) viewer.classList.remove('keyboard-focus');
    const menuVisible = !$('.collection-menu').hidden;
    if (menuVisible && !['Escape', 'Tab'].includes(e.key)) return;
    const editing = ['INPUT', 'SELECT', 'TEXTAREA'].includes(root.activeElement?.tagName);
    if (editing && e.key !== 'Escape' && e.key !== 'Tab') return;
    if (e.key === ' ' && ['BUTTON', 'A'].includes(root.activeElement?.tagName)) return;
    const infoVisible = !$('.info-panel').hidden;
    const libraryVisible = !$('.library-panel').hidden;
    if ((libraryVisible || infoVisible) && !['Escape', 'Tab'].includes(e.key)) return;
    if (['Escape', 'ArrowLeft', 'ArrowRight', 'Tab', ' '].includes(e.key)) {
      e.preventDefault(); e.stopImmediatePropagation();
      if (e.key === 'Escape') { if (menuVisible) closeCollectionMenu(true); else if (libraryVisible) hideLibrary(); else if (infoVisible) $('.info-close').click(); else close(); }
      if (e.key === 'ArrowLeft') move(-1);
      if (e.key === 'ArrowRight' || e.key === ' ') move(1);
      if (e.key === 'Tab') {
        if (menuVisible) { closeCollectionMenu(true); return; }
        const items = [...root.querySelectorAll(libraryVisible ? '.library-panel button,.library-panel input' : infoVisible ? '.info-panel button,.info-panel a' : '.viewer button,.viewer a,.viewer select')].filter(el => !el.disabled && el.getClientRects().length);
        const current = items.indexOf(root.activeElement);
        items[(current + (e.shiftKey ? -1 : 1) + items.length) % items.length].focus();
      }
    }
  }, true);
  function point(e) {
    const rect = stage.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }
  function beginGesture() {
    const values = [...pointers.values()];
    if (values.length >= 2) {
      const [a, b] = values;
      gesture = { pinch: true, distance: Math.hypot(a.x - b.x, a.y - b.y), zoom,
        x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, panX, panY };
    } else if (values.length) {
      gesture = { ...values[0], panX, panY, pan: zoom > 1.01, swiped: false };
    } else gesture = null;
  }
  stage.addEventListener('pointerdown', e => {
    if (e.target.closest('button,.library-panel,.info-panel') || e.button !== 0 || photo.hidden) return;
    pointers.set(e.pointerId, point(e)); stage.setPointerCapture(e.pointerId);
    beginGesture(); stage.classList.add('dragging');
  });
  stage.addEventListener('pointermove', e => {
    if (!pointers.has(e.pointerId) || !gesture) return;
    pointers.set(e.pointerId, point(e));
    if (gesture.pinch && pointers.size >= 2) {
      const [a, b] = [...pointers.values()];
      const centerX = (a.x + b.x) / 2, centerY = (a.y + b.y) / 2;
      zoom = Math.max(1, Math.min(32, gesture.zoom * Math.hypot(a.x - b.x, a.y - b.y) / Math.max(1, gesture.distance)));
      const factor = zoom / gesture.zoom;
      panX = (gesture.panX - (gesture.x - stage.clientWidth / 2)) * factor + centerX - stage.clientWidth / 2;
      panY = (gesture.panY - (gesture.y - stage.clientHeight / 2)) * factor + centerY - stage.clientHeight / 2;
      paint();
    } else if (gesture.pan) {
      const p = point(e); panX = gesture.panX + p.x - gesture.x; panY = gesture.panY + p.y - gesture.y; paint();
    }
  });
  function endPointer(e) {
    if (!pointers.has(e.pointerId)) return;
    const p = point(e), previous = gesture;
    pointers.delete(e.pointerId);
    if (e.type === 'pointerup' && previous && !previous.pinch && !previous.pan && !previous.swiped) {
      const dx = p.x - previous.x, dy = p.y - previous.y;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.2) move(dx < 0 ? 1 : -1);
    }
    beginGesture();
    // A remaining finger after a pinch must never switch to a swipe.
    if (gesture) gesture.swiped = true;
    if (!pointers.size) stage.classList.remove('dragging');
  }
  stage.addEventListener('pointerup', endPointer);
  stage.addEventListener('pointercancel', endPointer);
  stage.addEventListener('dblclick', e => {
    if (e.target.closest('button,.library-panel,.info-panel')) return;
    const p = point(e); if (zoom > 1.01) fit(); else magnify(Math.max(2, stage.clientWidth / baseWidth), p.x, p.y);
  });
  stage.addEventListener('wheel', e => {
    if (e.target.closest('.library-panel,.info-panel')) { e.stopPropagation(); return; }
    e.preventDefault();
    if (e.ctrlKey || zoom <= 1.01) {
      const p = point(e); magnify(zoom * Math.exp(-e.deltaY * .005), p.x, p.y);
    } else { panX -= e.deltaX; panY -= e.deltaY; paint(); }
  }, { passive: false });
  viewer.addEventListener('wheel', e => { if (!e.target.closest('.library-panel,.info-panel')) e.preventDefault(); }, { passive: false });
  if (standalone) { open(); loadCollections().then(showLibrary); }
  chrome.runtime.onMessage.addListener((message, sender, respond) => {
    if (message.type === 'PINTEREST_SLIDER_OPEN') { open(); respond({ ok: true }); }
  });
})();
