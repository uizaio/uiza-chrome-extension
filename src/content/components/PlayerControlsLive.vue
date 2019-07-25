<template lang="pug">
.uiza-player-controls
  //- Progress bar
  .uiza-player-controls-progress(@mousemove="progressHovering" @mouseleave="isSeekerShown = false" ref="progressBar")
    .uiza-player-controls-progress-seeker(v-if="isSeekerShown" :style="{ left: seekerCoord }") {{ seekerText }}
    //- :processStyle="{ background: settings.color }"
    VueSlider(v-model="currentPos" :dot-size="8" :height="2" tooltip="none" :max="duration" @change="onProgressChanged" :processStyle="{ background: settings.color }")
      template(v-slot:process="{ start, end, style }")
        div(class="vue-slider-process" :style="[style]")
  //-  Play button
  button.uiza-player-controls-play(v-show="!isPlaying" @click="play" :style="{ color: settings.color }")
    //- i.fas2.fa-play
    img(v-if="theme === 'Kute'" src="https://www.upsieutoc.com/images/2019/07/07/play.png")
    img(v-else src="https://www.upsieutoc.com/images/2019/06/14/player-play.png")
  button.uiza-player-controls-play(v-show="isPlaying" @click="pause" :style="{ color: settings.color }")
    //- i.fas2.fa-pause
    img(v-if="theme === 'Kute'" src="https://www.upsieutoc.com/images/2019/07/07/pause.png")
    img(v-else src="https://www.upsieutoc.com/images/2019/06/14/player-pause.png")
  
  //- Live button
  div(v-if="isLive" @click="seekToLive" class="uiza-player-controls-live")
    span(:class="{ 'inactive': (isLive && isSeeked) || !isPlaying }") &#183; Live
    //- img(v-if="isSeeked" src="https://www.upsieutoc.com/images/2019/06/14/player-live-grey.png")
    //- img(v-else src="https://www.upsieutoc.com/images/2019/06/14/player-live.png")
  //- Duration
  div(v-if="!isLive" class="uiza-player-controls-duration")
    span {{ formattedCurrentPos }}
    span /
    span {{ formattedDuration }}
  //- Spacer
  div.uiza-player-controls-spacer
  //- Volume button
  div.uiza-player-controls-volume(@mouseover="isVolumeShown = true" @mouseleave="transitVolumeHide")
    button(v-show="currentVolume === 100" @click="mute" :style="{ color: settings.color }")
      //- i.fas2.fa-volume-up
      img(v-if="theme === 'Kute'" src="https://www.upsieutoc.com/images/2019/07/07/volume.png")
      img(v-else src="https://www.upsieutoc.com/images/2019/06/14/plyaer-volume.png")
    button(v-show="currentVolume > 0 && currentVolume < 100" @click="mute" :style="{ color: settings.color }")
      //- i.fas2.fa-volume-middle
      img(v-if="theme === 'Kute'" src="https://www.upsieutoc.com/images/2019/07/07/volume.png")
      img(v-else src="https://www.upsieutoc.com/images/2019/06/14/player-volume-middle.png")
    button(v-show="currentVolume === 0" @click="unmute" :style="{ color: settings.color }")
      //- i.fas2.fa-volume-mute
      img(v-if="theme === 'Kute'" src="https://www.upsieutoc.com/images/2019/07/07/mute.png")
      img(v-else src="https://www.upsieutoc.com/images/2019/06/14/player-volume-mute.png")
    //- Volume slider
    div(class="uiza-player-controls-volume-slider" @mouseover.stop="transitVolumeShow" @mouseleave.stop="transitVolumeHide" v-if="isVolumeShown")
      //-  :processStyle="{ background: settings.color }"
      VueSlider(direction="btt" :height="50" :dotSize="8" v-model="currentVolume" :max="100" @change="onVolumeChanged")
  //- Qualities
  button.uiza-player-controls-levels(v-if="qualities.length && qualities.length > 1" @click="isQualitiesShown = !isQualitiesShown" :style="{ color: settings.color }")
    //- i.fas2.fa-cogs
    img(v-if="theme === 'Kute'" src="https://www.upsieutoc.com/images/2019/07/07/settings.png")
    img(v-else src="https://www.upsieutoc.com/images/2019/06/14/player-settings.png")
    .uiza-player-controls-levels-popup(v-if="isQualitiesShown")
      el-button(v-on:click.stop="onChangeQuality(item)" size="mini" v-for="item in qualities" v-bind:key="item.label" :disabled="selectedQuality && selectedQuality.label === item.label")
        | {{ item.label }}
  //- PIP
  template(v-if="theme === 'Kute'")
      button(v-if="!isPiP" @click="requestPIP")
        img(src="https://www.upsieutoc.com/images/2019/07/07/pip.png")
      button(v-if="isPiP" @click="exitPIP")
        img(src="https://www.upsieutoc.com/images/2019/07/07/pip.png")
  template(v-else)
    button(v-if="!isPiP" @click="requestPIP")
      i.fas2.fa-pip
    button(v-if="isPiP" @click="exitPIP")
      i.fas2.fa-pip-off
  //- Fullscreen
  button.uiza-player-controls-fullscreen(@click="fullscreen" :style="{ color: settings.color }")
    //- i.fas2.fa-fullscreen
    img(v-if="theme === 'Kute'" src="https://www.upsieutoc.com/images/2019/07/07/zoom-in.png")
    img(v-else src="https://www.upsieutoc.com/images/2019/06/14/player-fullscreen.png")
