<template lang="pug">
.uiza-ext-player(@click.stop="preventParentClick" v-on:mousemove.stop.prevent="onZoom" @mouseleave="onRestoreZoom"  :id="id" :class="[ currentTheme, {'uiza-theme-flat': isFlat && false, 'uiza-ext-minimized': isMinimized, 'uiza-portrait': isPortrait }]" ref="playerContainer" :style="{ maxWidth: '100%', maxHeight: '100%' }")
  .uiza-ext-player-overlay(ref="playerOverlay" @click="onOverlayClicked")
  .uiza-error(v-if="isErrored") Live stream is ended
  ShopInfo(v-if="isLive")
  EggFlat(v-if="hasEgg && isLive && !noControls" :url="playerSettings.buy_now_url" @used="showProducts = true" :theme="theme")
  UizaOrderCount(v-if="isLive" :count="300" :theme="theme" :portrait="portrait")
  UizaViewCount(v-if="isLive")
  GiftBox(v-if="isLive" :url="playerSettings.buy_now_url" @used="showProducts = true" :theme="theme")
  a.uiza-center-play-btn(v-if="!isPlaying && player && !isAutoplay" @click="play")
    img(v-if="isKute" src="https://www.upsieutoc.com/images/2019/07/07/play-button.png")
    template(v-else)
      img(v-show="!isEnded && !isFlat" src="https://www.upsieutoc.com/images/2019/06/12/play-button.png")
      i.fas.fa-play(v-show="!isEnded && isFlat")
      i.fas.fa-undo(v-show="isEnded")
  a.uiza-logo(v-if="playerSettings && isLive && !noControls && theme !== 'Kute'" @click="openBrandUrl")
    img(:src="playerSettings.brand_logo")
  ChatKute(v-if="theme === 'Kute' && isLive && !noControls")
  Chat(v-if="!isFlat && isLive && !noControls")
  ChatFlat(v-if="theme !== 'Kute' && isFlat && isLive && !noControls")
  transition(name="fade")
    PlayerControls(v-show="!hideControlsBar" class="controls" v-if="player && !isLive && !noControls" :player="player" :settings="playerSettings" :isLive="isLive")
    PlayerControlsLive(v-show="!hideControlsBar" class="controls" v-if="player && isLive && !noControls" :player="player" :settings="playerSettings" :isLive="isLive" :theme="theme")
  .uiza-controls(:class="{ 'uiza-controls-hidden': hideControlsBar }" v-if="showControls && isLive && !noControls")
    .uiza-controls-shopping-spacer
    .uiza-controls-shopping-bag
      span(class="uiza-controls-shopping-cart-qty") {{ products.length }}
      a.uiza-controls-icon(:class="{ green: !isFlat }" @click="showProducts = !showProducts")
        img(v-if="isKute" src="https://www.upsieutoc.com/images/2019/06/14/badge.png")
        img(v-else-if="isFlat" src="https://www.upsieutoc.com/images/2019/07/07/cart.png")
        img(v-else src="https://www.upsieutoc.com/images/2019/06/12/cart.png")
    .uiza-controls-shopping-cart(v-if="playerSettings")
      span(class="uiza-controls-shopping-cart-qty") {{ itemsInCart }}
      a.uiza-controls-icon(:class="{ red: !isFlat }" @click="goToCart")
        img(v-if="isKute" src="https://www.upsieutoc.com/images/2019/07/07/badge.png")
        img(v-else-if="isFlat" src="https://www.upsieutoc.com/images/2019/06/14/cart.png")
        img(v-else src="https://www.upsieutoc.com/images/2019/06/12/badge.png")
    .uiza-controls-shopping-share
      a.uiza-controls-icon(:class="{ blue: !isFlat }" @click="isSharing = !isSharing")
        img(v-if="isKute" src="https://www.upsieutoc.com/images/2019/07/07/share.png")
        img(v-else-if="isFlat" src="https://www.upsieutoc.com/images/2019/06/14/share.png")
        img(v-else src="https://www.upsieutoc.com/images/2019/06/12/share.png")
      div.uiza-controls-shopping-share-popup(v-if="isSharing")
        vue-goodshare-facebook(@onClick="isSharing = false" :page_url="brandUrl" title_social="" has_icon)
        vue-goodshare-twitter(@onClick="isSharing = false" :page_url="brandUrl" title_social="" has_counter has_icon)
  ProductList(v-if="showProducts && showControls && !noControls" :products="products" @view="selectedProduct = $event" @close="showProducts = false")

  ProductOverlay(v-if="products.length && isLive && showControls && playerSettings && overlayProduct && !noControls" :product="overlayProduct" @cartAdded="onCartChanged(); overlayProduct = null")
  PopupProduct(v-if="selectedProduct && showControls && !noControls" :product="selectedProduct" :settings="playerSettings" @close="close" @eggUsed="hasEgg = false" @cartChanged="onCartChanged")
  RelatedVideos(v-if="playerSettings && playerParams && !isLive && isEnded && !noControls"
    @close="isEnded = false"
    :settings="playerSettings" :params="playerParams" :chromeUrl="chromeUrl")

  Congras(v-if="currentSticker && !noControls" :data="currentSticker")
