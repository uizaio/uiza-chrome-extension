<template lang="pug">
div
  el-menu(mode="horizontal" class="header")
    el-menu-item
      a(:href="playerSettings.brand_url")
        img(class="logo" :src="playerSettings.brand_logo")
  el-row(type="flex")
    el-col(:span="4")
      el-menu(mode="vertical")
        el-menu-item Menu 1
        el-menu-item Menu 2
        el-menu-item Menu 3
        el-menu-item Menu 4
    el-col.player(:span="16")
      div.player-wrapper(ref="mainWrapper")
        //- div(id="player")
        UizaPlayer(v-if="vod || live" :params="playerParams" :settings="playerSettings" :chromeUrl="chromeUrl" :json="jsonData" id="player")
    el-col(:span="4")
      div.banner
        img(src="https://salt.tikicdn.com/ts/banner/ac/b5/94/f32bbde9a2da851aad01c62f4134d06c.png")
      div.banner
        img(src="https://salt.tikicdn.com/ts/banner/a2/7d/90/8bdf0769796158a0f87bae170e41f698.png")
      div.banner
        img(src="https://salt.tikicdn.com/ts/banner/da/47/93/23a0ac53f7ea350585d7383817257c6a.png")
  el-card.recommendation
    div(slot="header")
      span Recommended for you
    carousel(:paginationEnabled="false"  :navigationEnabled="true" navigationNextLabel="<i class='fas fa-chevron-right'></i>" navigationPrevLabel="<i class='fas fa-chevron-left'></i>" :perPage="7")
      slide(v-for="item in recommendedItems" v-bind:key="item.id")
        div(class="item-play")
          div(class="item-play-btn" @click="view(item)")
            i.fas.fa-play-circle
        img(:src='item.image || "https://2.bp.blogspot.com/-LaFuqxk9jag/Vwcx0NIk8jI/AAAAAAAAJBo/-u9AvpBVosU-lJZCoG6fKT23czNx1KKEg/s1600/hee.gif"')
        .desc
          h4 {{ item.name }}
  div(style="height: 1000px !important") hello
</template>
<style lang='scss'>
body,
html {
  margin: 0 !important;
  padding: 0 !important;
}
.el-menu {
  border: none !important;
  &-item {
    line-height: 56px !important;
  }
}
.header {
  z-index: 10;
  box-shadow: 0px 2px 3px 2px rgba(0, 0, 0, 0.3);
  .logo {
    height: 100%;
    max-height: 100%;
  }
}
.player {
  z-index: 9;
  padding: 10px;
  box-shadow: -5px 0 5px -5px rgba(0, 0, 0, 0.23);
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
  .VueCarousel-slide {
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
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
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
    }
  }
}
</style>
<script>
import { Carousel, Slide } from "vue-carousel";
import { mapFields } from "vuex-map-fields";
import storage from "../../ext/storage";
import constants from "../constants";
import uiza from "../services/uiza";
import UizaPlayer from "../../content/components/Player";
// eslint-disable-next-line no-unused-vars
import { enablePiP, disablePiP } from "../../backend/functions";
import EventBus from "../../content/EventBus";
const jsonData = require("../../content/data.json");

export default {
  components: {
    Carousel,
    Slide,
    UizaPlayer
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
  },
  watch: {
    isPiP: function(newVal, oldVal) {
      // const customEvent = document.createEvent("Event");
      if (newVal) {
        chrome.tabs.getCurrent(function(tab) {
          chrome.webNavigation.getAllFrames(
            {
              tabId: tab.id
            },
            function(frames) {
              for (var frame of frames) {
                if (frame.url.indexOf("https://sdk.uiza.io/") > -1) {
                  self.frameId = frame.frameId;
                  // enablePiP(frame.frameId);
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