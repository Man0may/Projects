console.log("Chrome Extension Go!");

window.addEventListener('mouseup', wordSelected);

var selectedText;

function wordSelected() {
  console.log("wordSelected");
  selectedText = window.getSelection().toString().trim();
}

chrome.runtime.onMessage.addListener(gotMsg);

function gotMsg(message, sender, sendResponse) {
  console.log("gotMsg");
  let ms = selectedText;
  sendResponse({sent: ms});
}


