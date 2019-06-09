<template lang="pug">
div(class="uiza-egg" ref="main")
    div(v-if="showVoucher" class="uiza-egg-voucher" ref="voucher")
        div.uiza-egg-voucher-banner(v-if="showBanner")
            h4 Only for you
            button Buy now
        img(ref="image" :src="image" @load="onImageLoaded")
</template>
<script>
export default {
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const self = this;
      const targets = this.$refs.voucher;
      // eslint-disable-next-line no-unused-vars
      const targetImage = this.$refs.image;
      self.width = this.$refs.main.clientWidth;
      self.height = this.$refs.main.clientHeight;
      this.$anime
        .timeline()
        .add({
          targets,
          translateX: (self.width - 70) / 2,
          easing: "easeInOutSine",
          duration: 2000,
          endDelay: 1000,
          direction: "alternate"
        })
        .add({
          targets,
          rotate: 360,
          duration: 800,
          easing: "easeInOutSine"
        })
        .add({
          targets,
          translateY: self.height - 160,
          easing: "easeOutExpo",
          duration: 2000
        })
        .add({
          targets,
          translateX: 30,
          rotate: 0,
          easing: "easeOutExpo",
          duration: 500
        })
        .add({
          targets: targetImage,
          easing: "spring(1, 80, 10, 0)",
          scale: 2,
          complete: function(anim) {
            self.showBanner = true;
            setTimeout(function() {
              self.showBanner = false;
              self.showVoucher = false;
            }, 10000);
          }
        });
    },
    onImageLoaded() {
      this.width = this.$refs.image.width;
      this.height = this.$refs.image.height;
      //   setTimeout(
      //     function() {
      //       let ctx = this.$refs.canvas.getContext("2d");
      //       ctx.drawImage(this.$refs.image, 0, 0, this.width, this.height);
      //     }.bind(this),
      //     1600
      //   );
    }
  },
  data() {
    return {
      image: "https://media.giphy.com/media/YMdnN8vXmwefpxZAAs/giphy.gif",
      width: 0,
      height: 0,
      showBanner: false,
      showVoucher: true
    };
  }
};
</script>
<style lang="scss">
.uiza-egg {
  top: 100px;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  &-voucher {
    position: relative;
    display: inline-block;
    &-banner {
      position: absolute;
      right: -140px;
      top: -30px;
      background: #fff;
      border-radius: 10px;
      padding: 5px 10px 5px 40px !important;
      text-align: right !important;
      button {
        margin-left: 0;
        border-radius: 3px;
        border-color: transparent;
        transition: all 300ms ease;
        letter-spacing: 1px;
        font-weight: 600;
        font-size: 20px !important;
        color: #fff !important;
        background: #6249fc !important;
        animation: blinker 1s linear infinite;
      }
    }
    img {
      max-width: 70px;
    }
  }
}
@keyframes blinker {
  50% {
    opacity: 0;
  }
}
</style>