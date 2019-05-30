<template lang='pug'>
div
  el-form(:disabled='disabled || isValidating' size="small" label-position='left' label-width="120px" :model='settings' :rules='rules' ref='settingsForm')
    el-form-item(label='App ID', prop='app_id')
      el-input(v-model='settings.app_id')
    el-form-item(label='API key', prop='api_key')
      el-input(v-model='settings.api_key')
    el-form-item
      el-button(:loading="isValidating" type='primary' @click='submitForm') Save
      el-button(@click='resetForm') Reset
  el-form(:disabled='false' size='small' label-position='left' label-width="110px" :model='playerSettings' :rules='playerRules' ref='playerForm')
    //- el-form-item(label='Player size')
    //-   el-col(:span='11')
    //-     el-input(v-model='playerSettings.width')
    //-   el-col(class="line" :span="2")
    //-     | x 
    //-   el-col(:span='11')
    //-     el-input(v-model='playerSettings.height')
    el-form-item(label='Player color')
      el-color-picker(v-model="playerSettings.color")
    el-form-item(label='Brand logo', prop='brand_logo')
      el-input(v-model='playerSettings.brand_logo')
    el-form-item(label='Brand url', prop='brand_url')
      el-input(v-model='playerSettings.brand_url')
    el-form-item(label='Cart url', prop='cart_url')
      el-input(v-model='playerSettings.cart_url')
    el-form-item(label='Product overlay', prop='brand_url')
      el-row(:gutter="5" v-for="(item, index) in playerSettings.ads" v-bind:key="index")
        el-col(:span="15")
          el-time-picker(placeholder="Pick a time" v-model="item.time" style="width: 100%" @change="changeTime(item)")
        el-col(:span="6")
          el-input(v-model='item.duration' placeholder="Duration" @change="checkAddCue")
      el-row(:gutter="5")
        el-col(:span="15") Time
        el-col(:span="5") Duration
    el-form-item
      el-button(type='primary' @click='submitPlayerForm') Save
  
</template>

<script>
import { mapFields } from "vuex-map-fields";
import storage from "../../ext/storage";
import constants from "../constants";
import _ from 'lodash';
import uiza from "../services/uiza";

export default {
  mounted() {
    const settings = storage.get(constants.SETTINGS_KEY);
    if (settings) {
      this.settings = settings;
    }
    const playerSettings = storage.get(constants.PLAYER_SETTINGS_KEY);
    if (playerSettings) {
      this.playerSettings = _.merge(this.playerSettings, playerSettings);
    }
  },
  data() {
    var checkAppId = function(rule, value, callback) {
      const regex = /^[a-zA-Z0-9]+$/;
      if (!regex.test(value)) {
        callback(new Error("Invalid App ID pattern"));
      } else {
        callback();
      }
    };
    var apiKey = function(rule, value, callback) {
      const regex = /^uap-[a-zA-Z0-9-]+$/;
      if (!regex.test(value)) {
        callback(new Error("Invalid API Key pattern"));
      } else {
        callback();
      }
    };
    return {
      disabled: false,
      isValidating: false,
      rules: {
        api_key: [
          {
            required: true,
            message: "Please input Uiza API key",
            trigger: "blur"
          },
          { validator: apiKey, trigger: "blur" }
        ],
        app_id: [
          {
            required: true,
            message: "Please input Uiza App ID",
            trigger: "blur"
          },
          { validator: checkAppId, trigger: "blur" }
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
        brand_url: [],
        cart_url: []
      }
    };
  },
  computed: {
    ...mapFields("settings", ["settings", "playerSettings"])
  },
  methods: {
    checkAddCue() {
      // const hasEmpty = _.find(this.playerSettings.ads, ad => {
      //   return !ad.time && ad.duration <= 0;
      // });
      // if (!hasEmpty) {
      //   this.playerSettings.ads.push({
      //     time: new Date(2017, 12, 12, 0, 0, 30),
      //     duration: 20
      //   });
      // }
    },
    changeTime(item) {
      console.log(item);
      this.checkAddCue();
    },
    submitForm() {
      this.$refs.settingsForm.validate(valid => {
        if (valid) {
          this.isValidating = true;
          uiza.checkCredentials(this.settings.app_id, this.settings.api_key)
            .then(() => {
              storage.set(constants.SETTINGS_KEY, this.settings);
              this.disabled = true;
              this.$emit("settingsSaved");
              this.$notify({
                title: "Success",
                message: "Your credentials have been saved",
                type: "success"
              });
            })
            .catch(err => {
              console.log(err);
              this.$notify({
                title: 'Invalid credentials',
                message: 'Invalid credentials. Please check again',
                type: 'error'
              })
            })
            .finally(() => {
              this.isValidating = false;
            })
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
          chrome.tabs.query({ active: true, currentWindow: true }, function(
            tabs
          ) {
            chrome.tabs.sendMessage(tabs[0].id, {
              UIZA_EXT_PLAYER: self.playerSettings
            });
          });
          this.$alert(
            "Settings are saved successfully. Drag and drop a player to webpage to see the changes.",
            "Uiza Extension",
            {
              confirmButtonText: "OK"
            }
          );
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