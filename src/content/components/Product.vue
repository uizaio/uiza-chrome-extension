<template lang="pug">
.uiza-player-popup
  .uiza-player-popup-exit(@click="close")
    i.fas.fa-times
  .uiza-player-popup-content
    .uiza-player-popup-content-title {{ product.name }}
    .product-popup-image
        img(:src="product.image")
    .product-popup-content
      img(src="https://www.upsieutoc.com/images/2019/06/13/Screen-Shot-2019-06-13-at-12.36.03-AM.png" height="30")
      .price
        label Price
        span {{ product.promotion_price | currency }}
      p Tiết kiệm {{ discount }}% ({{ product.price - product.promotion_price | currency }})
      p Giá thị trường: {{ product.price | currency }}
      .desc {{ product.description }}
      //- .options
      //-   span Color:
      //-   ul.uiza-color-picker
      //-     li.uiza-color-picker-option(v-for="color in colors" v-bind:key="color" @click="selectColor(color)" :class="[ color, color === selectedColor ? 'active' : '' ]")
      //- .options
      //-   span Size:
      //-   ul.uiza-size-picker
      //-     li.uiza-color-picker-option(v-for="size in sizes" v-bind:key="size" @click="selectSize(size)" :class="[ size, size === selectedSize ? 'active' : '' ]")
      //-       | {{ size }}
      .product-popup-content-flex
        div
          strong Số lượng
          div.qty-selector
            button(@click="subQty") -
            input(v-model="quantity" readonly="readonly")
            button(@click="plusQty") +
        div
          strong Promotion Code
          div.promotion-code
            input(v-model="promotionCode")
        div
          strong Chỉ còn
          .final-price {{ finalPrice | currency }}
    .product-popup-footer
      a.product-popup-footer-btn.btn-add(@click="addToCart") Add to cart
      a(@click="goToCart" target="_blank" class="product-popup-footer-btn") Buy now

</template>

<script>
const UIZA_EXT_CART = "UIZA_EXT_CART";

