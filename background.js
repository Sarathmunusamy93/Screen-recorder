const OFFSCREEN_DOCUMENT_PATH = 'offscreen.html';

let filename= 'screen-recording.webm';

async function createOffscreen() {
  await chrome.offscreen.createDocument({
    url: OFFSCREEN_DOCUMENT_PATH,
    reasons: ['USER_MEDIA'],
    justification: 'Recording screen and audio'
  }).catch(() => {});
}

async function closeOffscreen() {
  const offscreenUrl = chrome.runtime.getURL(OFFSCREEN_DOCUMENT_PATH);
  if (await chrome.runtime.getContexts({
      contextTypes: ['OFFSCREEN_DOCUMENT'],
      documentUrls: [offscreenUrl]
    }).length > 0) {
    await chrome.offscreen.closeDocument();
  }
}

chrome.runtime.onMessage.addListener(async (message) => {
  if (message.type === 'start-recording') {
    await createOffscreen();
    chrome.runtime.sendMessage({ type: 'start-recording', target: 'offscreen', format: message.format });
  } else if (message.type === 'stop-recording') {
    filename =message.data + ".webm";
    chrome.runtime.sendMessage({ type: 'stop-recording', target: 'offscreen' });
  } else if ( message.type === 'delete-recording') {
  }
  else if (message.type === 'recording-stopped') {
    await closeOffscreen();
  } else if (message.type === 'download-recording') {
    chrome.downloads.download({
      url: message.data,
      filename: filename
    }, (downloadId) => {
      if (chrome.runtime.lastError) {
        console.error('Download failed:', chrome.runtime.lastError);
      }
    });
  }
});
