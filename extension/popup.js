document.querySelector('#open').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  try {
    await chrome.tabs.sendMessage(tab.id, { type: 'PINTEREST_SLIDER_OPEN' });
    window.close();
  } catch {
    document.querySelector('#status').textContent = 'Open a supported website. If it is already open, reload the page after updating the extension.';
  }
});
document.querySelector('#library').addEventListener('click', () => {
  chrome.tabs.create({ url: chrome.runtime.getURL('library.html') });
  window.close();
});
