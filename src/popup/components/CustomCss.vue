<template lang="pug">
el-form(size="small" label-position='top')
    el-form-item(label="Override extension's style" prop='settings.custom_css')
      //- el-input(type="textarea" autosize v-model='settings.custom_css')
      prism-editor(v-model="settings.custom_css" language="css")
    el-form-item
      el-button(type='primary' @click='submit') Save
</template>

<script>
import PrismEditor from "vue-prism-editor";
import { mapFields } from "vuex-map-fields";
import storage from "../../ext/storage";
import constants from "../constants";

export default {
  components: {
    PrismEditor
  },
  mounted() {},
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
    ...mapFields("settings", ["settings", "playerSettings"])
  }
};
</script>
<style lang="scss">
</style>