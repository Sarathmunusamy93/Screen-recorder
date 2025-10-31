let mediaRecorder;
const recordedChunks = [];
let videoType = 'video/webm';
chrome.runtime.onMessage.addListener(async (message) => {
  if (message.target !== 'offscreen') {
    return;
  }

  if (message.type === 'start-recording') {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true // Corrected constraint: Request audio with a simple boolean
      });

      const videoType = 'video/' + message.format;
      
      mediaRecorder = new MediaRecorder(stream, { mimeType: videoType });
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.push(event.data);
        }
      };
mediaRecorder.onstop = async () => {
  const blob = new Blob(recordedChunks, { type: videoType });
  
  // Convert blob to base64
  const reader = new FileReader();
  reader.readAsDataURL(blob);
  reader.onloadend = () => {
    const base64data = reader.result;
    
    // Send data to background script to handle download
    chrome.runtime.sendMessage({
      type: 'download-recording',
      data: base64data
    });
    
    // Stop the stream and clean up
    stream.getTracks().forEach(track => track.stop());
    chrome.runtime.sendMessage({ type: 'recording-stopped' });
  };
};


      mediaRecorder.start();
    } catch (error) {
      console.error('Error starting recording:', error);
      chrome.runtime.sendMessage({ type: 'recording-stopped', error: error.name });
    }

  } else if (message.type === 'stop-recording') {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
  }
});