export default {
  props: ["product", "settings"],
  mounted() {
    const coupon = localStorage.getItem("UIZA_GIFT_CODE");
    if (coupon) {
      this.promotionCode = coupon;
    }
  },
  methods: {
    close() {
      this.$emit("close");
    },
    selectColor(color) {
      this.selectedColor = color;
    },
    selectSize(size) {
      this.selectedSize = size;
    },
    subQty() {
      this.quantity = this.quantity > 1 ? this.quantity - 1 : this.quantity;
    },
    plusQty() {
      this.quantity += 1;
    },
    clearGiftCode() {
      localStorage.setItem("UIZA_GIFT_CODE", "");
    },
    addToCart() {
      this.clearGiftCode();
      this.$emit("cartChanged");
      let productsInCart = [];
      try {
        productsInCart = JSON.parse(localStorage.getItem(UIZA_EXT_CART)) || [];
      } catch (e) {}
      var existing = productsInCart.find(item => {
        return (
          item.product.id === this.product.id &&
          item.color === this.selectedColor
        );
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
    },
    goToCart() {
      this.clearGiftCode();
      var win = window.open(this.settings.cart_url, "_blank");
      win.focus();
    }
  },
  filters: {
    currency(value) {
      return value.toLocaleString() + "đ";
    }
  },
  computed: {
    discount() {
      return Math.floor(
        100 - (this.product.promotion_price / this.product.price) * 100
      );
    },
    finalPrice() {
      let total = this.quantity * this.product.promotion_price;
      if (this.promotionCode === "DECEMBERISCOMING") {
        total = Math.floor(0.85 * total);
      }
      return total;
    }
  },
  data() {
    return {
      colors: ["red", "green", "blue"],
      sizes: ["44mm", "32mm", "28mm"],
      selectedColor: "red",
      selectedSize: "32mm",
      quantity: 1,
      promotionCode: ""
    };
  }
};
</script>

<style lang="scss">
.uiza-player-popup {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 1);
  border: #999 1px solid;
  z-index: 100;
  overflow: auto;
  &-exit {
    position: absolute;
    right: 10px;
    top: 10px;
    color: #555;
    cursor: pointer;
    svg {
      font-size: 30px;
      margin-right: 10px;
    }
  }
  &-content {
    margin-top: 40px;
    &-title {
      font-size: 24px;
      margin: 10px 20px 0 45%;
    }
  }
}
.product-popup {
  padding: 20px;
}
.product-popup-image {
  width: 40%;
  margin-left: 10px;
  margin-top: -40px;
  float: left;
  img {
    object-fit: cover;
    max-width: 100%;
    width: 100%;
  }
}
.product-popup-content {
  padding-left: 45%;
  h4 {
    margin-top: 0;
    margin-bottom: 10px;
    font-size: 20px;
  }
  .price {
    label {
      font-weight: 500;
      font-size: 16px;
      line-height: 19px;
      color: #313131;
    }
    span {
      display: block;
      font-weight: bold;
      font-size: 28px;
      line-height: 33px;
      color: #f2994a;
    }
  }
  .options {
    margin-top: 10px;
  }
  .options span {
    display: inline-block;
    width: 50px;
    font-weight: 400;
    vertical-align: middle;
  }
  &-flex {
    display: flex;
    flex-direction: row;
    margin-top: 20px;
    > div {
      flex: 0 0 auto;
      margin-right: 15px;
      &:last-child {
        flex: 1;
      }
      > strong {
        display: block;
        margin-bottom: 10px;
      }
      .qty-selector {
        border: #ccc 1px solid;
        border-radius: 3px;
        display: flex;

        button {
          border: 0 !important;
          outline: none !important;
          font-size: 24px;
          cursor: pointer;
        }
        input {
          width: 30px;
          border: #ccc 1px solid !important;
          border-top: none !important;
          border-bottom: none !important;
          outline: none !important;
          font-size: 16px;
          line-height: 28px !important;
          text-align: center;
        }
      }
      .promotion-code {
        input {
          border: #ccc 1px solid !important;
          padding: 0 10px;
          font-size: 16px;
          line-height: 28px !important;
          max-width: 150px;
          border-radius: 3px;
          outline: none !important;
        }
      }
      .final-price {
        font-size: 28px;
        color: #f2994a;
      }
    }
  }
}
.uiza-color-picker,
.uiza-size-picker {
  list-style: none;
  padding-left: 0 !important;
  display: inline-block;
  vertical-align: middle;
}
.uiza-color-picker-option {
  display: inline-block;
  margin: 0 5px;
  width: 24px;
  height: 24px;
  border: transparent 3px solid;
  // box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
  &.green {
    background: green;
  }
  &.blue {
    background: blue;
  }
  &.red {
    background: red;
  }
  &.active {
    border-color: #fff;
  }
}
.uiza-size-picker {
  li {
    line-height: 24px !important;
    width: auto !important;
    padding: 0 6px;
    border: #999 1px solid;
    border-radius: 2px;
    &.active {
      color: #fff !important;
      background: #1d3557 !important;
      border-color: #1d3557 !important;
    }
  }
}
.product-popup-footer {
  padding-left: 45%;
  margin-top: 20px;
  text-align: right;
}
.product-popup-footer-btn {
  display: inline-block;
  text-align: center;
  cursor: pointer;
  background-image: none;
  border: none;
  height: 40px !important;
  line-height: 40px !important;
  color: #fff;
  background-color: #e5101d;
  border: #e5101d 1px solid !important;
  font-weight: 500;
  font-size: 18px;
  min-width: 30%;
  //Instead of the line below you could use @include border-radius($radius, $vertical-radius)
  border-radius: 3px;
  margin: 20px 20px 0 0;
  // box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
  text-decoration: none;
  &.btn-add {
    background-color: #fff;
    color: #000 !important;
    border: #000 1px solid !important;
  }
}
</style>