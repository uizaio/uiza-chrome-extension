<template lang="pug">
.uiza-ext-player(@click.stop="preventParentClick" :id="id" :class="{ 'uiza-ext-minimized': isMinimized, 'uiza-portrait': isPortrait }" ref="playerContainer" :style="{ maxWidth: '100%', maxHeight: '100%' }")
  .uiza-error(v-if="isErrored") Live stream is ended
    
  //- UizaEgg(v-if="isLive && showEgg && !noControls" :url="playerSettings.buy_now_url")
  UizaOrderCount(v-if="isLive" :count="300")
  GiftBox(v-if="isLive" :url="playerSettings.buy_now_url")
  a.uiza-center-play-btn(v-if="!isPlaying" @click="play")
    img(src="https://www.upsieutoc.com/images/2019/06/12/play-button.png")
  a.uiza-logo(v-if="playerSettings && !noControls" @click="openBrandUrl")
    img(:src="playerSettings.brand_logo")
  Chat(v-if="isLive && !noControls")
  .uiza-controls(v-if="showControls && !noControls")
    .uiza-controls-shopping-spacer
    .uiza-controls-shopping-bag
      a.uiza-controls-icon.green(@click="showProducts = !showProducts")
        //- i.fas.fa-shopping-bag
        img(src="https://www.upsieutoc.com/images/2019/06/12/cart.png")
    .uiza-controls-shopping-cart(v-if="playerSettings")
      span(class="uiza-controls-shopping-cart-qty") {{ itemsInCart }}
      a.uiza-controls-icon.red(@click="goToCart")
        //- i.fas.fa-shopping-cart
        img(src="https://www.upsieutoc.com/images/2019/06/12/badge.png")
    .uiza-controls-shopping-share
      a.uiza-controls-icon.blue(@click="isSharing = !isSharing")
        //- i.fas.fa-share-alt
        img(src="https://www.upsieutoc.com/images/2019/06/12/share.png")
      div.uiza-controls-shopping-share-popup(v-if="isSharing")
        vue-goodshare-facebook(@onClick="isSharing = false" title_social="" has_icon)
        vue-goodshare-twitter(@onClick="isSharing = false" title_social="" has_counter has_icon)
    .uiza-controls-egg.animated.heartBeat.infinite(ref="eggContainer" v-if="hasEgg && isLive")
      div.uiza-controls-egg-wrapper(@click="animateEgg")
        div.uiza-controls-egg-draggable(ref="eggDraggable")
          div.uiza-controls-egg-wrapper-label Only for you
          div.uiza-controls-egg-wrapper-gift(v-if="eggGiftShown")
            button(@click="buyNow") Click me
            div Gift will be disappear in {{ eggGiftCountdown }}s
          img(src="https://i.imgur.com/gKmLziK.png" width="50" ref="eggImage")
    //- .uiza-controls-shopping-emotion
    //-   img(v-for="item in stickers" v-bind:key="item.icon" @click="stickerClicked(item)" :src="item.icon" width="64")
  ProductList(v-if="showProducts && showControls && !noControls" :products="products" @view="selectedProduct = $event" @close="showProducts = false")

  .uiza-product-overlay(v-if="false && products.length && showControls && playerSettings && overlayProduct && !noControls")
    //- div(v-for="(item, index) in playerSettings.ads" v-bind:key="index")
    div
      .uiza-product-overlay-image
        img(:src="overlayProduct.image")
      .uiza-product-overlay-wrapper
        .uiza-product-overlay-name {{ overlayProduct.name }}
        div
          a.uiza-product-overlay-cart.uiza-product-view(@click="selectedProduct = overlayProduct") View Product

  PlayerControls(class="controls" v-if="player && !noControls" :player="player" :settings="playerSettings" :isLive="isLive")

  PopupProduct(v-if="selectedProduct && showControls && !noControls" :product="selectedProduct" :settings="playerSettings" @close="close" @cartChanged="onCartChanged")
  RelatedVideos(v-if="playerSettings && playerParams && !isLive && isEnded && !noControls"
    @close="isEnded = false"
    :settings="playerSettings" :params="playerParams" :chromeUrl="chromeUrl")

  Congras(v-if="currentSticker && !noControls" :data="currentSticker")
</template>

