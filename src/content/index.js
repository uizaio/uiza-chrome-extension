window.$ = window.jQuery = require("jquery");

let jq162 = window.jQuery.noConflict(true);

(function ($) {
  var increasedId = 0;
  var isDragging = false;
  var GetInsertionCSS = function (playerholderimage) {
    return (
      ".reserved-drop-target { border: red 1px solid !important; }" +
      ".reserved-drop-marker { position: relative; }.uiza-player-holder { background: url(" +
      playerholderimage +
      "); background-size: cover; }" +
      ".uiza-ext-player { position: absolute; top: 0; left: 0; right: 0; bottom: 0; }"
    );
  };

  // document.addEventListener("uizaExtInitCss", function (e) {
  //   var url = e.detail;
  //   var style = $("<style type='text/css' id='uiza-style' />").text(
  //     GetInsertionCSS(url)
  //   );
  //   $('head').append(style);
  // });

  var style = $("<style type='text/css' id='uiza-style' />").text(
    GetInsertionCSS('')
  );
  $('head').append(style);

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
      if (isDragging) {
        return;
      } else {
        isDragging = true;
      }
      if (new Date().getTime() % 1 === 0) {
        $(".reserved-drop-marker").remove();
        $(".reserved-drop-target").removeClass('reserved-drop-target');
        $(event.target).addClass('reserved-drop-target');
        $(event.target).append(
          "<div class='reserved-drop-marker disabled-uiza-player-holder'><div id='uiza-ext-player" + increasedId + "'></div></div>"
        );
        // console.log("Drag Over", event.target);
      }
      isDragging = false;
    });

  $(document)
    .find("body,html")
    .on("drop", function (event) {
      event.preventDefault();
      event.stopPropagation();
      
      const eventData = JSON.parse(event.originalEvent.dataTransfer.getData('text/plain'));
      $('.reserved-drop-marker').removeClass('reserved-drop-marker');
      $('.reserved-drop-target').removeClass('reserved-drop-target');
      window.UZ.Player.init(
        "#uiza-ext-player" + increasedId, eventData.playerParams,
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
      // update new id for the next drop
      increasedId += 1;
    });
  // eslint-disable-next-line eol-last
})(jq162);