<template lang="pug">
div(class="uiza-scroll-wrapper")
  div(v-if='isConfigured' class="medias" v-loading="isLoading" element-loading-text="Loading... Please wait for a moment")
      //- el-button(@click="load") Load
      p Hold your mouse on the video item and drag it onto the webpage
      div(draggable @dragstart="onDragStart($event, item)" class='item' v-for="item in vods" @click="playItem(item)")
          div(class='item-thumbnail')
              img(:src='item.thumbnail || "https://dashboard.uiza.io/assets/img/image-not-available.jpg"')
          div(class='item-content')
              h4 {{ item.name }}
              p.date {{ item.createdAt }}
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
        uiza.getVODs().then(resp => {
          this.vods = resp.data;
          this.isLoading = false;
        });
      }
    },
    playItem(item) {
      this.$router.push({
        name: "play",
        params: {
          type: 'vod',
          id: item.id
        }
      });
    },
    onDragStart(event, item) {
      const settings = storage.get(constants.SETTINGS_KEY);
      let data = {
        playerParams: {
          api: btoa(settings.api_key),
          appId: settings.app_id,
          playerVersion: 4,
          entityId: item.id,
          width: '500px',
          height: '300px',
          controls: false
        },
        playerSettings: this.playerSettings
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
      vods: []
    };
  }
};
</script>