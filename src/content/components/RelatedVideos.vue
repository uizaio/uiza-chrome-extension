<template lang="pug">
div(class="uiza-ext-player-ended")
    .uiza-ext-player-ended-exit(@click="close()")
      i.fas.fa-times
    h4 Related videos
    div.uiza-related
        div.uiza-related-item(@click="openVideo(item)" v-for="item in videos" v-bind:key="item.id" :style="{ backgroundImage: item.image ? `url(${item.image})` : 'url(https://dashboard.uiza.io/assets/img/image-not-available.jpg)' }")
          .uiza-related-item-title {{ item.name }}
</template>

<script>
import axios from "axios";

export default {
  props: ["params", "api", "chromeUrl"],
  mounted() {
    console.log(this.params, this.chromeUrl, "fasfasf");
    axios
      .get(
        "https://ap-southeast-1-api.uiza.co/api/public/v4/media/entity?appId=" +
          this.params.appId +
          "&limit=7",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: atob(this.params.api)
          }
        }
      )
      .then(resp => {
        this.videos = resp.data.data.filter(x => x.id !== this.params.entityId);
      });
  },
  methods: {
    close() {
      this.$emit("close");
    },
    openVideo(item) {
      const url = this.chromeUrl + "#/play/vod/" + item.id;
      var win = window.open(url, "_blank");
      win.focus();
    }
  },
  data() {
    return {
      videos: []
    };
  }
};
</script>
<style lang="scss">
.uiza-ext-player-ended {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: center;
  background: rgba(0, 0, 0, 0.5);
  border: #ccc 1px solid;
  &-exit {
    position: absolute;
    right: 10px;
    top: 10px;
    color: #fff;
    cursor: pointer;
    svg {
      font-size: 30px;
      margin-right: 10px;
    }
  }
  h4 {
    font-size: 24px;
    color: #fff;
    margin: 10px 10px 10px 20px;
  }
}
.uiza-related {
  flex: 1;
  width: 100%;
  display: grid;
  grid-template-columns: auto auto auto;
  padding: 10px;
  box-sizing: border-box;
  &-item {
    flex: 0 0 50%;
    max-height: 200px;
    position: relative;
    background-color: rgba(255, 255, 255, 0.8);
    background-size: cover;
    background-position: center;
    border: 1px solid rgba(0, 0, 0, 0.8);
    margin: 10px;
    font-size: 30px;
    text-align: center;
    cursor: pointer;
    &-title {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      color: #fff;
      text-shadow: #555 1px 1px;
      font-size: 14px;
      padding: 20px;
      background: linear-gradient(
        to top,
        rgba(0, 0, 0, 0.85) 0%,
        rgba(0, 0, 0, 0) 100%
      );
    }
  }
}
</style>