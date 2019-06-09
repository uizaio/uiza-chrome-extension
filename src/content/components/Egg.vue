<template lang="pug">
div(id="uiza-egg" ref="main")
    img(ref="image" :src="image" @load="onImageLoaded")
    canvas(ref="canvas" :width="width" :height="height")
</template>
<script>
export default {
  mounted() {
    this.init();
  },
  methods: {
    init() {},
    onImageLoaded() {
      console.log(this.$refs.image.width);
      this.width = this.$refs.image.width;
      this.height = this.$refs.image.height;
      setTimeout(
        function() {
          let ctx = this.$refs.canvas.getContext("2d");
          ctx.drawImage(this.$refs.image, 0, 0, this.width, this.height);
        }.bind(this),
        1600
      );
    }
  },
  data() {
    return {
      image: "https://media.giphy.com/media/YMdnN8vXmwefpxZAAs/giphy.gif",
      width: 0,
      height: 0
    };
  }
};
</script>
<style lang="scss">
#uiza-egg {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  img {
    max-width: 70px;
  }
}
</style>