</template>

<script>
import Chat from "./Chat";
import ChatFlat from "./ChatFlat";
import ChatKute from "./ChatKute";
import UizaEgg from "./Egg";
import EggFlat from "./EggFlat";
import UizaOrderCount from "./OrderCount";
import UizaViewCount from "./ViewCount";
import ShopInfo from "./ShopInfo";
import GiftBox from "./GiftBox";
import RelatedVideos from "./RelatedVideos";
import PopupProduct from "./Product";
import ProductOverlay from "./OverlayProduct";
import ProductList from "./ProductList";
import PlayerControls from "./PlayerControls";
import PlayerControlsLive from "./PlayerControlsLive";
import Congras from "./Congras";
import VueGoodshare from "vue-goodshare";
import VueGoodshareFacebook from "vue-goodshare/src/providers/Facebook.vue";
import VueGoodshareTwitter from "vue-goodshare/src/providers/Twitter.vue";
import EventBus from "../EventBus.js";

const UIZA_EXT_CART = "UIZA_EXT_CART";

export default {
  components: {
    Chat,
    ChatFlat,
    ChatKute,
    UizaEgg,
    EggFlat,
    UizaOrderCount,
    UizaViewCount,
    ShopInfo,
    GiftBox,
    RelatedVideos,
    PopupProduct,
    ProductOverlay,
    ProductList,
    PlayerControls,
    PlayerControlsLive,
    Congras,
    VueGoodshare,
    VueGoodshareFacebook,
    VueGoodshareTwitter
  },
  props: ["params", "settings", "chromeUrl", "json", "id", "theme", "portrait"],
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
    onOverlayClicked() {
      if (this.player) {
        if (this.isPlaying) {
          this.player.pause();
        } else {
          this.player.play();
        }
      }
    },
    onZoom(event) {
      if (this.hideControlsBarTimeout !== null) {
        clearTimeout(this.hideControlsBarTimeout);
      }
      this.hideControlsBar = false;
      if (this.isZoomable && !this.isZooming) {
        this.isZooming = true;
        const x = event.offsetX;
        const y = event.offsetY;
        const width = this.$refs.playerContainer.offsetWidth;
        const height = this.$refs.playerContainer.offsetHeight;
        if (this.player) {
          const transformX = (width / 2 - x) / 2;
          const transformY = (height / 2 - y) / 2;
          this.player.iframe.style.transform = `scale(2) translateX(${transformX}px) translateY(${transformY}px)`;
        }
        this.isZooming = false;
      }
    },
    onRestoreZoom() {
      this.hideControlsBarTimeout = setTimeout(
        function() {
          this.hideControlsBar = true;
        }.bind(this),
        2000
      );
      if (this.isZoomable && this.player) {
        this.player.iframe.style.transform = "";
      }
    },
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
          // if (self.isLive) {
          //   console.log("tickkkkk");
          // }
        });
        self.player.on("ended", function() {
          if (self.isAutoplay) {
            self.player.play();
          } else {
            self.isEnded = true;
            EventBus.$emit("onTogglePIP", false);
          }
        });
        self.player.on("error", function() {
          alert("error");
          self.isErrored = true;
        });
        player.on("play", function() {
          // self.showControls = true;
          self.isPlaying = true;
          // count viewing time
          if (!self.playInterval) {
            self.playInterval = setInterval(function() {
              self.playedTime += 1;
              if (self.playedTime === 120) {
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
    }
  },
  computed: {
    currentTheme() {
      return 'uiza-theme-' + this.theme.toLowerCase();
    },
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
    brandUrl() {
      return this.playerSettings.brand_url;
    },
    noControls() {
      return this.playerParams && this.playerParams.noControls;
    },
    isPortrait() {
      return this.playerParams && this.playerParams.isPortrait;
    },
    isAutoplay() {
      return this.playerParams && this.playerParams.isAutoplay;
    },
    isZoomable() {
      return this.playerParams && this.playerParams.isZoomable;
    },
    isFlat() {
      return true; // this.theme === 'Flat';
    },
    isKute() {
      return this.theme === 'Kute';
    }
  },
  data() {
    return {
      player: null,
      isZooming: false,
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
      hideControlsBar: false,
      hideControlsBarTimeout: null
    };
  }
};
</script>

<style lang="scss">
@import "../theme.scss";
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
  z-index: 9999;
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
    pointer-events: none !important;
  }
  &.uiza-portrait {
    max-width: 375px !important;
  }
  &-overlay {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    background: transparent !important;
  }
}
.uiza-logo {
  position: absolute;
  top: 20px;
  right: 10px;
  display: block;
  cursor: pointer;
  img {
    width: 80px;
    max-width: 80px;
  }
}
.uiza-controls {
  position: absolute;
  bottom: 70px;
  left: 0;
  right: 0;
  margin-right: 15px !important;
  display: flex;
  align-content: center;
  justify-items: center;
  align-items: center;
  transition: all 1s;
  &-hidden {
    bottom: 20px !important;
  }
  &-shopping-bag {
    margin: 0 !important;
  }
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
    &.green {
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
      background: linear-gradient(180deg, #5ef59e 0%, #098e41 100%);
    }
    &.red {
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
      background: linear-gradient(180deg, #fa9191 0%, #c11212 100%);
    }
    &.blue {
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
      background: linear-gradient(180deg, #84c6ec 0%, #0b75b1 100%);
    }
    img {
      width: 24px;
      height: 24px;
      margin-top: 6px;
    }
  }
  &-shopping-cart {
    &-qty {
      position: absolute;
      width: 16px;
      height: 16px;
      border-radius: 100%;
      color: #FFF;
      background: #1E3656;
      text-align: center;
      padding-top: 0;
      box-sizing: border-box;
      font-size: 11px;
      top: -10px;
      right: -15px;
      font-weight: 600;
      border: #111 1px solid;
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
      height: 60px;
      width: 120px;
      background: #fff;
      border-radius: 3px !important;
      text-align: center;
      white-space: pre-line; // 5px 10px !important;
      // box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
      // background: #fff !important;
      .button-social {
        border-radius: 100% !important;
        border: none !important;
        width: 36px;
        height: 36px;
        margin: 10px !important;
        box-sizing: border-box;
        text-align: center;
        padding-left: 5px !important;
        // box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        &:first-child {
          margin-right: 5px !important;
          // margin-bottom: 10px;
          background: #1877f2 !important;
        }
        i {
          font-size: 18px;
          margin-top: 2px !important;
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>