</template>

<script>
import VueSlider from "vue-slider-component";
import EventBus from "../EventBus";

export default {
  props: ["player", "isLive", "settings", "theme"],
  components: {
    VueSlider
  },
  mounted() {
    const self = this;
    this.player.on("play", () => {
      self.isPlaying = true;
    });
    this.player.on("pause", () => {
      self.isPlaying = false;
    });
    this.player.on("durationchange", val => {
      // get duration in miliseconds
      self.duration = Math.floor(
        self.player.duration() ? self.player.duration() * 1000 : 0
      );
    });
    this.player.on("volumechange", () => {
      self.currentVolume = self.player.volume() * 100;
    });
    this.player.on("timeupdate", val => {
      self.currentPos = Math.floor(self.player.currentTime() * 1000);
    });
    this.player.on("qualitieschange", () => {
      self.qualities = self.player.qualities();
      if (self.qualities.length) {
        self.selectedQuality = self.qualities[0];
      }
    });
  },
  methods: {
    progressHovering(event) {
      if (this.duration > 0) {
        const x = event.offsetX;
        const width = this.$refs.progressBar.offsetWidth;
        if (width > 0) {
          const percentage = x / width;
          const mousePoint = this.millisToMinutesAndSeconds(
            percentage * this.duration
          );
          this.seekerText = mousePoint;
          this.seekerCoord = x + "px";
          this.isSeekerShown = true;
        }
      }
    },
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
      const change = Math.min(
        Math.abs(this.player.duration() - this.player.currentTime()),
        10
      );
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
      this.transitVolumeTimeout = setTimeout(
        function() {
          this.isVolumeShown = false;
        }.bind(this),
        1000
      );
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
      this.isQualitiesShown = false;
      this.selectedQuality = item;
      const index = this.qualities.indexOf(item);
      this.player.currentLevel(index);
    },
    requestPIP() {
      this.isPiP = true;
      EventBus.$emit("onTogglePIP", true);
    },
    exitPIP() {
      this.isPiP = false;
      EventBus.$emit("onTogglePIP", false);
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
      isSeekerShown: false,
      seekerText: "",
      seekerCoord: 0,
      isSeeked: false,
      currentPos: 0,
      duration: 0,
      currentVolume: 100,
      isVolumeShown: false,
      transitVolumeTimeout: null,
      qualities: [],
      isQualitiesShown: false,
      selectedQuality: null,
      isPiP: false
    };
  }
};
</script>

