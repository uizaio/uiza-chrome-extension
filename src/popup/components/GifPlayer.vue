<template lang="pug">
div.uiza-gif-player
    img(ref="image" :src="src" @load="onImageLoaded")
    canvas(ref="canvas")
</template>
<script>
export default {
  props: ["src"],
  mounted() {},
  methods: {
    onImageLoaded() {
      const width = this.$refs.image.width;
      const height = this.$refs.image.height;
      this.$refs.canvas.width = this.$refs.image.naturalWidth;
      this.$refs.canvas.height = this.$refs.image.naturalHeight;
      setTimeout(
        function() {
          let ctx = this.$refs.canvas.getContext("2d");
          ctx.drawImage(this.$refs.image, 0, 0, width, height);
        }.bind(this),
        0
      );
    }
  }
};
</script>
<style lang="scss">
.uiza-gif-player {
  position: relative;
  img {
    display: none !important;
    max-width: 100%;
  }
  canvas {
    max-width: 100%;
  }
  &:hover {
    img {
      display: inline-block !important;
    }
    canvas {
      display: none !important;
      opacity: 0;
    }
  }
}
</style>