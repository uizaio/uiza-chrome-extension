/* eslint-disable no-new */
import Vue from "vue";
import Player from "./components/Player.vue";
import PlayerHolder from './components/PlayerHolder.vue';
import "@fortawesome/fontawesome-free/js/all.js";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// import 'csshake/dist/csshake.css';
import 'animate.css';
import VueAnime from "vue-animejs";
// eslint-disable-next-line no-unused-vars
import _ from 'lodash';

Vue.use(ElementUI);
Vue.use(VueAnime);
Vue.use(require('vue-moment'));

// eslint-disable-next-line import/no-webpack-loader-syntax
const jsonData = require("./data.json");

Vue.component('uiza-ext-player-holder', PlayerHolder);
Vue.component("uiza-ext-player", Player);
window.$ = window.jQuery = require("jquery");

var jq162 = window.jQuery.noConflict(true);

(function ($) {
  var increasedId = 0;
  var isDragging = false;

  var developmentMockup = function () {
    if (self !== top) return;
    // eslint-disable-next-line no-constant-condition
    if (window.location.hostname !== "127.0.0.1" || false) return;
    var eventData = {
      playerParams: {
        api: "dWFwLWZiOTA2NTIwMmVkNjQxMTFiNmYyZTU0NGEwYzExM2E5LThjYjYzODg0",
        appId: "fb9065202ed64111b6f2e544a0c113a9",
        controls: false,
        entityId: "7631a97a-47f6-4786-a22f-ddf6d9fe22c3",
        height: "375px",
        playerVersion: 4,
        width: "575px"
      },
      playerSettings: {
        width: "500px",
        height: "300px",
        color: "#FF0000",
        brand_logo: "https://storage.googleapis.com/shopdunk-images/tintucshopdunknew/2018/05/tai-sao-logo-hang-Apple-la-trai-tao-do-2.png",
        brand_url: "https://apple.com",
        cart_url: "https://apple.com",
        ads: []
      }
    };
    // live
    // eventData = _.merge({
    //   playerParams: {
    //     feedId: 'afef9b62-3fb2-4c7f-9c06-470c9f3d357f',
    //     entityId: '4adbe50e-b3c2-46cc-999a-a94a13b744a3',
    //     streamName: 'fd87567a-caa9-41af-ac96-d54a8126118d'
    //   }
    // }, eventData);
    var increasedId = "test";
    var playerId = "#uiza-ext-player" + increasedId;
    var div = $("<div id='uiza-ext-player" + increasedId + "'></div>")
      .css("width", eventData.playerParams.width)
      .css("height", eventData.playerParams.height);
    // eslint-disable-next-line no-constant-condition
    if (eventData.playerParams.feedId || true) {
      div.append("<uiza-ext-player-holder></uiza-ext-player-holder>");
    } else {
      div.append("<uiza-ext-player></uiza-ext-player>");
    }
    $("body").prepend(div);
    new Vue({
      el: playerId,
      data: {
        id: playerId,
        data: eventData,
        jsonData: jsonData
      }
    });
  };

  $(document).ready(function () {
    console.log("json", jsonData);
    developmentMockup();
  });

  var GetInsertionCSS = function () {
    return `
    .reserved-drop-target {
      border: red 1px solid! important;
    }
    .reserved-drop-marker {
      position: relative;
    }
    .uiza-player-holder {}
    `;
  };

  var style = $("<style type='text/css' id='uiza-style' />").text(
    GetInsertionCSS("")
  );
  $("head").append(style);

  $(document)
    .find("body,html")
    .on("dragenter", function (event) {
      event.stopPropagation();
    })
    .find("*")
    .on("dragenter", function (event) {
      event.preventDefault();
      event.stopPropagation();
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
        $(".reserved-drop-target").removeClass("reserved-drop-target");
        $(event.target).addClass("reserved-drop-target");
        $(event.target).append(
          `<div class='reserved-drop-marker disabled-uiza-player-holder'>
            <div id='uiza-ext-player${increasedId}'>
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

      var eventData = JSON.parse(
        event.originalEvent.dataTransfer.getData("text/plain")
      );
      $(".reserved-drop-marker").removeClass("reserved-drop-marker");
      $(".reserved-drop-target").removeClass("reserved-drop-target");

      var playerId = "#uiza-ext-player" + increasedId;
      // eslint-disable-next-line no-constant-condition
      if (eventData.playerParams.feedId || true) {
        $(playerId).parent().parent().replaceWith("<div id='uiza-ext-player" + increasedId + "'></div>");
        $(playerId).append("<uiza-ext-player-holder></uiza-ext-player-holder>");
      } else {
        $(playerId).append("<uiza-ext-player></uiza-ext-player>");
      }
      console.log('event data', eventData);
      eventData.playerSettings.width = '100%';
      eventData.playerParams.width = '100%';
      // eventData.playerParams.controls = true;
      new Vue({
        el: playerId + ", .el-dialog__wrapper",
        data: {
          id: playerId,
          data: eventData,
          jsonData: jsonData
        }
      });
      increasedId += 1;
    });
  // eslint-disable-next-line eol-last
})(jq162);