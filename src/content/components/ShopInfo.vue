<template lang="pug">
.uiza-shop-info
    img(src="https://www.upsieutoc.com/images/2019/06/15/shop-logo.png")
    .uiza-shop-info-name Shop Name
</template>
<script>
export default {};
</script>
<style lang="scss">
.uiza-shop-info {
  position: absolute;
  left: 20px;
  top: 20px;
  display: flex;
  align-items: center;
  img {
    width: 40px !important;
  }
  &-name {
    margin-left: 10px;
    color: #fff;
    font-size: 14px !important;
    font-weight: 500 !important;
  }
}
</style>