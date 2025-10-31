const startBtn = document.getElementById("start-btn");
const stopBtn = document.getElementById("stop-btn");
const downloadBtn = document.getElementById("download-btn");
const discardBtn = document.getElementById("discard-btn");

const selectedFormat = document.getElementById('format-select')

startBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "start-recording", format: selectedFormat.value });
  startBtn.disabled = true;
  stopBtn.disabled = false;
});

stopBtn.addEventListener("click", () => {
  startBtn.disabled = true;
  stopBtn.disabled = true;

  document.getElementById("save-section").style.display = "block";

  downloadBtn.disabled = false;
});

downloadBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage({
    type: "stop-recording",
    data: document.getElementById("filename").value,
  });
    startBtn.disabled = true;
  stopBtn.disabled = false;
});

discardBtn.addEventListener("click", () => {
  document.getElementById("save-section").style.display = "none";
  downloadBtn.disabled = true;
  chrome.runtime.sendMessage({ type: "delete-recording" });
    startBtn.disabled = true;
  stopBtn.disabled = false;
});

