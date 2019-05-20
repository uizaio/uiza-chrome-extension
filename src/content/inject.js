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
  console.log('script loaded');
  var url = chrome.runtime.getURL("icons/playerholder.png");

  var evt = document.createEvent("CustomEvent");
  evt.initCustomEvent("uizaExtInitCss", true, true, url);
  document.dispatchEvent(evt);
  console.log('dispatched event')
  // eslint-disable-next-line eol-last
};