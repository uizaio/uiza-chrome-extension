<template lang='pug'>
el-form(:disabled='disabled' label-position='top' :model='settings' :rules='rules' ref='settingsForm')
  el-form-item(label='App ID', prop='app_id')
    el-input(v-model='settings.app_id')
  el-form-item(label='API key', prop='api_key')
    el-input(v-model='settings.api_key')
  el-form-item
    el-button(type='primary', @click='submitForm') Save
    el-button(@click='resetForm') Reset

</template>

<script>
import storage from "../../ext/storage";
import constants from "../constants";

export default {
  mounted() {
    const data = storage.get(constants.SETTINGS_KEY);
    if (data) {
      this.settings = data;
    }
  },
  data() {
    return {
      disabled: false,
      settings: {
        api_key: "",
        app_id: ""
      },
      rules: {
        api_key: [
          {
            required: true,
            message: "Please input Uiza API key",
            trigger: "blur"
          }
        ],
        app_id: [
          {
            required: true,
            message: "Please input Uiza App ID",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    submitForm() {
      this.$refs.settingsForm.validate(valid => {
        if (valid) {
          storage.set(constants.SETTINGS_KEY, this.settings);
          this.disabled = true;
          this.$alert("Settings save successfully", "Uiza Extension", {
            confirmButtonText: "OK"
          });
        } else {
          this.$notify({
            title: "Success",
            message: "This is a success message",
            type: "success"
          });
        }
      });
    },
    resetForm() {
      this.$refs.settingsForm.resetFields();
    }
  }
};
</script>