<style lang="scss">
// Uiza theme
@charset "UTF-8";
@import "~vue-slider-component/lib/theme/default.scss";
@font-face {
  font-family: "uiza";
  src: url("https://sdk.uiza.io/v4/assets/uzplayer-fonts-15/fonts/videojs-uiza-fonts-15.eot");
  src: url("https://sdk.uiza.io/v4/assets/uzplayer-fonts-15/fonts/videojs-uiza-fonts-15.eot?#iefix")
      format("embedded-opentype"),
    url("https://sdk.uiza.io/v4/assets/uzplayer-fonts-15/fonts/videojs-uiza-fonts-15.woff")
      format("woff"),
    url("https://sdk.uiza.io/v4/assets/uzplayer-fonts-15/fonts/videojs-uiza-fonts-15.ttf")
      format("truetype"),
    url("https://sdk.uiza.io/v4/assets/uzplayer-fonts-15/fonts/videojs-uiza-fonts-15.svg#videojs-uiza-fonts-15")
      format("svg");
  font-weight: normal;
  font-style: normal;
}
.fas2 {
  &:before {
    font-style: normal !important;
    font-family: "uiza";
    content: "\e009" !important;
    color: #eee;
    font-size: 20px !important;
  }

  &.fa-play:before {
    content: "\e009" !important;
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
  padding: 18px 10px 10px 10px;
  flex-direction: row;
  color: #fff;
  height: 50px !important;
  box-sizing: border-box !important;
  z-index: 99999;
  background: linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.749) 0%,
    rgba(0, 0, 0, 0.749) 96.7%
  );
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
    img {
      width: 18px;
    }
  }
  &-volume {
    position: relative;
    &-slider {
      position: absolute;
      top: -76px;
      left: 7px;
    }
  }
  &-spacer {
    flex: 1;
  }
  &-progress {
    position: absolute;
    top: -5px;
    left: 0;
    right: 0;
    margin: 0;
    .vue-slider-dot-handle {
      &:before,
      &:after {
        content: "";
        position: absolute;
        border-radius: 100%;
        z-index: -1;
      }
      &:before {
        top: -7px;
        left: -7px;
        background: rgba(230, 57, 70, 0.2);
        width: 22px;
        height: 22px;
      }
      &:after {
        top: -3px;
        left: -3px;
        background: rgba(230, 57, 70, 0.5);
        width: 14px;
        height: 14px;
      }
    }
    &-seeker {
      position: absolute;
      bottom: 15px;
      font-size: 14px;
      white-space: nowrap;
      padding: 6px 8px;
      min-width: 60px;
      box-sizing: border-box;
      text-align: center;
      color: #fff;
      border-radius: 5px;
      border-color: rgba(0, 0, 0, 0.75);
      background-color: rgba(0, 0, 0, 0.75);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      transform: scale(0.9) translateX(-30px);
      transition: transform 0.3s;
      &:after {
        top: 100%;
        left: 50%;
        transform: translate(-50%, 0);
        height: 0;
        width: 0;
        border-color: transparent;
        border-style: solid;
        border-width: 5px;
        border-top-color: inherit;
        content: "";
        position: absolute;
      }
    }
  }
  &-duration {
    margin-top: 1px;
    margin-left: 10px;
    font-size: 12px;
  }
  &-levels {
    position: relative;
    &-popup {
      position: absolute;
      bottom: 43px;
      left: -15px;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 6px;
      padding: 10px 3px;
      z-index: 10;
      .el-button {
        display: block;
        margin: 0 !important;
        padding: 3px !important;
      }
    }
  }
  &-live {
    margin-top: 2px !important;
    margin-left: 10px !important;
    svg {
      color: red;
    }
    span {
      font-size: 11px;
      font-weight: 500;
      color: #eee;
      background: red;
      padding: 3px 10px 3px 6px;
      border-radius: 2px;
      text-transform: uppercase;
      cursor: pointer;
      &.inactive {
        background: #ccc;
      }
    }
  }
}
</style>