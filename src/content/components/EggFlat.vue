<template lang="pug">
div(class="uiza-egg" ref="main")
    div(v-if="showVoucher" class="uiza-egg-voucher" ref="voucher")
        div.uiza-egg-code(v-if="isCodeShown")
          button.uiza-egg-code-close(@click="close")
            i.far.fa-times-circle
          p Mã giảm giá của bạn (off 25%)
          input(readonly="readonly" value="FASHIONISTA")
          button.uiza-egg-code-use(@click="use") Use now
        div.uiza-egg-voucher-banner(v-if="showBanner")
            .uiza-egg-voucher-banner--only 
              .uiza-egg-voucher-banner--only-content Only for you
            button(v-if="!showAnimate" @click="clickMe") Click me
        img(v-if="!showAnimate" ref="image" :src="image" @load="onImageLoaded" @click="clickMe")
        img(v-if="showAnimate" :src="image_animate" style="transform: scale(2)")
</template>
<script>
export default {
  props: ["url"],
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const self = this;
      const targets = this.$refs.voucher;
      // eslint-disable-next-line no-unused-vars
      const targetImage = this.$refs.image;
      self.width = document.querySelector("#player").clientWidth;
      self.height = document.querySelector("#player").clientHeight;
      this.$anime
        .timeline()
        .add({
          targets,
          translateX: -(self.width / 2),
          translateY: -(self.height / 2),
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
          targets: targetImage,
          easing: "spring(1, 80, 10, 0)",
          scale: 2,
          complete: function(anim) {
            self.showBanner = true;
            // self.showAnimate = true;
            setTimeout(function() {
              // self.showBanner = false;
              // self.showVoucher = false;
            }, 10000);
          }
        });
    },
    onImageLoaded() {
      this.width = this.$refs.image.width;
      this.height = this.$refs.image.height;
    },
    buyNow() {
      var win = window.open(this.url, "_blank");
      win.focus();
    },
    clickMe() {
      const self = this;
      self.showAnimate = true;
      setTimeout(function() {
        self.isCodeShown = true;
      }, 4500);
    },
    close() {
      this.showVoucher = false;
    },
    use() {
      this.showVoucher = false;
      localStorage.setItem("UIZA_GIFT_CODE", "FASHIONISTA");
      this.$emit("used");
    }
  },
  data() {
    return {
      showVoucher: true,
      image: "https://www.upsieutoc.com/images/2019/06/14/egg-static.png",
      image_animate:
        "https://www.upsieutoc.com/images/2019/06/14/egg-animate.gif",
      showAnimate: false,
      width: 0,
      height: 0,
      showBanner: false,
      isCodeShown: false
    };
  }
};
</script>
<style lang="scss">
.uiza-egg {
  bottom: 0;
  right: -20px;
  position: absolute;

  &-code {
    margin-left: -50px;
    background: #fff;
    width: 140px;
    position: absolute;
    left: 0;
    top: -20px;
    padding: 10px;
    border-radius: 6px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);

    z-index: 10;
    &-close {
      position: absolute;
      top: 5px;
      right: 5px;
      border: none !important;
      cursor: pointer;
    }
    &-use {
      padding: 5px 10px;
      background: orange;
      color: #fff;
      width: 100%;
      box-sizing: border-box;
      margin-top: 10px !important;
      outline: none !important;
    }
    input {
      padding: 5px 10px;
      text-align: center;
      border: #555 1px dotted;
      width: 100%;
      box-sizing: border-box;
      font-weight: 600;
      outline: none !important;
    }
  }
  &-voucher {
    position: relative;
    display: inline-block;
    &-banner {
      position: absolute;
      width: 140px;
      left: -40px;
      top: -60px;
      // background: #fff;
      border-radius: 10px;
      padding: 5px 40px 5px 10px !important;
      text-align: center !important;
      &--only {
        white-space: nowrap;
        display: inline-block;
        background: orange;
        color: #fff;
        padding: 4px 10px;
        border-radius: 2px;
      }
      button {
        cursor: pointer;
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
        position: relative;
        margin-top: 40px !important;
        z-index: 1000;
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