// inject Uiza Player SDKv
var scriptUrl = 'https://sdk.uiza.io/uizaplayer.js';
var script = document.createElement("script");
script.setAttribute("type", "text/javascript");
script.setAttribute("src", scriptUrl);
document.body.appendChild(script);

// inject content script
scriptUrl = chrome.extension.getURL("js/content.js");
var script2 = document.createElement("script");
script2.setAttribute("type", "text/javascript");
script2.setAttribute("src", scriptUrl);
document.body.appendChild(script2);

script.onload = function () {
  var url = chrome.runtime.getURL("icons/playerholder.png");
  var evt = document.createEvent("CustomEvent");
  evt.initCustomEvent("uizaExtInitCss", true, true, url);
  document.dispatchEvent(evt);
  // eslint-disable-next-line eol-last
};

chrome.runtime.onMessage.addListener(
  function(request, sender, sendRespond) {
    if (request.UIZA_EXT_PLAYER) {
      console.log('receive event', request.UIZA_EXT_PLAYER);
      var evt = document.createEvent("CustomEvent");
      evt.initCustomEvent("uizaExtPlayerChanged", true, true, request.UIZA_EXT_PLAYER);
      document.dispatchEvent(evt);
    }
  }
);

document.addEventListener("uiza-ext-request-pip", function(data) {
  chrome.runtime.sendMessage({ UIZA_EXT_REQUEST_PIP: true }, function(resp) {
    console.log(resp);
  })
});

document.addEventListener("uiza-ext-exit-pip", function(data) {
  chrome.runtime.sendMessage({ UIZA_EXT_REQUEST_PIP: false }, function(resp) {
    console.log(resp);
  })
});
