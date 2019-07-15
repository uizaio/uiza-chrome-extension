<template lang="pug">
div
  .block.scaler(v-if="settings.responsive")
    span Adjust zoom
    el-slider(v-model="scaleRatio")
  div(:style="{ transform: 'scale(' + scaleRatio / 100 + ')' }" :class="['uiza-page-' + settings.current_theme, { 'uiza-screen-small' : settings.responsive }]")
    el-menu(mode="horizontal" class="header")
      el-menu-item
        a(:href="playerSettings.brand_url")
          //- img(class="logo" :src="playerSettings.brand_logo")
          img.logo(:src="settings.page_logo")
      el-menu-item.uiza-toolbar(style="float: right")
        img(src="https://www.upsieutoc.com/images/2019/07/15/top-badge.png")
        img(src="https://www.upsieutoc.com/images/2019/07/15/top-settings.png")
        div.input
          input(type="text" placeholder="Search")
          i.fas.fa-search
    el-row(class="main-area" type="flex")
      el-col.side-menu(:span="4")
        h4 Sản phẩm liên quan
        div.banner(v-for="(banner, i) in settings.left_banners" v-bind:key="i")
          img(:src="banner")
      el-col.player(:span="16")
        div.player-wrapper(ref="mainWrapper")
          //- div(id="player")
          UizaPlayer(:theme="settings.current_theme" :portrait="settings.responsive" v-if="vod || live" :params="playerParams" :settings="playerSettings" :chromeUrl="chromeUrl" :json="jsonData" id="player")
      el-col.side-menu(:span="4")
        h4 Sản phẩm liên quan
        div.banner(v-for="(banner, i) in settings.right_banners" v-bind:key="i")
          img(:src="banner")
    div(class="mobile-slider")
      h2 Related products
      carousel(:paginationEnabled="false"  :navigationEnabled="false" :perPage="2")
        slide.banner(v-for="(banner, i) in settings.left_banners" v-bind:key="i")
            img(:src="banner")
        slide.banner(v-for="(banner, i) in settings.right_banners" v-bind:key="banner")
            img(:src="banner")
    div(class="mobile-recommendation recommendation")
      h2 Recommended for you
      el-row
        el-col(:span="12" v-for="item in recommendedItems" v-bind:key="item.id" class="recommendation-item")
          div(class="item-play")
            div(class="item-play-btn" @click="view(item)")
              img(src="https://www.upsieutoc.com/images/2019/07/07/play-button.png")
            GifPlayer(:src='item.thumbnail || "https://2.bp.blogspot.com/-LaFuqxk9jag/Vwcx0NIk8jI/AAAAAAAAJBo/-u9AvpBVosU-lJZCoG6fKT23czNx1KKEg/s1600/hee.gif"')
          .desc
            h4 {{ item.name }}
    div(class="web-recommendation" style="margin: 0 10px")
      h2 RECOMMENDED FOR YOU
      el-card.recommendation
        carousel(:paginationEnabled="false"  :navigationEnabled="true" navigationNextLabel="<i class='fas fa-chevron-right'></i>" navigationPrevLabel="<i class='fas fa-chevron-left'></i>" :perPage="7")
          slide(v-for="item in recommendedItems" v-bind:key="item.id")
            div(class="item-play")
              div(class="item-play-btn" @click="view(item)")
                img(src="https://www.upsieutoc.com/images/2019/07/07/play-button.png")
              GifPlayer(:src='item.thumbnail || "https://2.bp.blogspot.com/-LaFuqxk9jag/Vwcx0NIk8jI/AAAAAAAAJBo/-u9AvpBVosU-lJZCoG6fKT23czNx1KKEg/s1600/hee.gif"')
            .desc
              h4 {{ item.name }}
    div.bottom-banners
      img(v-for="(banner, i) in settings.bottom_banners" v-bind:key="i" :src="banner")
</template>
<script>
import _ from "lodash";
import { Carousel, Slide } from "vue-carousel";
import { mapFields } from "vuex-map-fields";
import storage from "../../ext/storage";
import constants from "../constants";
import uiza from "../services/uiza";
import UizaPlayer from "../../content/components/Player";
import GifPlayer from "./GifPlayer";
// eslint-disable-next-line no-unused-vars
import { enablePiP, disablePiP } from "../../backend/functions";
import EventBus from "../../content/EventBus";
const jsonData = require("../../content/data.json");

