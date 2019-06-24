<template lang="pug">
el-form(size="small" label-position='left' label-width="120px")
    el-form-item(label='Page logo', prop='settings.page_logo')
      el-input(v-model='settings.page_logo')
    p Paste the banner's links here separated by break lines
    el-form-item(label='Left banners', prop='leftBanners')
      el-input(type="textarea" autosize v-model='leftBanners')
    el-form-item(label='Right banners', prop='rightBanners')
      el-input(type="textarea" autosize v-model='rightBanners')
    el-form-item(label='Bottom banners', prop='bottomBanners')
      el-input(type="textarea" autosize v-model='bottomBanners')
    el-form-item
      el-button(type='primary' @click='submit') Save
</template>
<script>
import { mapFields } from "vuex-map-fields";
// eslint-disable-next-line no-unused-vars
import storage from "../../ext/storage";
// eslint-disable-next-line no-unused-vars
import constants from "../constants";
// eslint-disable-next-line no-unused-vars
import _ from "lodash";

export default {
  mounted() {
    const settings = storage.get(constants.SETTINGS_KEY);
    if (settings) {
      this.settings = _.merge(this.settings, settings);
      this.settings = Object.assign({}, this.settings);
    }
    console.log(this.settings);
  },
  methods: {
    submit() {
      storage.set(constants.SETTINGS_KEY, this.settings);
      this.$notify({
        title: "Success",
        message: "Saved successfully",
        type: "success"
      });
    }
  },
  computed: {
    ...mapFields("settings", ["settings"]),
    leftBanners: {
      get: function() {
        if (this.settings && this.settings.left_banners) {
          return this.settings.left_banners.join("\n");
        } else {
          return "";
        }
      },
      set: function(val) {
        this.settings.left_banners = val.split("\n");
      }
    },
    rightBanners: {
      get: function() {
        if (this.settings && this.settings.right_banners) {
          return this.settings.right_banners.join("\n");
        } else {
          return "";
        }
      },
      set: function(val) {
        this.settings.right_banners = val.split("\n");
      }
    },
    bottomBanners: {
      get: function() {
        if (this.settings && this.settings.bottom_banners) {
          return this.settings.bottom_banners.join("\n");
        } else {
          return "";
        }
      },
      set: function(val) {
        this.settings.bottom_banners = val.split("\n");
      }
    }
  },
  data() {
    return {};
  }
};
</script>
<style lang="scss">
</style>