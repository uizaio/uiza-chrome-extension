<template lang="pug">
.uiza-giftbox(v-if="notTaken")
  .uiza-giftbox-image(v-if="!isClockShown")
    img(v-if="theme === 'Kute'" src="https://www.upsieutoc.com/images/2019/07/07/gift.png" @click="showClock")
    img(v-else src="https://media.giphy.com/media/QWcxHrF7LCb7yBf4kO/giphy.gif" @click="showClock")
    div(v-if="codeAvailable" class="uiza-giftbox-image-countdown")
      i.far.fa-clock 
      | {{ formattedCodeAvailableCountdown }}
  div.uiza-giftbox-wrapper.animated.infinite-no.shake(v-else)
    button.uiza-giftbox-wrapper-close(@click="isClockShown = false")
      i.far.fa-times-circle
    div(v-if="!codeAvailable")
      img(src="https://www.upsieutoc.com/images/2019/07/07/info.png" width="30")
      div.label Gift opens in
      div.countdown
        img(src="https://www.upsieutoc.com/images/2019/07/07/clock4e8ed0bbdfbd19df.png")
        span(class="animated-no infinite-no heartBeat") {{ countdown }}s
    div(v-if="theme === 'Kute'" v-show="codeAvailable")
      img(class="opened-gift" src="https://www.upsieutoc.com/images/2019/07/07/gift-opened.png")
      h4 You got a Super Code
      div.uiza-giftbox-code
        div 
          strong 40%
          div Discount
        input(value="DECEMBERISCOMING")
      div.uiza-giftbox-footer
        button.uiza-giftbox-footer-take(@click="buyNow") Use Now
    div(v-else v-show="codeAvailable")
      h4 You got a Super Code
      div.uiza-giftbox-code
        img(src="https://localcoinatm.com/wp-content/uploads/2018/09/300x300-Discount-Icon-01.png")
        input(value="DECEMBERISCOMING")
        div 
          div Discount
          strong 40%
      div.uiza-giftbox-footer
        div.uiza-giftbox-footer-countdown
          i.far.fa-clock
          span(class="countdown animated-no infinite-no heartBeat") Code is available in {{ formattedCodeAvailableCountdown }}s
        button.uiza-giftbox-footer-take(@click="buyNow") Use Now
</template>
<script>
import { setInterval, clearInterval } from "timers";
import * as moment from "moment";

const initialData = function() {
  return {
    notTaken: true,
    isClockShown: false,
    countDownInterval: null,
    countdown: 5,
    codeAvailable: false,
    codeAvailableInterval: null,
    codeAvailableCountdown: 900
  };
};

export default {
  props: ["url", "theme"],
  mounted() {},
  methods: {
    showClock() {
      this.isClockShown = true;
      if (this.countDownInterval === null) {
        this.countDownInterval = setInterval(
          function() {
            this.countdown -= 1;
            if (this.countdown <= 0) {
              clearInterval(this.countDownInterval);
              this.countdown = 30;
              setTimeout(
                function() {
                  this.showCoupon();
                }.bind(this),
                0
              );
            }
          }.bind(this),
          1000
        );
      }
    },
    showCoupon() {
      this.codeAvailable = true;
      if (this.codeAvailableInterval === null) {
        this.codeAvailableInterval = setInterval(
          function() {
            this.codeAvailableCountdown -= 1;
            if (this.codeAvailableCountdown <= 0) {
              this.codeAvailable = false;
              this.codeAvailableCountdown = 900;
              clearInterval(this.codeAvailableInterval);
            }
          }.bind(this),
          1000
        );
      }
    },
    buyNow() {
      clearInterval(this.codeAvailableInterval);
      Object.assign(this.$data, initialData());
      localStorage.setItem("UIZA_GIFT_CODE", "DECEMBERISCOMING");
      this.$emit("used");
      // var win = window.open(this.url, "_blank");
      // win.focus();
    }
  },
  computed: {
    formattedCodeAvailableCountdown() {
      const time = moment("2015-01-01")
        .startOf("day")
        .seconds(this.codeAvailableCountdown)
        .format("mm:ss");
      return time;
    }
  },
  data() {
    return initialData();
  }
};
</script>
<style lang="scss">
.uiza-giftbox {
  position: absolute;
  right: 10px;
  bottom: 160px;
  &-image {
    width: 50px;
    height: 50px;
    border-radius: 100%;
    background: linear-gradient(180deg, #84c6ec 0%, #0b75b1 100%);
    img {
      position: absolute;
      top: -20px;
      left: -15px;
      width: 80px;
      cursor: pointer;
    }
    &-countdown {
      text-align: center;
      color: #fff;
      text-shadow: #000 1px 1px;
      position: relative;
      padding-top: 20px;
      pointer-events: none !important;
    }
  }
  &-wrapper {
    background: #fff;
    padding: 10px 30px;
    border-radius: 3px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
    text-align: center;
    position: relative;
    &-close {
      position: absolute;
      right: 0;
      top: 2px;
      border: 0 !important;
      outline: none !important;
      background: transparent !important;
      cursor: pointer;
      svg {
        font-size: 14px;
      }
    }
    .label {
      margin-bottom: 10px;
    }
    .countdown {
      span {
        margin-left: 10px;
        color: red;
        font-size: 14px;
        font-weight: 600;
      }
    }
  }
  &-code {
    display: flex;
    img {
      width: 40px;
      height: 40px;
    }
    input {
      flex: 1;
      padding: 10px;
      margin: 0 5px 0 10px;
      outline: none;
      border: #000 2px dotted;
      font-size: 14px;
      font-weight: 600;
    }
    button {
      border: 0 !important;
      outline: 0 !important;
      color: #fff !important;
      background: #000 !important;
    }
    div {
      strong {
        font-size: 20px;
      }
    }
  }
  &-footer {
    display: flex;
    margin: 20px 0 5px 0;
    &-countdown {
      line-height: 30px !important;
      span {
        margin-left: 10px;
      }
    }
    &-take {
      flex: 1;
      margin: 0 0 0 10px !important;
      background: #000 !important;
      color: #fff !important;
      outline: none;
      padding: 10px 0;
      cursor: pointer;
    }
  }
}
</style>