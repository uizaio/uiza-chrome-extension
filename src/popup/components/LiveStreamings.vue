<template lang="pug">
div(class="uiza-scroll-wrapper")
  div(v-if='isConfigured' class="medias" v-loading="isLoading" element-loading-text="Loading... Please wait for a moment")
      //- el-button(@click="load") Load
      p Hold your mouse on the video item and drag it onto the webpage
      div(draggable @dragstart="onDragStart($event, item)" class='item' v-for="item in livestreamings" @click="playItem(item)")
          div(class='item-thumbnail')
              img(:src='item.thumbnail || "https://2.bp.blogspot.com/-LaFuqxk9jag/Vwcx0NIk8jI/AAAAAAAAJBo/-u9AvpBVosU-lJZCoG6fKT23czNx1KKEg/s1600/hee.gif"')
          div(class='item-content')
              h4
                | {{ item.name }}
                span(class="live" v-if="item.lastProcess === 'start'") Live
              p.date {{ item.createdAt }}
      Player(v-if="playing" :entityId="playing.id")
  div(v-else)
    | Not configured
</template>
<style lang="scss">
.uiza-scroll-wrapper {
  height: calc(100vh - 80px);
  overflow: auto;
  .item {
    display: flex;
    padding: 10px 0;
    border-bottom: #eee 1px solid;
    cursor: grab;
    &-thumbnail {
      flex: 0 0 120px;
      img {
        max-width: 120px;
      }
    }
    &-content {
      flex: 1;
      padding-left: 10px;
      h4 {
        margin-top: 0;
        .live {
          background: #ff0000;
          color: #fff;
          border-radius: 4px;
          display: inline-block;
          margin-left: 10px;
          padding: 2px 10px;
        }
      }

      p {
        margin: 0 !important;
      }
    }
  }
}
</style>
<script>
import { mapFields } from "vuex-map-fields";
import storage from "../../ext/storage";
import constants from "../constants";
import uiza from "../services/uiza";
import Player from "./Player";

export default {
  components: {
    Player
  },
  created() {},
  mounted() {
    this.load();
  },
  methods: {
    load() {
      if (this.isConfigured) {
        this.isLoading = true;
        uiza.getLiveStreamings().then(resp => {
          this.livestreamings = resp.data;
          this.isLoading = false;
        });
      }
    },
    playItem(item) {
      // eslint-disable-next-line no-constant-condition
      if (false) {
        this.$router.push({
          name: "play",
          params: {
            type: "live",
            id: item.id
          }
        });
      }
    },
    onDragStart(event, item) {
      const settings = storage.get(constants.SETTINGS_KEY);
      let data = {
        playerParams: {
          api: btoa(settings.api_key),
          appId: settings.app_id,
          playerVersion: 4,
          entityId: item.id,
          streamName: item.channelName,
          feedId: item.lastFeedId,
          width: "685px",
          height: "385px",
          controls: false,
          thumbnail: item.thumbnail
        },
        playerSettings: this.playerSettings,
        chromeUrl: chrome.runtime.getURL("pages/popup.html")
      };
      event.dataTransfer.setData("text/plain", JSON.stringify(data));
      event.dataTransfer.dropEffect = "copy";
    }
  },
  computed: {
    isConfigured: uiza.isConfigured,
    ...mapFields("settings", ["settings", "playerSettings"])
  },
  data() {
    return {
      isLoading: false,
      livestreamings: [],
      playing: null
    };
  }
};
</script>