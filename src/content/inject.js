import constants from "../popup/constants";

if (location.host.indexOf('facebook.com') < 0) {
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
    var evt = document.createEvent("CustomEvent");
    evt.initCustomEvent("uizaExtInitCss", true, true, '');
    document.dispatchEvent(evt);
  };

  script2.onload = function () {
    var evt = document.createEvent("CustomEvent");
    chrome.extension.sendMessage({
      type: 'UIZA_GET_SETTINGS',
      key: constants.SETTINGS_KEY
    }, function (result) {
      var settings = JSON.parse(result);
      if (settings && settings.custom_css) {
        evt.initCustomEvent("uizaExtInitCss", true, true, settings.custom_css);
        document.dispatchEvent(evt);
        console.log('s1111');
      } else {
        console.log('not custom css');
      }
    });
  }

  chrome.runtime.onMessage.addListener(
    function (request, sender, sendRespond) {
      if (request.UIZA_EXT_PLAYER) {
        console.log('receive event', request.UIZA_EXT_PLAYER);
        var evt = document.createEvent("CustomEvent");
        evt.initCustomEvent("uizaExtPlayerChanged", true, true, request.UIZA_EXT_PLAYER);
        document.dispatchEvent(evt);
      }
    }
  );

  document.addEventListener("uiza-ext-request-pip", function (data) {
    chrome.runtime.sendMessage({
      UIZA_EXT_REQUEST_PIP: true
    }, function (resp) {
      console.log(resp);
    })
  });

  document.addEventListener("uiza-ext-exit-pip", function (data) {
    chrome.runtime.sendMessage({
      UIZA_EXT_REQUEST_PIP: false
    }, function (resp) {
      console.log(resp);
    })
  });
  // eslint-disable-next-line eol-last
} else {
  // alert('facebook');
  // eslint-disable-next-line eol-last
}