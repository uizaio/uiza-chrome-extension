<template lang="pug">
.uiza-player-controls
  //-  Play button
  button.uiza-player-controls-play(v-show="!isPlaying" @click="play" :style="{ color: settings.color }")
    i.fas.fa-play
  button.uiza-player-controls-play(v-show="isPlaying" @click="pause" :style="{ color: settings.color }")
    i.fas.fa-pause
  //- Volume button
  button.uiza-player-controls-volume(v-show="currentVolume > 0" @click="mute" :style="{ color: settings.color }")
    i.fas.fa-volume-up
  button.uiza-player-controls-volume(v-show="currentVolume <= 0" @click="unmute" :style="{ color: settings.color }")
    i.fas.fa-volume-mute
  VueSlider(class="uiza-player-controls-volume-slider" v-model="currentVolume" :max="100" @change="onVolumeChanged" :processStyle="{ background: settings.color }")
  //- Progress bar
  .uiza-player-controls-progress
    VueSlider(v-if="!isLive" v-model="currentPos" :max="duration" @change="onProgressChanged" :processStyle="{ background: settings.color }")
  div(v-if="!isLive" class="uiza-player-controls-duration")
    span {{ formattedCurrentPos }}
    span /
    span {{ formattedDuration }}
  div(v-if="isLive" class="uiza-player-controls-live")
    //- i.far.fa-dot-circle
    span Live
  el-dropdown(v-if="qualities.length" placement="top" size="mini" @command="onChangeQuality")
    button(class="uiza-player-controls-levels" )
      i.fas.fa-cogs
    el-dropdown-menu(slot="dropdown")
      el-dropdown-item(v-for="item in qualities" v-bind:key="item.label" :command="item" :disabled="selectedQuality && selectedQuality.label === item.label")
        | {{ item.label }}
  button.uiza-player-controls-fullscreen(@click="fullscreen" :style="{ color: settings.color }")
    i.fas.fa-compress
</template>

<script>
import VueSlider from "vue-slider-component";

export default {
  props: ["player", "isLive", "settings"],
  components: {
    VueSlider
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
      console.log("fasfasf", self.qualities);
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
      this.player.play();
    },
    pause() {
      this.player.pause();
    },
    mute() {
      this.player.volume(0);
    },
    unmute() {
      this.player.volume(1);
    },
    onVolumeChanged() {
      this.player.volume(this.currentVolume / 100);
    },
    onProgressChanged() {
      this.player.currentTime(this.currentPos / 1000);
      this.player.pause();
    },
    onChangeQuality(item) {
      this.selectedQuality = item;
      const index = this.qualities.indexOf(item);
      this.player.currentLevel(index);
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
      currentPos: 0,
      duration: 0,
      currentVolume: 100,
      qualities: [],
      selectedQuality: null
    };
  }
};
</script>

<style lang="scss">
.uiza-player-controls {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  padding: 10px;
  flex-direction: row;
  color: #fff;
  background: rgba(0, 0, 0, 0.3);
  > * {
    flex: 0 0 auto;
  }
  button {
    margin: 0 5px;
    background: transparent !important;
    border: none !important;
    outline: none !important;
    cursor: pointer;
    color: #fff;
    svg {
    }
  }
  &-volume {
    &-slider {
      flex: 0 0 60px;
    }
  }
  &-progress {
    flex: 1;
    margin: 0 0 0 20px;
  }
  &-duration {
    margin-left: 10px;
    font-size: 12px;
  }
  &-live {
    svg {
      color: red;
    }
    span {
      margin-left: 5px;
      font-size: 12px;
      font-weight: 800;
      color: red;
    }
  }
}
</style>