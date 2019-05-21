<template lang="pug">
div
  div.header
    i.el-icon-arrow-left(@click='back')
    span(v-if="vod") {{ vod.name }}
  div.player
    div(id="player")
  el-form(:disabled='true' size='small' label-position='left' label-width="110px" :model='playerSettings' :rules='playerRules' ref='playerForm')
    el-form-item(label='Player size')
      el-col(:span='11')
        el-input(v-model='playerSettings.width')
      el-col(class="line" :span="2")
        | x 
      el-col(:span='11')
        el-input(v-model='playerSettings.height')
    el-form-item(label='Player color')
      el-color-picker(v-model="playerSettings.color")
    el-form-item(label='Brand logo', prop='brand_logo')
      el-input(v-model='playerSettings.brand_logo')
    el-form-item(label='Brand url', prop='brand_url')
      el-input(v-model='playerSettings.brand_url')
    el-form-item
      el-button(type='primary', @click='submitForm') Save
      el-button(@click='resetForm') Reset
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
    if (this.$route.params.type === 'vod') {
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
      if (this.$route.params.type === 'live') {
        params.streamName = this.live.channelName
        params.feedId = this.live.lastFeedId
      }
      window.UZ.Player.init(
        "#player", params,
        function(player) {
          player.on("play", function() {
            console.log("play");
          });
          player.on("pause", function() {
            console.log("pause");
          });
        }
      );
    },
    submitForm() {
      this.$refs.playerForm.validate(valid => {
        if (valid) {
        } else {
        }
      });
    },
    resetForm() {
      this.$refs.settingsForm.resetFields();
    }
  },
  computed: {
    ...mapFields("settings", ["settings", "playerSettings"])
  },
  data() {
    return {
      vod: null,
      live: null,
      playerRules: {
        width: [
          {
            required: true,
            message: "Please specify player's width",
            trigger: "blur"
          },
          {
            number: true,
            message: "Height must be a number"
          }
        ],
        height: [
          {
            required: true,
            message: "Please specify player's height",
            trigger: "blur"
          },
          {
            number: true,
            message: "Height must be a number"
          }
        ],
        brand_logo: [],
        brand_url: []
      }
    };
  }
};
</script>