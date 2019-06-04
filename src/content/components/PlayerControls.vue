<template lang="pug">
.uiza-player-controls
  //- Progress bar
  .uiza-player-controls-progress
    VueSlider(v-model="currentPos" :dot-size="3" :max="duration" @change="onProgressChanged" :processStyle="{ background: settings.color }")
      template(v-slot:process="{ start, end, style }")
        div(class="vue-slider-process custom-class" :style="[style]")
  //-  Play button
  button.uiza-player-controls-play(v-show="!isPlaying" @click="play" :style="{ color: settings.color }")
    i.fas2.fa-play
  button.uiza-player-controls-play(v-show="isPlaying" @click="pause" :style="{ color: settings.color }")
    i.fas2.fa-pause
  //- Forward reward
  button.uiza-player-controls-play(v-if="!isLive" @click="reward" :style="{ color: settings.color }")
    i.fas2.fa-reward
  button.uiza-player-controls-play(v-if="!isLive" @click="forward" :style="{ color: settings.color }")
    i.fas2.fa-forward
  //- Volume button
  div.uiza-player-controls-volume(@mouseover="isVolumeShown = true" @mouseleave="transitVolumeHide")
    button(v-show="currentVolume === 100" @click="mute" :style="{ color: settings.color }")
      i.fas2.fa-volume-up
    button(v-show="currentVolume > 0 && currentVolume < 100" @click="mute" :style="{ color: settings.color }")
      i.fas2.fa-volume-middle
    button(v-show="currentVolume === 0" @click="unmute" :style="{ color: settings.color }")
      i.fas2.fa-volume-mute
    //- Volume slider
    div(class="uiza-player-controls-volume-slider" @mouseover.stop="transitVolumeShow" @mouseleave.stop="isVolumeShown = false" v-if="isVolumeShown")
      VueSlider(direction="btt" :height="50" :dotSize="8" v-model="currentVolume" :max="100" @change="onVolumeChanged" :processStyle="{ background: settings.color }")
  //- Live button
  div(v-if="isLive" @click="seekToLive" class="uiza-player-controls-live")
    span(:class="{ 'inactive': isLive && isSeeked }") Live
  //- Duration
  div(v-if="!isLive" class="uiza-player-controls-duration")
    span {{ formattedCurrentPos }}
    span /
    span {{ formattedDuration }}
  //- Spacer
  div.uiza-player-controls-spacer
  //- Qualities
  dropdown(class="uiza-player-controls-levels" align="top" v-if="qualities.length" :close-on-click="true")
    template(slot="btn")
      button()
        i.fas2.fa-cogs
    template(slot="body")
      el-button(@click="onChangeQuality(item)" size="mini" v-for="item in qualities" v-bind:key="item.label" :disabled="selectedQuality && selectedQuality.label === item.label")
        | {{ item.label }}

  //- PIP
  button(v-if="!isPiP" @click="requestPIP")
    i.fas2.fa-pip
  button(v-if="isPiP" @click="exitPIP")
    i.fas2.fa-pip-off
  //- Fullscreen
  button.uiza-player-controls-fullscreen(@click="fullscreen" :style="{ color: settings.color }")
    i.fas2.fa-fullscreen
</template>

<script>
import VueSlider from "vue-slider-component";
import Dropdown from 'bp-vuejs-dropdown';
import EventBus from '../EventBus';

export default {
  props: ["player", "isLive", "settings"],
  components: {
    VueSlider,
    Dropdown
  },
  mounted() {
    const self = this;
    this.player.on("play", () => {
      self.isPlaying = true;
      // self.qualities = self.player.qualities();
    });
    this.player.on("pause", () => {
      self.isPlaying = false;
    });
    this.player.on("durationchange", val => {
      // get duration in miliseconds
      self.duration = self.player.duration()
        ? self.player.duration() * 1000
        : 0;
    });
    this.player.on("volumechange", () => {
      self.currentVolume = self.player.volume() * 100;
    });
    this.player.on("timeupdate", val => {
      self.currentPos = self.player.currentTime() * 1000;
    });
    this.player.on("qualitieschange", () => {
      self.qualities = self.player.qualities();
      if (self.qualities.length) {
        self.selectedQuality = self.qualities[0];
      }
    });
  },
  methods: {
    millisToMinutesAndSeconds(millis) {
      var minutes = Math.floor(millis / 60000);
      var seconds = ((millis % 60000) / 1000).toFixed(0);
      return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    },
    fullscreen() {
      if (this.player.isFullscreen()) {
        this.player.exitFullscreen();
      } else {
        this.player.requestFullscreen();
      }
    },
    play() {
      const self = this;
      self.player.play();
    },
    pause() {
      this.player.pause();
    },
    reward() {
      const change = Math.min(this.player.duration(), 10);
      this.player.currentTime(this.player.currentTime() - change);
    },
    forward() {
      const change = Math.min(Math.abs(this.player.duration() - this.player.currentTime()), 10);
      if (change > 0) {
       this.player.currentTime(this.player.currentTime() + change);
      }
    },
    mute() {
      this.player.volume(0);
    },
    unmute() {
      this.player.volume(1);
    },
    transitVolumeHide() {
      this.transitVolumeTimeout = setTimeout(function() {
        this.isVolumeShown = false;
      }.bind(this), 1000);
    },
    transitVolumeShow(e) {
      e.stopPropagation();
      clearTimeout(this.transitVolumeTimeout);
      this.isVolumeShown = true;
    },
    onVolumeChanged() {
      this.player.volume(this.currentVolume / 100);
    },
    onProgressChanged() {
      this.player.currentTime(this.currentPos / 1000);
      if (this.currentPos / 1000 < this.player.duration()) {
        this.isSeeked = true;
      } else {
        this.isSeeked = false;
      }
    },
    seekToLive() {
      this.player.currentTime(this.player.duration());
      this.isSeeked = false;
    },
    onChangeQuality(item) {
      this.selectedQuality = item;
      const index = this.qualities.indexOf(item);
      this.player.currentLevel(index);
    },
    requestPIP() {
      this.isPiP = true;
      EventBus.$emit('onTogglePIP')
    },
    exitPIP() {
      this.isPiP = false;
      EventBus.$emit('onTogglePIP')
    }  
  },
  computed: {
    formattedCurrentPos() {
      return this.millisToMinutesAndSeconds(this.currentPos);
    },
    formattedDuration() {
      return this.millisToMinutesAndSeconds(this.duration);
    }
  },
  data() {
    return {
      isPlaying: false,
      isSeeked: false,
      currentPos: 0,
      duration: 0,
      currentVolume: 100,
      isVolumeShown: false,
      transitVolumeTimeout: null,
      qualities: [],
      selectedQuality: null,
      isPiP: false
    };
  }
};
</script>

