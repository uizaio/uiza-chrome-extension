<template lang="pug">
.uiza-shop-info
    img(src="https://www.upsieutoc.com/images/2019/07/07/avatar.png")
    .uiza-shop-info-name ABC SHOP
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