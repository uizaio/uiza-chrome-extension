<template lang="pug">
div.uiza-order(v-show="shown" :class="{ 'uiza-theme-flat': isFlat }")
  img(v-if="!isFlat" src="https://www.upsieutoc.com/images/2019/06/12/satelite.png" width="70")
  .uiza-order-text {{ orders }} orders completed in last 15 minutes
  button.uiza-order-close(@click="close")
      i.fas.fa-times-circle

</template>

<script>
export default {
  mounted() {
    const self = this;
    setInterval(function() {
      self.count += 1;
      if (!self.shown) {
        if (self.count === 20 || self.count % 60 === 0) {
          self.count = 0;
          self.orders += Math.floor(Math.random() * 10);
          self.shown = true;
          self.$anime
            .timeline()
            .add({
              targets: self.$el,
              left: "calc(50% - 130px)",
              easing: "easeInOutSine",
              duration: 2000,
              endDelay: 1000,
              direction: "alternate"
            })
            .add({
              targets: self.$el,
              translateX: 50,
              direction: "alternate",
              easing: "easeInOutSine"
            })
            .add({
              targets: self.$el,
              left: "-1000px",
              duration: 1000,
              easing: "easeInOutSine",
              complete: function() {
                self.shown = false;
              }
            });
        }
      }
    }, 1000);
  },
  methods: {
    close() {
      this.shown = false;
    }
  },
  data() {
    return {
      count: 0,
      orders: 7,
      shown: false,
      isFlat: true
    };
  }
};
</script>
<style lang="scss">
.uiza-order {
  &.uiza-theme-flat {
    background: rgba(29, 53, 87, 0.75) !important;
    margin: 0 !important;
    .uiza-order-text {
      margin-right: 20px;
    }
  }
  position: absolute;
  top: 20px;
  // left: calc(50% - 130px);
  left: calc(100% + 300px);
  margin-left: 30px;
  display: inline-block;
  padding: 10px 25px !important;
  background: linear-gradient(
    180deg,
    rgba(255, 156, 173, 0.75) 0%,
    rgba(255, 57, 92, 0.75) 100%
  );

  border-radius: 40px;
  img {
    position: absolute;
    left: -55px;
    top: 0;
  }
  &-text {
    color: #fff;
    text-align: center;
  }
  &-close {
    // display: none;
    position: absolute;
    top: 6px;
    right: 6px;
    border: none !important;
    background: transparent !important;
    cursor: pointer;
    svg {
      width: 18px !important;
      height: 18px !important;
    }
  }
}
</style>