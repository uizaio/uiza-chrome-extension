<template lang="pug">
div.uiza-order(v-show="shown" :class="{ 'uiza-theme-flat': isFlat }")
  img(v-if="!isFlat" src="https://www.upsieutoc.com/images/2019/06/12/satelite.png" width="70")
  .uiza-order-text 
    span(ref="numberElement") {{ orders }} &nbsp;
    | orders completed in last 15 minutes
  button.uiza-order-close(@click="close")
      i.far.fa-times-circle

</template>

<script>
export default {
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const self = this;
      self.$anime.timeline().add({
        targets: self.$el,
        left: "calc(50% - 150px)",
        easing: "easeInOutSine",
        duration: 2000,
        endDelay: 1000,
        direction: "alternate"
      });
      setInterval(function() {
        self.count += 1;
        self.orders += Math.floor(Math.random() * 10);
        self.$anime
          .timeline()
          .add({
            targets: self.$refs.numberElement,
            color: "#FFF",
            scale: 2,
            duration: 500,
            direction: "alternate",
            easing: "easeInOutSine"
          })
          .add({
            targets: self.$refs.numberElement,
            color: "#94e389",
            scale: 1,
            duration: 2000,
            direction: "alternate",
            easing: "easeInOutSine"
          });
      }, 5000);
    },
    init2() {
      const self = this;
      setInterval(function() {
        self.count += 1;
        if (self.count % 5 === 0) {
          self.shown = true;
          self.orders += Math.floor(Math.random() * 10);
          self.$anime
            .timeline()
            .add({
              targets: self.$el,
              left: "calc(100% + 300px)",
              easing: "easeInOutSine",
              duration: 2000,
              endDelay: 1000,
              direction: "alternate"
            })
            .add({
              targets: self.$el,
              left: "calc(50% - 150px)",
              easing: "easeInOutSine",
              duration: 2000,
              endDelay: 1000,
              direction: "alternate"
            })
            .add({
              targets: self.$el,
              left: "-1000px",
              duration: 1000,
              easing: "easeInOutSine",
              complete: function() {
                setTimeout(function() {
                  self.shown = false;
                }, 3000);
              }
            });
        }
      }, 1000);
    },
    close() {
      this.shown = false;
    }
  },
  data() {
    return {
      count: 0,
      orders: 7,
      shown: true,
      isFlat: true
    };
  }
};
</script>
<style lang="scss">
.uiza-order {
  &.uiza-theme-flat {
    background: rgba(29, 53, 87, 0.75);
    margin: 0 !important;
    .uiza-order-text {
      margin-right: 20px;
      color: #94e389;
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
    span {
      display: inline-block;
    }
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