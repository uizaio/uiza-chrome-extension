window.$ = window.jQuery = require("jquery");

let jq162 = window.jQuery.noConflict(true);

(function ($) {
  var GetInsertionCSS = function (playerholderimage) {
    return (
      ".reserved-drop-marker { height: 3px; background: red; position: relative; }.uiza-player-holder { background: url(" +
      playerholderimage +
      "); background-size: cover; }" +
      ".uiza-ext-player { position: absolute; top: 0; left: 0; right: 0; bottom: 0; }" +
      "@supports (--custom:property){[style*='--aspect-ratio']{position:relative}[style*='--aspect-ratio']::before{content:'';display:block;padding-bottom:calc(100% / (var(--aspect-ratio)))}[style*='--aspect-ratio']>:first-child{position:absolute;top:0;left:0;height:100%}}"
    );
  };

  document.addEventListener("uizaExtInitCss", function (e) {
    var url = e.detail;
    console.log("received " + url);
    var style = $("<style uiza-data-reserved-styletag></style>").html(
      GetInsertionCSS(url)
    );
    $(document.head).append(style);
  });

  $(document)
    .find("body,html")
    .on("dragenter", function (event) {
      event.stopPropagation();
    })
    .find("*")
    .on("dragenter", function (event) {
      event.preventDefault();
      event.stopPropagation();
      console.log("Drag Enter");
    })
    .on("dragover", function (event) {
      event.preventDefault();
      event.stopPropagation();
      if (new Date().getTime() % 100 === 0) {
        $(document)
          .find(".reserved-drop-marker")
          .remove();
        $(event.target).append(
          "<div class='reserved-drop-marker disabled-uiza-player-holder' style='--disabled-aspect-ratio:100/64;'><div id='uiza-ext-player'></div></div>"
        );
        // console.log("Drag Over", event.target);
      }
    });

  $(document)
    .find("body,html")
    .on("drop", function (event) {
      event.preventDefault();
      event.stopPropagation();
      console.log(event.originalEvent.dataTransfer.getData('text/plain'));
      const eventData = JSON.parse(event.originalEvent.dataTransfer.getData('text/plain'));
      $('.reserved-drop-marker').removeClass('reserved-drop-marker');
      window.UZ.Player.init(
        "#uiza-ext-player", {
          // api: btoa("uap-fb9065202ed64111b6f2e544a0c113a9-8cb63884"),
          // appId: "fb9065202ed64111b6f2e544a0c113a9",
          // playerVersion: 4,
          // entityId: "7631a97a-47f6-4786-a22f-ddf6d9fe22c3",
          api: btoa(eventData.api_key),
          appId: eventData.app_id,
          playerVersion: 4,
          entityId: eventData.item_id,
          width: eventData.width,
          height: eventData.height
        },
        function (player) {
          // 4. You can add logo at here
          // 5. You can add event listeners at here
          player.on("play", function () {
            console.log("play");
          });
          player.on("pause", function () {
            console.log("pause");
          });
        }
      );
    });
  // eslint-disable-next-line eol-last
})(jq162);