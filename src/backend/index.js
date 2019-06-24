chrome.webRequest.onHeadersReceived.addListener(details => {
    if (details.responseHeaders.filter(x => x.name === 'x-fb-debug').length <= 0) {
        for (var i = 0; i < details.responseHeaders.length; i++) {
            var header = details.responseHeaders[i];
            if (['x-content-security-policy', 'content-security-policy', 'x-webkit-csp'].indexOf(header.name.toLowerCase()) > -1) {
                header.value = "default-src * 'unsafe-inline' 'unsafe-eval'; script-src * 'unsafe-inline' 'unsafe-eval'; connect-src * 'unsafe-inline'; img-src * data: blob: 'unsafe-inline'; frame-src *; style-src * 'unsafe-inline';";
            }
        };
    }

    return {
        responseHeaders: details.responseHeaders
    };
}, {
    urls: ["*://*/*"]
    // urls: ["*://facebook.com/*", "*://*.atlassian.com/*"]
}, ['blocking', 'responseHeaders']);

// Not used
// chrome.webRequest.onBeforeRequest.addListener(
//     function (details) {
//         return {
//             redirectUrl: chrome.runtime.getURL("uiza.iframe-api.js")
//         };
//     }, {
//         urls: [
//             "https://sdk.uiza.io/iframe_api.js"
//         ],
//         types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
//     },
//     ["blocking"]
// );

chrome.extension.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.type === 'UIZA_GET_SETTINGS') {
        var result = localStorage.getItem(message.key);
        sendResponse(result);
    }
});

chrome.runtime.onMessage.addListener(
    function (request, sender, sendRespond) {
        if (request.UIZA_EXT_REQUEST_PIP) {
            console.log('receive event', request.UIZA_EXT_REQUEST_PIP, request.UIZA_EXT_REQUEST_PIP_FRAME_ID);
            chrome.tabs.executeScript({
                code: `
        (async () => {
            const videos = Array.from(document.querySelectorAll('video'))
            .filter(video => video.readyState != 0)
            .filter(video => video.disablePictureInPicture == false)
            .sort((v1, v2) => {
                const v1Rect = v1.getClientRects()[0];
                const v2Rect = v2.getClientRects()[0];
                return ((v2Rect.width * v2Rect.height) - (v1Rect.width * v1Rect.height));
            });

            if (videos.length === 0)
            return;

            const video = videos[0];

            if (!video.hasAttribute('__pip__')) {
                try {
                    if (video !== document.pictureInPictureElement) {
                        // await document.exitPictureInPicture();
                    }
                } catch {}
                await video.requestPictureInPicture();
                video.setAttribute('__pip__', true);
                video.addEventListener('leavepictureinpicture', event => {
                    video.removeAttribute('__pip__');
                }, { once: true });
            }
        })();
        `,
                allFrames: true,
                frameId: request.UIZA_EXT_REQUEST_PIP_FRAME_ID || 0
            });
        } else if (request.UIZA_EXT_REQUEST_PIP === false) {
            chrome.tabs.executeScript({
                code: `
        (async () => {
            const videos = Array.from(document.querySelectorAll('video'))
            .filter(video => video.readyState != 0)
            .filter(video => video.disablePictureInPicture == false)
            .sort((v1, v2) => {
                const v1Rect = v1.getClientRects()[0];
                const v2Rect = v2.getClientRects()[0];
                return ((v2Rect.width * v2Rect.height) - (v1Rect.width * v1Rect.height));
            });

            if (videos.length === 0)
            return;

            const video = videos[0];

            if (video.hasAttribute('__pip__')) {
                await document.exitPictureInPicture();
            }
        })();
        `,
                allFrames: true,
                frameId: request.UIZA_EXT_REQUEST_PIP_FRAME_ID || 0
            });
        }
        sendRespond({
            ok: true
        })
    }
    // eslint-disable-next-line eol-last
);