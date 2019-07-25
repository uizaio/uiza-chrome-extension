<template lang="pug">
.uiza-product-overlay
    div
      .uiza-product-overlay-image
        img(:src="product.image")
      .uiza-product-overlay-wrapper
        .uiza-product-overlay-name {{ product.name }}
        div
          a.uiza-product-overlay-cart.uiza-product-view(@click="addToCart") Add to cart
</template>

<script>
const UIZA_EXT_CART = "UIZA_EXT_CART";

export default {
  props: ["product"],
  methods: {
    addToCart() {
      let productsInCart = [];
      try {
        productsInCart = JSON.parse(localStorage.getItem(UIZA_EXT_CART)) || [];
      } catch (e) {}
      var existing = productsInCart.find(item => {
        return item.product.id === this.product.id;
      });
      if (existing) {
        existing.quantity += 1;
      } else {
        productsInCart.push({
          product: this.product,
          color: this.selectedColor,
          quantity: 1
        });
      }
      localStorage.setItem(UIZA_EXT_CART, JSON.stringify(productsInCart));
      this.$emit("cartAdded");
    }
  }
};
</script>
<style lang="scss">
.uiza-product-overlay {
  //Instead of the line below you could use @include transform($scale, $rotate, $transx, $transy, $skewx, $skewy, $originx, $originy)
  transform: scale(1);
  position: absolute;
  top: 80px;
  right: 80px;
  width: 240px;
  padding: 10px;
  //Instead of the line below you could use @include border-radius($radius, $vertical-radius)
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.2);
  color: #fff;
  overflow: hidden;
  &-image {
    width: 50px;
    height: 70px;
    float: left;
    img {
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
  }
  &-wrapper {
    padding-left: 60px;
  }
  &-name {
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 10px;
  }
  &-cart {
    background: orange;
    color: #fff;
    font-weight: 600;
    font-size: 13px;
    text-align: center;
    cursor: pointer;
    //Instead of the line below you could use @include border-radius($radius, $vertical-radius)
    border-radius: 4px;
    display: inline-block;
    padding: 4px 10px;
    text-decoration: none;
  }
}
</style>