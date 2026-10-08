const KEY = 'pinterestSliderCollections';
let queue = Promise.resolve();
chrome.runtime.onMessage.addListener((message, sender, respond) => {
  if (message.type !== 'SLIDER_COLLECTIONS') return;
  const run = async () => {
    const stored = await chrome.storage.local.get(KEY);
    const collections = stored[KEY] || [];
    const collection = collections.find(c => c.id === message.id);
    const name = String(message.name || '').trim().slice(0, 100);
    switch (message.action) {
      case 'get': return { collections };
      case 'create':
        if (!name) throw new Error('Enter a collection name.');
        collections.push({ id: crypto.randomUUID(), name, pins: [], createdAt: Date.now() });
        break;
      case 'rename':
        if (!collection || !name) throw new Error('Collection not found or name is empty.');
        collection.name = name;
        break;
      case 'save': {
        if (!collection) throw new Error('Choose an existing collection.');
        const pin = message.pin;
        if (!pin || !/^\d+$/.test(pin.id) || !/^https:\/\/i\.pinimg\.com\//.test(pin.src)) throw new Error('Could not save this pin.');
        // Keep only image metadata; never persist page markup or cookies.
        if (!collection.pins.some(p => p.id === pin.id)) collection.pins.push({
          id: pin.id, src: pin.src, title: String(pin.title || '').slice(0, 1000),
          url: `https://www.pinterest.com/pin/${pin.id}/`, savedAt: Date.now(),
          description: String(pin.description || '').slice(0, 10000),
          source: /^https?:\/\//.test(pin.source || '') ? pin.source : '',
          metadataLoaded: !!pin.metadataLoaded
        });
        break;
      }
      case 'remove':
        if (!collection) throw new Error('Collection not found.');
        collection.pins = collection.pins.filter(p => p.id !== message.pinId);
        break;
      case 'metadata':
        for (const c of collections) {
          const saved = c.pins.find(p => p.id === message.pin?.id);
          if (saved) Object.assign(saved, {
            title: String(message.pin.title || saved.title).slice(0, 1000),
            description: String(message.pin.description || '').slice(0, 10000),
            source: /^https?:\/\//.test(message.pin.source || '') ? message.pin.source : '', metadataLoaded: true
          });
        }
        break;
      case 'delete': {
        const index = collections.findIndex(c => c.id === message.id);
        if (index >= 0) collections.splice(index, 1);
        break;
      }
      default: throw new Error('Unknown action.');
    }
    await chrome.storage.local.set({ [KEY]: collections });
    return { collections };
  };
  // Serialize edits from different tabs to prevent lost saves.
  const result = queue.then(run);
  queue = result.catch(() => {});
  result.then(respond, error => respond({ error: error.message }));
  return true;
});