<style lang="scss">
// Uiza theme
@charset "UTF-8";

@font-face {
  font-family: "uiza";
  src:url("https://sdk.uiza.io/v4/assets/uzplayer-fonts-15/fonts/videojs-uiza-fonts-15.eot");
  src:url("https://sdk.uiza.io/v4/assets/uzplayer-fonts-15/fonts/videojs-uiza-fonts-15.eot?#iefix") format("embedded-opentype"),
    url("https://sdk.uiza.io/v4/assets/uzplayer-fonts-15/fonts/videojs-uiza-fonts-15.woff") format("woff"),
    url("https://sdk.uiza.io/v4/assets/uzplayer-fonts-15/fonts/videojs-uiza-fonts-15.ttf") format("truetype"),
    url("https://sdk.uiza.io/v4/assets/uzplayer-fonts-15/fonts/videojs-uiza-fonts-15.svg#videojs-uiza-fonts-15") format("svg");
  font-weight: normal;
  font-style: normal;

}
.fas2 {
  &:before {
    font-style: normal !important;
    font-family: "uiza";
    content: "\e009"!important;
    color: #eee;
    font-size: 1.3em !important;
  }
  
  &.fa-play:before {
    content: "\e009"!important;
  }
  &.fa-pause:before {
    content: "\e00a" !important;
  }
  &.fa-reward:before {
    content: "\e007" !important;
  }
  &.fa-forward:before {
    content: "\e008" !important;
  }
  &.fa-volume-up:before {
    content: "\e003" !important;
  }
  &.fa-volume-middle:before {
    content: "\e002" !important;
  }
  &.fa-volume-mute:before {
    content: "\e000" !important;
  }
  &.fa-cogs:before {
    content: "\e013" !important;
  }
  &.fa-pip:before {
    content: "\e011" !important;
  }
  &.fa-pip-off:before {
    content: "\e012" !important;
  }
  &.fa-fullscreen:before {
    content: "\e00c" !important;
  }
}

.uiza-player-controls {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  padding: 20px 10px 10px 10px;
  flex-direction: row;
  color: #fff;
  background: rgba(0, 0, 0, 0.3);
  > * {
    flex: 0 0 auto;
  }
  button {
    margin: 0 5px !important;
    padding: 0 !important;
    box-shadow: none !important;
    height: auto !important;
    background: transparent !important;
    border: none !important;
    outline: none !important;
    cursor: pointer;
    color: #fff;
    svg {
    }
  }
  &-volume {
    position: relative;
    &-slider {
      position: absolute;
      top: -76px;
      left: 14px;
    }
  }
  &-spacer {
    flex: 1;
  }
  &-progress {
    position: absolute;
    top: 0;
    left: 0; right: 0;
    margin: 0;
  }
  &-duration {
    margin-top: 1px;
    margin-left: 10px;
    font-size: 12px;
  }
  &-levels {
    margin-top: -2px;
    .bp-dropdown__body {
      button {
        margin: 4px 0 !important;
      }
    }
    svg {
      display: none !important;
    }
  }
  &-live {
    margin-top: -0 !important;
    margin-left: 10px !important;
    svg {
      color: red;
    }
    span {
      margin-left: 5px;
      font-size: 11px;
      font-weight: 500;
      color: #EEE;
      background: red;
      padding: 1px 5px;
      border-radius: 4px;
      cursor: pointer;
      &.inactive {
        background: #CCC;
      }
    }
  }
}
</style>