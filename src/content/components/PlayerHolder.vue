<template lang="pug">
div.uiza-ext-player-holder(ref="mainWrapper")
    div.uiza-ext-player-holder-img(v-if="isLive" v-on:click.stop="showPlayer")
        img(:src="playerParams.thumbnail || 'https://2.bp.blogspot.com/-LaFuqxk9jag/Vwcx0NIk8jI/AAAAAAAAJBo/-u9AvpBVosU-lJZCoG6fKT23czNx1KKEg/s1600/hee.gif'" alt="View live stream")
        span.uiza-ext-player-holder-text {{ thumbText }}
    div(style="max-height: 100%" v-else :class="{ 'uiza-ext-player-minimized-disabled': isPip }")
        Player(:params="playerParams" :settings="playerSettings" :chromeUrl="chromeUrl" :json="jsonData" :id="rawId")
    //- el-dialog(:visible.sync="isDialogShown" :width="playerParams.width" :append-to-body="true" :lock-scroll="false" :id="rawId")
    div(ref="fixedPlayer" v-show="isDialogShown" id="uiza-ext-player-fixed" class="uiza-ext-player-fixed" :class="{ 'uiza-ext-player-fixed-minimized-disabled': isPip }")
        button.uiza-ext-player-fixed-close(@click="closePopup")
            i.fas.fa-times
        Player(v-if="isDialogShown" :params="playerParams" :settings="playerSettings" :json="jsonData" :id="rawId")
</template>

<script>
import Player from "./Player";
import EventBus from "../EventBus";
import $ from "jquery";

export default {
  components: {
    Player
  },
  created() {
    EventBus.$on(
      "onTogglePIP",
      function(val) {
        this.isPip = val;
      }.bind(this)
    );
  },
  mounted() {
    const self = this;
    window.onscroll = function() {
      const bounding = self.$refs.mainWrapper.getBoundingClientRect();
      if (bounding.y + bounding.height < 0) {
        self.isPip = true;
      } else {
        self.isPip = false;
      }
    };
  },
  watch: {
    isPip: function(newVal, oldVal) {
      const customEvent = document.createEvent("Event");
      if (newVal) {
        customEvent.initEvent("uiza-ext-request-pip");
        document.dispatchEvent(customEvent);
      } else {
        customEvent.initEvent("uiza-ext-exit-pip");
        document.dispatchEvent(customEvent);
      }
    }
  },
  methods: {
    showPlayer($event) {
      $event.preventDefault();
      // eslint-disable-next-line no-constant-condition
      if (true) {
        const type = this.playerParams.feedId ? "live" : "vod";
        const url =
          this.chromeUrl + "#/play/" + type + "/" + this.playerParams.entityId;
        var win = window.open(url, "_blank");
        win.focus();
      } else {
        if (!this.isDialogShown) {
          this.isDialogShown = true;
          setTimeout(
            function() {
              $(this.$refs.fixedPlayer).appendTo("body");
            }.bind(this),
            100
          );
        }
      }
    },
    closePopup() {
      this.isDialogShown = false;
      this.counter++;
    }
  },
  computed: {
    chromeUrl() {
      return this.$parent.data.chromeUrl;
    },
    playerParams() {
      return this.$parent.data.playerParams;
    },
    playerSettings() {
      return this.$parent.data.playerSettings;
    },
    isLive() {
      return this.playerParams && !!this.playerParams.feedId;
    },
    jsonData() {
      return this.$parent.jsonData;
    },
    id() {
      return this.$parent.id + this.counter;
    },
    rawId() {
      return this.$parent.id.replace("#", "") + this.counter;
    },
    thumbText() {
      return this.playerParams.feedId ? "Live" : "VOD";
    }
  },
  data() {
    return {
      isDialogShown: false,
      isPip: false,
      counter: 0
    };
  }
};
</script>

<style lang="scss">
.uiza-ext-player-minimized {
  position: fixed !important;
  z-index: 9999999 !important;
  position: fixed !important;
  left: auto !important;
  top: auto !important;
  right: 5px !important;
  bottom: 5px !important;
  width: 380px !important;
  height: 230px !important;
}
.uiza-ext-player-fixed {
  position: fixed;
  top: calc(50vh - 180px);
  left: calc(50vw - 340px);
  z-index: 9999999;
  &.uiza-ext-player-fixed-minimized {
    position: fixed !important;
    z-index: 9999999 !important;
    position: fixed !important;
    left: auto !important;
    top: auto !important;
    right: 5px !important;
    bottom: 5px !important;
    width: 380px !important;
    height: 230px !important;
    &-disabled {
      display: none !important;
    }
  }
  &-close {
    position: absolute !important;
    top: -10px !important;
    right: -10px !important;
    background: #fff !important;
    border: #ccc 1px solid !important;
    outline: none !important;
    border-radius: 100% !important;
    height: 36px !important;
    width: 36px !important;
    z-index: 2147483647;
    text-align: center;
    padding: 2px 0 0 0 !important;
  }
}
.uiza-ext-player-holder {
  width: 100%;
  // height: 90%;
  max-height: 100%;
  position: relative;
  &-img {
    text-align: center;
    cursor: pointer;
    img {
      max-width: 100%;
      // max-height: 90%;
      object-fit: cover;
    }
  }
  &-text {
    position: absolute;
    right: 10px;
    top: 10px;
    color: red;
    font-size: 16px;
    font-weight: 600;
  }
  iframe {
    min-width: 100% !important;
    max-width: 100% !important;
    min-height: 100% !important;
    max-height: 100% !important;
  }
}
.el-dialog {
  &__header {
    padding: 0 !important;
  }
  &__body {
    padding: 0 !important;
  }
}
</style>