export default {
  components: {
    Carousel,
    Slide,
    UizaPlayer,
    GifPlayer
  },
  created() {
    EventBus.$on(
      "onTogglePIP",
      function(val) {
        this.isPiP = val;
      }.bind(this)
    );
  },
  mounted() {
    const self = this;
    const settings = storage.get(constants.SETTINGS_KEY);
    if (settings) {
      this.settings = _.assign(this.settings, settings);
    }
    const playerSettings = storage.get(constants.PLAYER_SETTINGS_KEY);
    if (playerSettings) {
      this.playerSettings = _.assign(this.playerSettings, playerSettings);
    }
    if (this.$route.params.type === "vod") {
      uiza.getSingleVOD(this.$route.params.id).then(resp => {
        this.vod = resp.data;
        document.title = resp.data.name;
        // this.initPlayer();
      });
    } else {
      uiza.getLive(this.$route.params.id).then(resp => {
        this.live = resp.data;
        document.title = resp.data.name;
        // this.initPlayer();
      });
    }
    this.loadRelated();
    window.onscroll = function() {
      const bounding = self.$refs.mainWrapper.getBoundingClientRect();
      if (bounding.y + bounding.height < 0) {
        self.isPiP = true;
      } else {
        self.isPiP = false;
      }
    };
    if (this.settings.responsive) {
      this.scaleRatio = 80;
    }
  },
  watch: {
    isPiP: function(newVal, oldVal) {
      if (newVal) {
        chrome.tabs.getCurrent(function(tab) {
          chrome.webNavigation.getAllFrames(
            {
              tabId: tab.id
            },
            function(frames) {
              for (var frame of frames) {
                if (frame.url.indexOf("https://sdk.uiza.io/") > -1) {
                  console.log("enable pip in iframe" + frame.frameId);
                  self.frameId = frame.frameId;
                  chrome.runtime.sendMessage(
                    {
                      UIZA_EXT_REQUEST_PIP: true,
                      UIZA_EXT_REQUEST_PIP_FRAME_ID: self.frameId
                    },
                    function(resp) {
                      console.log(resp);
                    }
                  );
                  break;
                }
              }
            }
          );
        });
      } else {
        // customEvent.initEvent("uiza-ext-exit-pip");
        // document.dispatchEvent(customEvent);
        console.log("disable pip in iframe" + self.frameId);
        chrome.runtime.sendMessage(
          {
            UIZA_EXT_REQUEST_PIP: false,
            UIZA_EXT_REQUEST_PIP_FRAME_ID: self.frameId
          },
          function(resp) {
            console.log(resp);
          }
        );
      }
    }
  },
  methods: {
    loadRelated() {
      if (this.$route.params.type === "vod") {
        uiza.getVODs().then(resp => {
          this.recommendedItems = resp.data.filter(
            x => x.id !== this.$route.params.id
          );
        });
      } else {
        uiza.getLiveStreamings().then(resp => {
          this.recommendedItems = resp.data.filter(
            x => x.id !== this.$route.params.id
          );
        });
      }
    },
    view(item) {
      const type = item.feedId ? "live" : "vod";
      const url = this.chromeUrl + "#/play/" + type + "/" + item.id;
      var win = window.open(url, "_blank");
      win.focus();
    }
  },
  computed: {
    ...mapFields("settings", ["settings", "playerSettings"]),
    playerParams() {
      const settings = storage.get(constants.SETTINGS_KEY);
      const params = {
        api: btoa(settings.api_key),
        appId: settings.app_id,
        playerVersion: 4,
        entityId: this.$route.params.id,
        width: "100%",
        height: "100%",
        controls: false
      };
      if (this.$route.params.type === "live" && this.live) {
        params.streamName = this.live.channelName;
        params.feedId = this.live.lastFeedId;
      }
      return params;
    },
    chromeUrl() {
      return chrome.runtime.getURL("pages/popup.html");
    }
  },
  data() {
    return {
      scaleRatio: 100,
      recommendedItems: [],
      vod: null,
      live: null,
      jsonData: jsonData,
      isPiP: false,
      frameId: 0
    };
  }
};
</script>
<style lang='scss'>
body,
html {
  margin: 0 !important;
  padding: 0 !important;
}

