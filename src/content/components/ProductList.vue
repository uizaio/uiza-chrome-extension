<template lang="pug">
.uiza-product-list
    .uiza-product-list-background
    .uiza-product-list-toggle(@click="close")
      i.fas.fa-times-circle
    carousel.uiza-product-list-swiper(:paginationEnabled="false" :navigationEnabled="true" navigationNextLabel="<i class='fas fa-chevron-right'></i>" navigationPrevLabel="<i class='fas fa-chevron-left'></i>" :perPage="10")
      slide.uiza-product-list-item(v-for="product in products" v-bind:key="product.id")
        img(:src='product.image')
        .uiza-product-list-item-desc
          h4.uiza-product-list-item-desc-title {{ product.name }}
          //- .price {{ product.price }}
          button.uiza-product-view(@click="view(product)") View product
</template>
<script>
import { Carousel, Slide } from "vue-carousel";

export default {
  props: ["products"],
  components: {
    Carousel,
    Slide
  },
  methods: {
    close() {
      this.$emit("close");
    },
    view(product) {
      this.$emit("view", product);
    }
  }
};
</script>
<style lang="scss">
.uiza-product-list {
  position: absolute;
  height: auto !important;
  bottom: 0;
  left: 0;
  right: 0;
  // background: rgba(0, 0, 0, 0.4);
  padding: 30px 0 60px 0;
  &-background {
    position: absolute;
    bottom: 50px;
    top: 0;
    left: 0;
    right: 0;
    background: linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.749) 0%,
      rgba(0, 0, 0, 0.749) 96.7%
    );
    // background: rgba(0, 0, 0, 0.7);
    // filter: blur(8px);
  }
  &-swiper {
    margin: 0 40px !important;
    .VueCarousel-navigation {
      button {
        outline: none !important;
        color: #ccc !important;
        svg {
          font-size: 30px;
        }
      }
    }
  }
  &-toggle {
    position: absolute;
    right: 10px;
    top: 10px;
    background: transparent !important;
    text-align: center;
    z-index: 99;
    cursor: pointer;
    svg {
      font-size: 14px;
      color: #999;
    }
  }
  &-item {
    width: 180px;
    min-width: 180px;
    height: 120px;
    margin: 0 5px;
    background: #fff;
    position: relative;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
    box-sizing: border-box !important;
    img {
      height: 100%;
      width: 100%;
      object-fit: cover;
    }
    &-desc {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      top: auto;
      padding: 10px;
      text-align: center;
      background: linear-gradient(
        to top,
        rgba(0, 0, 0, 0.85) 0%,
        rgba(0, 0, 0, 0) 100%
      );
      &-title {
        font-size: 12px;
        color: #fff !important;
        line-height: 15px !important;
        margin: 0 0 5px 0 !important;
        font-weight: 500 !important;
        overflow: hidden;
      }

      button.uiza-product-view {
        font-size: 12px !important;
        padding: 5px 7px !important;
        font-weight: 500 !important;
        color: #fff !important;
        cursor: pointer;
        background: transparent !important;
        border: #fff 1px solid;
        margin: 0 !important;
        margin-top: 5px !important;
        border-radius: 6px;
      }
    }
    .price {
      color: #ff0010;
      font-size: 12px !important;
      line-height: 12px !important;
      font-weight: 500 !important;
    }
  }
}
</style>