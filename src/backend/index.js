console.log('background !')
chrome.webRequest.onHeadersReceived.addListener(details => {
    for (var i = 0; i < details.responseHeaders.length; i++) {
        var header = details.responseHeaders[i];
        if (['x-content-security-policy', 'content-security-policy', 'x-webkit-csp'].indexOf(header.name.toLowerCase()) > -1) {
            // details.responseHeaders.splice(i, 1);
            console.log({...header});
            header.value = "default-src * 'unsafe-inline' 'unsafe-eval'; script-src * 'unsafe-inline' 'unsafe-eval'; connect-src * 'unsafe-inline'; img-src * data: blob: 'unsafe-inline'; frame-src *; style-src * 'unsafe-inline';";
        }
    };

    return {
        responseHeaders: details.responseHeaders
    };
}, {urls: ["*://*/*"]}, ['blocking', 'responseHeaders']);
