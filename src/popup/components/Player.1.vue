<template lang="pug">
div
  div.header
    i.el-icon-arrow-left(@click='back')
    span(v-if="vod") {{ vod.name }}
  div.player
    div(id="player")
</template>
<style lang='scss'>
.header {
  font-weight: 600;
  font-size: 16px;
  border-bottom: #eee 1px solid;
  padding: 5px 0 10px;
  i {
    cursor: pointer;
  }
  span {
    display: inline-block;
    margin-left: 10px;
  }
}
.player {
  margin: 10px 0;
}
</style>
<script>
import { mapFields } from "vuex-map-fields";
import storage from "../../ext/storage";
import constants from "../constants";
import uiza from "../services/uiza";

export default {
  mounted() {
    if (this.$route.params.type === "vod") {
      uiza.getSingleVOD(this.$route.params.id).then(resp => {
        this.vod = resp.data;
        this.initPlayer();
      });
    } else {
      uiza.getLive(this.$route.params.id).then(resp => {
        this.live = resp.data;
        this.initPlayer();
      });
    }
  },
  methods: {
    back() {
      this.$router.back();
    },
    initPlayer() {
      const settings = storage.get(constants.SETTINGS_KEY);
      const params = {
        api: btoa(settings.api_key),
        appId: settings.app_id,
        playerVersion: 4,
        entityId: this.$route.params.id,
        width: "400px",
        height: "200px"
      };
      if (this.$route.params.type === "live") {
        params.streamName = this.live.channelName;
        params.feedId = this.live.lastFeedId;
      }
      window.UZ.Player.init("#player", params, function(player) {
        player.on("play", function() {
          console.log("play");
        });
        player.on("pause", function() {
          console.log("pause");
        });
      });
    }
  },
  computed: {
    ...mapFields("settings", ["settings", "playerSettings"])
  },
  data() {
    return {
      vod: null,
      live: null
    };
  }
};
</script>