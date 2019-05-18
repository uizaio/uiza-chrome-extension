console.log('content-script! 2222')

chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
    if (request.uiza === "mousemove") {
      console.log('received mousemove event')
      sendResponse(
        {
          farewell: JSON.stringify([100, 200])
        }
      )
    }
  }
)