.uiza-toolbar {
  img {
    margin-right: 15px;
  }
  .input {
    display: inline-block;
    padding: 10px;
    background: #E63946;
    border-radius: 30px;
    input {
      border: none;
      background: transparent;
      outline: none !important;
      color: #FFF;
      text-align: right;
      margin-right: 10px;
      padding-right: 10px;
      border-right: #EEE 1px solid;
      &::placeholder {
        color: #FFF;
      }
    }
    svg {
      color: #FFF;
    }
  }
}
.scaler {
  max-width: 600px;
  margin: 20px auto;
}
.mobile-slider, .mobile-recommendation {
  display: none;
}
.el-menu {
  border: none !important;
  &-item {
    line-height: 56px !important;
  }
}
.side-menu {
  background: #FAFAF4;
  h4 {
    font-size: 18px;
    font-weight: 600;
    margin: 10px;
  }
}
.header {
  z-index: 10;
  background: #FAFAF4;
  box-shadow: 0px 2px 3px 2px rgba(0, 0, 0, 0.3);
  .logo {
    height: 100%;
    max-height: 100%;
  }
}
.main-area {
  margin-top: 20px;
}
.player {
  z-index: 9;
  padding: 0 10px;
  // box-shadow: -5px 0 5px -5px rgba(0, 0, 0, 0.23);
  &-wrapper {
    position: relative;
    width: 100%;
    box-sizing: border-box;
    // 16:9 aspect ratio
    padding-top: 56.25%;

    #player {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
    }
  }
}
.banner {
  max-width: 100%;
  margin: 10px 5px 0 10px;
  border-radius: 10px;
  overflow: hidden;
  img {
    max-width: 100%;
  }
}
.recommendation {
  .el-card__body {
    padding: 0 60px !important;
  }
  .VueCarousel-navigation {
    svg {
      font-size: 30px;
    }
  }
  .VueCarousel-slide, .recommendation-item {
    margin: 5px;
    width: 300px;
    position: relative;
    img {
      object-fit: cover;
      max-width: 100%;
      max-height: 100%;
    }
    .desc {
      padding: 0 10px;
    }
    .item-play {
      position: relative;
      &:hover {
        background: rgba(0, 0, 0, 0.4);
      }
      &-btn {
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -20px;
        margin-left: -20px;
        cursor: pointer;
        svg {
          color: rgba(255, 255, 255, 0.5);
          width: 40px !important;
          height: 40px !important;
        }
      }
      .uiza-gif-player {
        max-width: 100%;
        height: 100%;
        canvas {
          max-width: 100%;
          object-fit: cover;
          height: 100%;
        }
      }
      img {
        height: 100%;
      }
    }
  }
}
.bottom-banners {
  img {
    width: 100% !important;
    margin: 0 0 10px 0;
  }
}

.uiza-screen-small {
  width: 375px;
  height: 667px;
  margin: 0 auto;
  overflow: auto;
  &::-webkit-scrollbar {
    width: 10px;
  }

  /* Track */
  &::-webkit-scrollbar-track {
    background: #f1f1f1; 
  }
  
  /* Handle */
  &::-webkit-scrollbar-thumb {
    background: #888; 
  }

  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    background: #555; 
  }
  .header {
    display: none;
  }
  .main-area {
    margin: 0 !important;
    .el-col-4 {
      display: none;
    }
    .player {
      width: 100%;
      padding: 0 !important;
      &-wrapper {
        padding: 0 !important;
        height: 667px !important;
      }
    }
  }
  .web-recommendation {
    display: none;
  }
  .mobile-slider, .mobile-recommendation {
    display: block;
  }
  .recommendation {
    &-item {
      width: calc(50% - 10px) !important;
      height: 120px !important;
      overflow: hidden;
      .item-play {
        height: 120px !important;
        &-btn {
          display: block !important;
        }
      }
      .desc {
        h4 {
          text-align: center;
        }
      }
    }
  }
  .uiza-theme-kute {
    .uiza-shop-info {
      left: 0;
    }
    .uiza-view-count {
      left: 50px !important;
    }
    .uiza-order {
      left: 0;
      top: 110px !important;
    }
    .uiza-controls {
      flex-direction: row !important;
    }
    .uiza-chat {
      top: 200px !important;
      transform: scale(0.8);
      transform-origin: bottom left;
      .uiza-chat-messages-item-info .time {
        display: none;
      }
    }
    .uiza-giftbox {
      z-index: 1;
      right: 10px !important;
      &-wrapper {
        left: -45px !important;
        padding-bottom: 10px !important;
      }
      &-image {
        width: 50px;
        height: 50px;
        img {
          width: 40px !important;
          top: -10px;
        }
        &-countdown {
          padding-top: 37px;
          svg {
            display: none !important;
          }
        }
      }
    }
    .uiza-controls {
      top: 10px !important;
      &-icon {
        width: 24px;
        height: 24px;
        img {
          width: 16px;
          height: 16px;
          margin-top: 3px;
        }
      }
    }

    .uiza-egg.pinned {
      top: auto !important;
      right: 15px;
      bottom: 360px !important;
    }
    .uiza-controls-shopping-share-popup {
      top: 50px !important;
      right: 0 !important;
      padding: 5px 10px !important;
      a {
        display: inline-block !important;
        &:first-child {
          margin-bottom: 0 !important;
          margin-right: 10px !important;
        }
      }
    }
    .uiza-product-list {
      left: 0;
      right: 0;
      border-radius: 0;
      z-index: 99999;
      &-swiper {
        margin: 0 !important;
      }
    }
    .uiza-player-popup {
      z-index: 99999;
      .uiza-player-popup-content {
        flex-direction: column;
      }
      .product-popup {
        &-image {
          float: none;
          width: 100%;
        }
        &-content {
          padding: 10px 20px;
        }
        &-footer {
          padding: 0 0 20px 20px;
          &-btn {
            padding: 0 10px;
          }
        }
      }
    }
  }
}
</style>