<script>
import Chat from "./Chat";
import UizaEgg from "./Egg";
import UizaOrderCount from "./OrderCount";
import GiftBox from "./GiftBox";
import RelatedVideos from "./RelatedVideos";
import PopupProduct from "./Product";
import ProductList from "./ProductList";
import PlayerControls from "./PlayerControls";
import Congras from "./Congras";
import Dropdown from "bp-vuejs-dropdown";
import VueGoodshare from "vue-goodshare";
import VueGoodshareFacebook from "vue-goodshare/src/providers/Facebook.vue";
import VueGoodshareTwitter from "vue-goodshare/src/providers/Twitter.vue";
import EventBus from "../EventBus.js";

const UIZA_EXT_CART = "UIZA_EXT_CART";

export default {
  components: {
    Chat,
    UizaEgg,
    UizaOrderCount,
    GiftBox,
    RelatedVideos,
    PopupProduct,
    ProductList,
    PlayerControls,
    Congras,
    Dropdown,
    VueGoodshare,
    VueGoodshareFacebook,
    VueGoodshareTwitter
  },
  props: ["params", "settings", "chromeUrl", "json", "id"],
  created() {
    EventBus.$on(
      "onTogglePIP",
      function(val) {
        this.isMinimized = val;
      }.bind(this)
    );
  },
  mounted() {
    this.playerSettings = !this.settings
      ? this.$parent.data.playerSettings
      : this.settings;
    this.playerParams = !this.params
      ? this.$parent.data.playerParams
      : this.params;
    this.setupOverlay();
    document.addEventListener(
      "uizaExtPlayerChanged",
      function(e) {
        this.playerSettings = e.detail;
        this.overlayTimeouts.forEach(handler => {
          clearTimeout(handler);
        });
        this.setupOverlay();
      }.bind(this)
    );
    this.getItemsInCart();
    this.initPlayer();
  },
  methods: {
    openBrandUrl() {
      var win = window.open(this.playerSettings.brand_url, "_blank");
      win.focus();
    },
    goToCart() {
      var win = window.open(this.playerSettings.cart_url, "_blank");
      win.focus();
    },
    buyNow() {
      var win = window.open(this.playerSettings.buy_now_url, "_blank");
      win.focus();
    },
    preventParentClick(e) {
      e.preventDefault();
      e.stopPropagation();
    },
    setupOverlay() {
      this.playerSettings.ads.forEach(ad => {});
    },
    initPlayer() {
      const self = this;
      if (self.isPortrait) {
        self.playerParams.width = "375px";
        self.playerParams.height = "670px";
      }
      window.UZ.Player.init(self.playerId, self.playerParams, function(player) {
        self.player = player;
        if (self.isAutoplay) {
          player.muted(true);
          player.autoplay(true);
        }
        self.player.on("timeupdate", val => {
          if (self.isLive) {
            console.log("tickkkkk");
          }
        });
        self.player.on("ended", function() {
          self.isEnded = true;
          EventBus.$emit("onTogglePIP", false);
        });
        self.player.on("error", function() {
          alert("error");
          self.isErrored = true;
        });
        player.on("play", function() {
          // self.showControls = true;
          self.isPlaying = true;
          self.showEgg = true;
          // count viewing time
          if (!self.playInterval) {
            self.playInterval = setInterval(function() {
              self.playedTime += 1;
              if (self.playedTime === 5) {
                self.hasEgg = true;
              }
              self.playerSettings.ads.forEach(function(ad) {
                const time = new Date(Date.parse(ad.time));
                const adTime =
                  time.getHours() * 60 * 60 +
                  time.getMinutes() * 60 +
                  time.getSeconds();
                if (adTime === self.playedTime) {
                  self.overlayProduct = self.randomProduct;
                  setTimeout(() => {
                    self.overlayProduct = null;
                  }, ad.duration * 1000);
                }
              });
            }, 1000);
          }
        });
        player.on("pause", function() {
          // self.showControls = false;
          self.isPlaying = false;
        });
      });
    },
    play() {
      this.player.play();
    },
    getItemsInCart() {
      try {
        var cart = JSON.parse(localStorage.getItem(UIZA_EXT_CART)) || [];
        cart.forEach(item => {
          this.itemsInCart += item.quantity;
        });
      } catch (e) {}
    },
    close() {
      this.selectedProduct = null;
    },
    onCartChanged() {
      this.itemsInCart += 1;
      this.close();
      this.showProducts = false;
    },
    stickerClicked(item) {
      this.currentSticker = item;
      setTimeout(() => {
        this.currentSticker = null;
      }, 3000);
    },
    animateEgg() {
      const self = this;
      const width = this.$refs.playerContainer.clientWidth;
      const height = this.$refs.playerContainer.clientHeight;
      const imageWidth = Math.min(200, width / 3);
      // const imageHeight = Math.min(200, height / 3);
      const x = (width + 50) / 2;
      const y = height / 2; // 90 is the relative position from bottom

      this.$refs.eggContainer.classList.remove("animated");
      this.$anime
        .timeline()
        .add({
          targets: this.$refs.eggImage,
          width: imageWidth * 0.75,
          class: "animated shake infinite",
          easing: "easeOutExpo"
        })
        .add({
          targets: this.$refs.eggDraggable,
          left: -x,
          top: -y,
          width: imageWidth
        })
        .add({
          targets: this.$refs.eggImage,
          width: imageWidth,
          easing: "easeOutExpo",
          complete: function() {
            self.$refs.eggImage.src = "https://i.imgur.com/IbWEzMI.gif";
            // self.$refs.eggImage.classList = "";
            self.$refs.eggImage.onload = function() {
              self.$refs.eggImage.width = imageWidth;
              setTimeout(function() {
                self.eggGiftShown = true;
                var interval = setInterval(function() {
                  self.eggGiftCountdown -= 1;
                  if (self.eggGiftCountdown <= 0) {
                    self.eggGiftShown = false;
                    self.eggGiftCountdown = 5;
                    self.hasEgg = false;
                    clearInterval(interval);
                  }
                }, 1000);
              }, 4500);
            };
          }
        });
    }
  },
  computed: {
    width() {
      return this.playerSettings ? this.playerSettings.width : 0;
    },
    height() {
      return this.playerSettings ? this.playerSettings.height : 0;
    },
    isLive() {
      return this.playerParams && !!this.playerParams.feedId;
    },
    jsonData() {
      return this.$parent.jsonData || this.json;
    },
    playerId() {
      return ("#" + (this.id || this.$parent.id) + ".uiza-ext-player").replace(
        "##",
        "#"
      );
    },
    products() {
      return this.jsonData.products;
    },
    randomProduct() {
      return this.products.length
        ? this.products[Math.floor(Math.random() * this.products.length)]
        : null;
    },
    noControls() {
      return this.playerParams && this.playerParams.noControls;
    },
    isPortrait() {
      return this.playerParams && this.playerParams.isPortrait;
    },
    isAutoplay() {
      return this.playerParams && this.playerParams.isAutoplay;
    }
  },
  data() {
    return {
      player: null,
      isPlaying: false,
      isEnded: false,
      playerParams: null,
      playerSettings: null,
      showControls: true,
      showProducts: false,
      selectedProduct: null,
      itemsInCart: 0,
      overlayTimeouts: [],
      overlayProduct: null,
      isSharing: false,
      hasEgg: false,
      eggGiftShown: false,
      eggGiftCountdown: 5,
      stickers: [
        {
          icon:
            "https://mir-s3-cdn-cf.behance.net/project_modules/disp/65ea2034559659.56d57de06cea2.gif",
          // gif: "https://media.giphy.com/media/3oKIPqM8BJ0ofNQOzK/source.gif"
          gif: "https://media.giphy.com/media/McmuC1HeylawPz6hYk/giphy.gif"
        }
        // {
        //   icon:
        //     "https://mir-s3-cdn-cf.behance.net/project_modules/disp/e4299734559659.56d57de04bda4.gif",
        //   gif: "https://media3.giphy.com/media/5z5NIlNjK0NxpsecKh/source.gif"
        // }
      ],
      currentSticker: null,
      playInterval: null,
      playedTime: 0,
      isMinimized: false,
      isErrored: false,
      showEgg: false
    };
  }
};
</script>

