<template lang="pug">
div.uiza-order(v-if="shown")
    .uiza-order-text {{ count }} orders completed in last 15 minutes
    button.uiza-order-close(@click="close")
        i.fas.fa-times-circle

</template>

<script>
export default {
  props: ["count"],
  methods: {
    close() {
      this.shown = false;
    }
  },
  data() {
    return {
      shown: true
    };
  }
};
</script>
<style lang="scss">
.uiza-order {
  position: absolute;
  top: 20px;
  left: calc(50% - 130px);
  width: 220px;
  padding: 10px 40px 10px 10px;
  background: rgba(67, 84, 108, 0.8);
  border-radius: 40px;
  &-text {
    color: #88cf81;
    text-align: center;
  }
  &-close {
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