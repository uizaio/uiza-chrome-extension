<template lang="pug">
.uiza-player-controls
  //- Progress bar
  .uiza-player-controls-progress
    VueSlider(v-model="currentPos" :dot-size="3" :max="duration" @change="onProgressChanged" :processStyle="{ background: settings.color }")
      template(v-slot:process="{ start, end, style }")
        div(class="vue-slider-process custom-class" :style="[style]")
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
  //- Volume slider
  VueSlider(class="uiza-player-controls-volume-slider" v-model="currentVolume" :max="100" @change="onVolumeChanged" :processStyle="{ background: settings.color }")
  //- Live button
  div(v-if="isLive" @click="seekToLive" class="uiza-player-controls-live")
    span(:class="{ 'inactive': isLive && isSeeked }") Live
  //- Spacer
  div.uiza-player-controls-spacer
  //- Duration
  div(v-if="!isLive" class="uiza-player-controls-duration")
    span {{ formattedCurrentPos }}
    span /
    span {{ formattedDuration }}
  //- Qualities
  dropdown(align="top" v-if="qualities.length" :close-on-click="true")
    template(slot="btn")
      button(class="uiza-player-controls-levels")
        i.fas.fa-cogs
    template(slot="body")
      el-button(@click="onChangeQuality(item)" size="mini" v-for="item in qualities" v-bind:key="item.label" :disabled="selectedQuality && selectedQuality.label === item.label")
        | {{ item.label }}
  //- Fullscreen
  button.uiza-player-controls-fullscreen(@click="fullscreen" :style="{ color: settings.color }")
    i.fas.fa-compress
</template>

<script>
import VueSlider from "vue-slider-component";
import Dropdown from 'bp-vuejs-dropdown';

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
      console.log('time update', self.player.currentTime());
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
      qualities: [],
      selectedQuality: null
    };
  }
};
</script>

<style lang="scss">
.bp-dropdown {
  margin-top: -4px;
  &__btn {
    background-color: transparent !important;
    border: none !important;
    padding: 0 !important;
  }
  &__body {
    background-color: rgba(0, 0, 0, .6) !important;
    .el-button {
      display: block;
      margin: 0 !important;
    }
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
    margin-left: 10px;
    font-size: 12px;
  }
  &-live {
    margin-top: -4px;
    margin-left: 10px;
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