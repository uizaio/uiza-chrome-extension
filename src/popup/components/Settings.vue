<template lang='pug'>
div
  el-form(:disabled='disabled' label-position='left' label-width="110px" :model='settings' :rules='rules' ref='settingsForm')
    el-form-item(label='App ID', prop='app_id')
      el-input(v-model='settings.app_id')
    el-form-item(label='API key', prop='api_key')
      el-input(v-model='settings.api_key')
    el-form-item
      el-button(type='primary', @click='submitForm') Save
      el-button(@click='resetForm') Reset
  el-form(:disabled='false' size='small' label-position='left' label-width="110px" :model='playerSettings' :rules='playerRules' ref='playerForm')
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
      el-button(type='primary', @click='submitPlayerForm') Save
  
</template>

<script>
import { mapFields } from "vuex-map-fields";
import storage from "../../ext/storage";
import constants from "../constants";

export default {
  mounted() {
    const settings = storage.get(constants.SETTINGS_KEY);
    if (settings) {
      this.settings = settings;
    }
    const playerSettings = storage.get(constants.PLAYER_SETTINGS_KEY);
    if (playerSettings) {
      this.playerSettings = playerSettings;
    }
  },
  data() {
    return {
      disabled: false,
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
      },
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
  },
  computed: {
    ...mapFields("settings", ["settings", "playerSettings"])
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
            title: "Error",
            message: "Please correct the input fields",
            type: "error"
          });
        }
      });
    },
    resetForm() {
      this.$refs.settingsForm.resetFields();
    },
    submitPlayerForm() {
      const self = this;
      this.$refs.playerForm.validate(valid => {
        if (valid) {
          storage.set(constants.PLAYER_SETTINGS_KEY, this.playerSettings);
          // emit playerChanged event on injected script
          chrome.tabs.query({"active": true, "currentWindow": true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                "UIZA_EXT_PLAYER": self.playerSettings
              }
            );
          });
          this.$alert("Settings save successfully", "Uiza Extension", {
            confirmButtonText: "OK"
          });
        } else {
          this.$notify({
            title: "Error",
            message: "Please correct the input fields",
            type: "error"
          });
        }
      });
    },
    resetPlayerForm() {
      this.$refs.playerForm.resetFields();
    }
  }
};
</script>