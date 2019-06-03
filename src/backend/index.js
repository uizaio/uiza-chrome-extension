chrome.webRequest.onHeadersReceived.addListener(details => {
    for (var i = 0; i < details.responseHeaders.length; i++) {
        var header = details.responseHeaders[i];
        if (['x-content-security-policy', 'content-security-policy', 'x-webkit-csp'].indexOf(header.name.toLowerCase()) > -1) {
            header.value = "default-src * 'unsafe-inline' 'unsafe-eval'; script-src * 'unsafe-inline' 'unsafe-eval'; connect-src * 'unsafe-inline'; img-src * data: blob: 'unsafe-inline'; frame-src *; style-src * 'unsafe-inline';";
        }
    };

    return {
        responseHeaders: details.responseHeaders
    };
}, {urls: ["*://*/*"]}, ['blocking', 'responseHeaders']);

chrome.runtime.onMessage.addListener(
    function(request, sender, sendRespond) {
      if (request.UIZA_EXT_REQUEST_PIP) {
        console.log('receive event', request.UIZA_EXT_REQUEST_PIP);
        chrome.tabs.executeScript({ code: `
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
                await video.requestPictureInPicture();
                video.setAttribute('__pip__', true);
                video.addEventListener('leavepictureinpicture', event => {
                    video.removeAttribute('__pip__');
                }, { once: true });
            }
        })();
        `,
        allFrames: true });
        sendRespond({ ok: true })
      } else if (request.UIZA_EXT_REQUEST_PIP === false) {
        chrome.tabs.executeScript({ code: `
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
        allFrames: true });
      }
    }
);