<style lang="scss">
* {
  line-height: 1.1 !important;
}
button {
  min-width: auto !important;
  height: auto !important;
  margin: 0 !important;
}
.uiza-center-play-btn {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -50px;
  margin-left: -50px;
  cursor: pointer;
  img {
    width: 100px !important;
  }
  svg {
    color: rgba(255, 255, 255, 0.5);
    width: 60px !important;
    height: 60px !important;
  }
}

.vue-slider-rail {
  cursor: pointer;
}
.uiza-ext-player {
  position: relative;
  z-index: 2147483646;
  font-family: Segoe UI, Tahoma, Geneva, Verdana, sans-serif;
  overflow: hidden;
  iframe {
    min-width: 100% !important;
    min-height: 100% !important;
    max-width: 100%;
  }
  &.uiza-portrait {
    max-width: 375px !important;
  }
  .uiza-egg {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }
}
.uiza-logo {
  position: absolute;
  top: 10px;
  right: 10px;
  display: block;
  cursor: pointer;
  img {
    max-width: 80px;
  }
}
.uiza-product-overlay {
  //Instead of the line below you could use @include transform($scale, $rotate, $transx, $transy, $skewx, $skewy, $originx, $originy)
  transform: scale(1);
  position: absolute;
  top: 30px;
  right: 30px;
  width: 240px;
  padding: 10px;
  //Instead of the line below you could use @include border-radius($radius, $vertical-radius)
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  overflow: hidden;
}
.uiza-product-overlay-image {
  width: 50px;
  height: 70px;
  float: left;
  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
}
.uiza-product-overlay-wrapper {
  padding-left: 60px;
}
.uiza-product-overlay-name {
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 10px;
}
.uiza-product-overlay-cart {
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
.uiza-controls {
  position: absolute;
  bottom: 55px;
  left: 0;
  right: 0;
  margin-right: 15px !important;
  display: flex;
  align-content: center;
  justify-items: center;
  align-items: center;
  > div {
    flex: 0 0 auto;
    margin: 0 10px;
    position: relative;
    > a {
      cursor: pointer;
      > svg {
        line-height: 30px;
        font-size: 20px;
        color: #fff;
      }
      &:hover > i {
        color: yellow !important;
      }
    }
  }
  &-icon {
    user-select: none;
    border-radius: 100%;
    width: 30px;
    height: 30px;
    display: block;
    text-align: center;
    background: linear-gradient(180deg, #5ef59e 0%, #098e41 100%);
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    &.red {
      background: linear-gradient(180deg, #fa9191 0%, #c11212 100%);
    }
    &.blue {
      background: linear-gradient(180deg, #84c6ec 0%, #0b75b1 100%);
    }
    img {
      width: 16px;
      margin-top: 6px;
    }
  }
  &-shopping-cart {
    &-qty {
      position: absolute;
      width: 22px;
      height: 22px;
      border-radius: 100%;
      color: #333;
      background: rgb(253, 216, 53);
      text-align: center;
      padding-top: 5px;
      box-sizing: border-box;
      font-size: 11px;
      top: -10px;
      right: -15px;
      font-weight: 600;
      border: #ddd 1px solid;
    }
  }
  &-shopping-emotion,
  &-shopping-share {
    margin-right: 0 !important;
    &-popup {
      position: absolute;
      top: -90px;
      right: 0 !important;
      left: auto !important;
      padding: 0;
      border-radius: 3px !important;
      white-space: pre-line; // 5px 10px !important;
      // box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
      // background: #fff !important;
      .button-social {
        border-radius: 100% !important;
        border: none !important;
        width: 30px;
        height: 30px;
        box-sizing: border-box;
        text-align: center;
        padding-left: 5px !important;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        &:first-child {
          margin-right: 0 !important;
          margin-bottom: 10px;
        }
        i {
          font-size: 14px;
        }
      }
    }
    > img {
      width: 36px !important;
      cursor: pointer;
    }
  }
  &-egg {
    &-draggable {
      position: absolute;
      top: -20px;
      left: calc(-50% - 10px);
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    &-wrapper {
      position: relative;
      width: 30px;
      height: 40px;

      &-label {
        display: inline-block;
        white-space: nowrap;
        padding: 5px 10px;
        box-sizing: border-box;
        background: orange;
        color: #fff;
        border-radius: 5px;
        width: auto;
      }
      &-gift {
        position: absolute;
        top: 40px;
        background: #fff;
        text-align: center;
        border-radius: 4px;
        padding: 10px;
        button {
          border: 0 !important;
          padding: 10px;
          background: red;
          color: #fff;
          font-size: 14px;
          border-radius: 3px;
          margin-bottom: 10px !important;
          cursor: pointer;
        }
      }
      img {
        margin-top: 5px;
        cursor: pointer;
        // position: absolute;
        // bottom: 0;
        // right: 0;
      }
    }
  }
}
.uiza-controls-shopping-spacer {
  flex: 1 !important;
}
</style>