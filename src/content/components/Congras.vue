<template lang="pug">
div.uiza-congras(ref="congras")
    img(:src="data.gif")
</template>

<script>
export default {
  props: ["data"],
  mounted() {
    // var particles = ['.blob', '.star'];
    // var $congras = this.$refs.congras;
    // var $title = this.$refs.title;
  }
};
</script>

<style lang="scss">
.uiza-congras {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 99999;
  pointer-events: none;
  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: cover;
  }
}
</style>