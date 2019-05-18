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
  margin-top: 20px;
}
</style>
<script>
import storage from "../../ext/storage";
import constants from "../constants";
import uiza from "../services/uiza";

export default {
  mounted() {
    uiza.getSingleVOD(this.$route.params.id).then(resp => {
      this.vod = resp.data;
      this.initPlayer();
    });
  },
  methods: {
    back() {
      this.$router.back();
    },
    initPlayer() {
      const settings = storage.get(constants.SETTINGS_KEY);
      window.UZ.Player.init(
        "#player",
        {
          api: btoa(settings.api_key),
          appId: settings.app_id,
          playerVersion: 4,
          entityId: this.$route.params.id,
          width: "400px",
          height: "200px"
        },
        function(player) {
          player.on("play", function() {
            console.log("play");
          });
          player.on("pause", function() {
            console.log("pause");
          });
        }
      );
    }
  },
  data() {
    return {
      vod: null
    };
  }
};
</script>