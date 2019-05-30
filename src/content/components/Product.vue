<template lang="pug">
.uiza-player-popup
  .uiza-player-popup-exit(@click="close")
    i.far.fa-times-circle
  .uiza-player-popup-content
    .product-popup
    .product-popup-image
        img(:src="product.image")
    .product-popup-content
        h4 {{ product.name }}
        .desc
        | Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...
        .options
        span Select color
        ul.uiza-color-picker
            li.uiza-color-picker-option(v-for="color in colors" v-bind:key="color" @click="selectColor(color)" :class="[ color, color === selectedColor ? 'active' : '' ]")
    .product-popup-footer
        a.product-popup-footer-btn.btn-add(@click="addToCart") Add to cart
        a(:href="settings.cart_url" target="_blank" class="product-popup-footer-btn") Buy now

</template>

<script>
const UIZA_EXT_CART = 'UIZA_EXT_CART';

export default {
    props: ['product', 'settings'],
    mounted() {
      setTimeout(function() {
        console.table(this.settings);
      }.bind(this), 1000);
    },
    methods: {
        close() {
            this.$emit('close');
        },
        selectColor(color) {
            this.selectedColor = color;
        },
        addToCart() {
            this.$emit('cartChanged');
            let productsInCart = [];
            try {
                productsInCart = JSON.parse(localStorage.getItem(UIZA_EXT_CART)) || [];
            } catch (e) {}
            var existing = productsInCart.find((item) => {
                return item.product.id === this.product.id && item.color === this.selectedColor;
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
        }
    },
    data() {
        return {
            colors: ['red', 'green', 'blue'],
            selectedColor: 'red'
        }
    }
}
</script>

<style lang="scss">
.uiza-player-popup {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  border: #999 1px solid;
  z-index: 100;
}
.uiza-player-popup-exit {
  position: absolute;
  top: 5px;
  right: 5px;
  color: red;
  cursor: pointer;
}
.product-popup {
  padding: 20px;
}
.product-popup-image {
  width: 120px;
  float: left;
  img {
    object-fit: cover;
    max-width: 100%;
  }
}
.product-popup-content {
  padding-left: 140px;
  h4 {
    margin-top: 0;
    margin-bottom: 10px;
    font-size: 20px;
  }
  .options span {
    display: inline-block;
    font-weight: 800;
    vertical-align: middle;
  }
}
.uiza-color-picker {
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
  //Instead of the line below you could use @include box-shadow($shadow-1, $shadow-2, $shadow-3, $shadow-4, $shadow-5, $shadow-6, $shadow-7, $shadow-8, $shadow-9, $shadow-10)
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
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
      border-color: #FFF
  }
}
.product-popup-footer {
  padding-left: 140px;
}
.product-popup-footer-btn {
  display: inline-block;
  text-align: center;
  cursor: pointer;
  background-image: none;
  border: none;
  height: 40px;
  color: #fff;
  background-color: #e5101d;
  font-weight: 500;
  font-size: 20px;
  min-width: 8rem;
  //Instead of the line below you could use @include border-radius($radius, $vertical-radius)
  border-radius: 3px;
  margin: 20px 20px 0 0;
  //Instead of the line below you could use @include box-shadow($shadow-1, $shadow-2, $shadow-3, $shadow-4, $shadow-5, $shadow-6, $shadow-7, $shadow-8, $shadow-9, $shadow-10)
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
  text-decoration: none;
  &.btn-add {
    background-color: orange;
  }
}
</style>