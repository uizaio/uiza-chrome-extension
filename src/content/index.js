window.$ = window.jQuery = require("jquery");

let jq162 = window.jQuery.noConflict(true);

(function ($) {
  var increasedId = 0;
  var isDragging = false;
  var GetInsertionCSS = function (playerholderimage) {
    // return (
    //   ".reserved-drop-target { border: red 1px solid !important; }" +
    //   ".reserved-drop-marker { position: relative; }.uiza-player-holder {}" +
    //   ".uiza-ext-player { position: relative; }" +
    //   ".uiza-product-overlay { position: absolute; top: 60px; left: 30px; max-width: 140px; }.uiza-product-overlay-image { width: 140px; height: 200px;} .uiza-product-overlay-image img { object-fit: cover; width: 100%; height: 100% }"
    // );
    return `
    .reserved-drop-target {
      border: red 1px solid! important;
    }
    .reserved-drop-marker {
      position: relative;
    }
    .uiza-player-holder {}
    .uiza-ext-player {
      position: relative;
    }
    .uiza-hiddable {
      display: none;
    }
    .uiza-product-overlay {
      transform: scale(1);
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      position: absolute;
      top: 60px;
      right: 30px;
      width: 240px;
      padding: 10px;
      border-radius: 10px;
      background: rgba(255, 255, 255, .2);
      color: #FFF;
      overflow: hidden
    }

    .uiza-product-overlay-image {
      width: 50px;
      height: 70px;
      float: left;
    }

    .uiza-product-overlay-image img {
      object-fit: cover;
      width: 100%;
      height: 100%
    }

    .uiza-product-overlay-wrapper {
      padding-left: 60px;
    }

    .uiza-product-overlay-name {
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 10px;
    }

    .uiza-product-overlay-cart {
      background: orange;
      color: #FFF;
      font-weight: 600;
      font-size: 13px;
      text-align: center;
      border-radius: 4px;
      display: inline-block;
      padding: 4px 10px;
      text-decoration: none;
    }

    .uiza-controls {
      position: absolute;
      bottom: 55px;
      left: 0;
      right: 0;
      /*display: flex;*/
    }

    .uiza-controls>div {
      flex: 0 0 auto;
      margin: 0 10px;
    }

    .uiza-controls>div>a {
      cursor: pointer;
    }

    .uiza-controls>div>a>i {
      line-height: 30px;
      font-size: 20px;
      color: #FFF;
    }

    .uiza-controls>div>a:hover>i {
      color: yellow !important;
    }

    .uiza-controls-shopping-spacer {
      flex: 1 !important;
    }

    .uiza-controls-shopping-chat-input {
      flex: 0 0 50%;
      display: flex;
    }

    .uiza-controls-shopping-chat-input input {
      flex: 1;
      border-radius: 10px;
      padding: 5px 10px;
      border: rgba(255, 255, 255, .4) 1px solid;
      outline: none !important;
      color: #FFF;
      background: rgba(255, 255, 255, .2)
    }

    .uiza-product-list {
      /* position: absolute;
      bottom: 50px;
      left: 0;
      right: 0; */
      height: 140px;
      background: rgba(255, 255, 255, .2);
    }

    .uiza-product-list-swiper {
      width: 100%;
      height: auto;
      margin-left: auto;
      margin-right: auto;
    }

    .uiza-product-list-item {
      width: 100px;
      height: 140px;
      padding: 5px;
      margin: 10px;
      background: yellow;
      position: relative;
    }

    .uiza-product-list-item img {
      height: 100%;
      width: 100%;
      object-fit: cover;
    }

    .uiza-product-list-item h4 {
      position: absolute;
      bottom: 10px;
      left: 0;
      right: 0;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }`
  };

  var style = $("<style type='text/css' id='uiza-style' />").text(
    GetInsertionCSS('')
  );
  $('head').append(style);

  const product = {
    name: 'Áo khoác Unisex kiểu dáng sơ mi caro không nón ',
    photo: 'https://vn-test-11.slatic.net/p/41ae5761df99aa47847944aae9682b49.jpg_200x200Q100.jpg_.webp',
    desc: 'ÁO khoác unisex kiểu dáng sơ mi sọc caro sẽ là điểm đáng tự hào được sáng tạo độc quyền.'
  }

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
          `<div class='reserved-drop-marker disabled-uiza-player-holder'>
            <div id='uiza-ext-player${increasedId}' class="uiza-ext-player">
            </div>
          </div>`
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

      const playerElements = `
      <div class="uiza-product-overlay uiza-hiddable">
        <div class="uiza-product-overlay-image">
          <img src="${product.photo}" />
        </div>
        <div class="uiza-product-overlay-wrapper">
          <div class="uiza-product-overlay-name">${product.name}</div>
          <div class="">
            <a href="#" class="uiza-product-overlay-cart">Add to cart</a>
          </div>
        </div>
      </div>
      <div class="uiza-controls uiza-hiddable">
        <div class="uiza-controls-shopping-bag"><a href="#"><i class="fas fa-shopping-bag"></i></a></div>
        <div class="uiza-controls-shopping-chat-input">
          <input type="text" placeholder="Enter your message" />
        </div>
        <div class="uiza-controls-shopping-spacer"></div>
        <div class="uiza-controls-shopping-cart"><a href="#"><i class="fas fa-shopping-cart"></i></a></div>
        <div class="uiza-controls-shopping-share"><a href="#"><i class="fas fa-share-alt"></i></a></div>
        <div class="uiza-controls-shopping-emotion"><a href="#"><i class="far fa-kiss-wink-heart"></i></a></div>
      </div>`;

      $('#uiza-ext-player' + increasedId)
        .css('width', eventData.playerParams.width)
        .css('height', eventData.playerParams.height);

      if (eventData.playerParams.feedId) {
        $('#uiza-ext-player' + increasedId)
          .append(playerElements)
      }

      window.UZ.Player.init(
        "#uiza-ext-player" + increasedId, eventData.playerParams,
        function (player) {
          // 4. You can add logo at here
          // 5. You can add event listeners at here
          player.on("play", function () {
            $('.uiza-hiddable').show();
          });
          player.on("pause", function () {
            $('.uiza-hiddable').hide();
          });
        }
      );
      // update new id for the next drop
      increasedId += 1;
    });
  // eslint-disable-next-line eol-last
})(jq162);