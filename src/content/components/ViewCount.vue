<template lang="pug">
.uiza-view-count
    i.fas.fa-eye
    span {{ views }} views
</template>
<script>
export default {
  mounted() {
    setInterval(
      function() {
        const min = -5;
        const random = Math.floor(Math.random() * (10 - min + 1) + min);
        const total = this.views + random;
        if (total > 0) {
          this.views += random;
        }
      }.bind(this),
      1000
    );
  },
  data() {
    return {
      views: 1
    };
  }
};
</script>
<style lang="scss">
.uiza-view-count {
  color: #fff !important;
  position: absolute;
  top: 20px;
  right: 80px;
  margin: 10px 20px;
  padding: 6px 10px !important;
  border-radius: 30px !important;
  background: rgba(81, 86, 89, 0.5);
  span {
    margin-left: 10px !important;
  }
}
</style>