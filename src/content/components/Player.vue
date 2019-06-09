<template lang="pug">
.uiza-ext-player(@click.stop="preventParentClick" :id="id" :class="{ 'uiza-ext-minimized': isMinimized }" ref="playerContainer" :style="{ maxWidth: '100%', maxHeight: '100%' }")
  UizaEgg(v-if="!isLive && showEgg && !noControls")
  a.uiza-logo(v-if="playerSettings && !noControls" @click="openBrandUrl")
    img(:src="playerSettings.brand_logo")
  a.uiza-center-play-btn(v-if="!isPlaying" @click="play")
    i.fas.fa-play-circle
  .uiza-chat-messages(ref="chatScroller" v-if="isLive && !noControls")
    .uiza-chat-messages-wrapper
      div(class="uiza-chat-messages-item" v-for="message in chatMessages" v-bind:key="message.messageId")
        strong {{ message.sender.userId }} 
        span.time {{ message.createdAt | moment("from", "now") }}
        div.message {{ message.message }}
  .uiza-controls(v-if="showControls && !noControls")
    .uiza-controls-shopping-chat-input(v-if="isLive")
      input(v-model="chatMessage" type='text' placeholder='Enter your message' v-on:keyup.enter="sendMessage")
    .uiza-controls-shopping-spacer
    .uiza-controls-shopping-bag
      a(@click="showProducts = !showProducts")
        i.fas.fa-shopping-bag
    .uiza-controls-shopping-cart(v-if="playerSettings")
      span(class="uiza-controls-shopping-cart-qty") {{ itemsInCart }}
      a(@click="goToCart")
        i.fas.fa-shopping-cart
    .uiza-controls-shopping-share
      //- dropdown(align="top" :close-on-click="true" :x="-80")
      //-   template(slot="btn")
      //-     i.fas.fa-share-alt
      //-   template(slot="body")
      //-     vue-goodshare-facebook(title_social="" has_icon button_design="outline")
      //-     vue-goodshare-twitter(title_social="" has_counter has_icon button_design="outline")
      a(@click="isSharing = !isSharing")
        i.fas.fa-share-alt
      div.uiza-controls-shopping-share-popup(v-if="isSharing")
        vue-goodshare-facebook(@onClick="isSharing = false" title_social="" has_icon button_design="outline")
        vue-goodshare-twitter(@onClick="isSharing = false" title_social="" has_counter has_icon button_design="outline")
    .uiza-controls-shopping-emotion
      img(v-for="item in stickers" v-bind:key="item.icon" @click="stickerClicked(item)" :src="item.icon" width="64")
   
  .uiza-product-list(v-if="showProducts && showControls && !noControls")
    .uiza-product-list-toggle(@click="showProducts = false")
      i.fas.fa-arrow-circle-down
    carousel.uiza-product-list-swiper(:paginationEnabled="false" :perPage="10")
      slide.uiza-product-list-item(v-for="product in products" v-bind:key="product.id")
        img(:src='product.image')
        .desc
          h4 {{ product.name }}
          .price {{ product.price }}
          button.uiza-product-view(@click="selectedProduct = product") View product

  .uiza-product-overlay(v-if="products.length && showControls && playerSettings && overlayProduct && !noControls")
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

  div(class="uiza-ext-player-ended" v-if="playerSettings && isEnded && !noControls")
    .uiza-ext-player-ended-exit(@click="isEnded = false")
      i.fas.fa-arrow-circle-left
      | Back
    h4 Thank you for watching!
    h4 Don't forget to check out your cart for payment
    a(@click="goToCart")
      img(src="https://cdn0.iconfinder.com/data/icons/webshop-essentials/100/shopping-cart-512.png")

  Congras(v-if="currentSticker && !noControls" :data="currentSticker")
</template>

<script>
import UizaEgg from "./Egg";
import PopupProduct from "./Product";
import PlayerControls from "./PlayerControls";
import Congras from "./Congras";
import { Carousel, Slide } from "vue-carousel";
import SendBird from "sendbird";
import Dropdown from "bp-vuejs-dropdown";
import VueGoodshare from "vue-goodshare";
import VueGoodshareFacebook from "vue-goodshare/src/providers/Facebook.vue";
import VueGoodshareTwitter from "vue-goodshare/src/providers/Twitter.vue";
import EventBus from "../EventBus.js";

const UIZA_EXT_CART = "UIZA_EXT_CART";

export default {
  components: {
    UizaEgg,
    PopupProduct,
    PlayerControls,
    Congras,
    Carousel,
    Slide,
    Dropdown,
    VueGoodshare,
    VueGoodshareFacebook,
    VueGoodshareTwitter
  },
  props: ["params", "settings", "json", "id"],
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
    this.connectSendBird();
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
    preventParentClick(e) {
      e.preventDefault();
      e.stopPropagation();
    },
    setupOverlay() {
      this.playerSettings.ads.forEach(ad => {});
    },
    scrollChat() {
      if (this.isLive) {
        setTimeout(
          function() {
            this.$refs.chatScroller.scrollTop = this.$refs.chatScroller.scrollHeight;
          }.bind(this),
          100
        );
      }
    },
    connectSendBird() {
      const self = this;
      self.chatUser = "uiza" + Math.floor(Math.random() * 10);
      self.sb = new SendBird({ appId: "A8D50190-B214-48B6-8A67-65EDE27CCED2" });

      self.sb.connect(self.chatUser, function(user, error) {
        if (error) {
          console.log(error);
        }
        self.sb.OpenChannel.getChannel(
          "sendbird_open_channel_52007_e6db2c6ea7a038725de10a8a0984078e07ffcdcf",
          function(openChannel, error) {
            if (error) {
              console.log("failed to send gettt", error);
              return;
            }
            self.currentChannel = openChannel;
            self.currentChannel.enter(function(response, error) {
              if (error) {
                console.log("failed to enter room", error);
                return;
              }
              var messageListQuery = self.currentChannel.createPreviousMessageListQuery();
              messageListQuery.limit = 30;
              messageListQuery.reverse = true;

              messageListQuery.load(function(messageList, error) {
                if (error) {
                  return;
                }
                self.chatMessages = messageList.reverse();
                self.scrollChat();
              });

              var ChannelHandler = new self.sb.ChannelHandler();

              ChannelHandler.onMessageReceived = function(channel, message) {
                console.log(channel, message);
                self.chatMessages.push(message);
              };
              self.sb.addChannelHandler("UNIQUE_HANDLER_ID", ChannelHandler);
            });
            // self.currentChannel.onMessageReceived(function(channel, message) {
            //   console.log('new message', message);
            // });
          }
        );
      });
    },
    sendMessage() {
      const self = this;
      if (this.chatMessage.trim().length) {
        var params = new self.sb.UserMessageParams();
        params.message = this.chatMessage;
        this.currentChannel.sendUserMessage(params, function(message, error) {
          if (error) {
            console.log("failed to send message", error);
            alert("Failed to send message, please try again");
            return;
          }
          self.chatMessages.push(message);
          self.chatMessage = "";
          self.scrollChat();
        });
      }
    },
    initPlayer() {
      const self = this;
      console.log(self.playerParams);
      window.UZ.Player.init(self.playerId, self.playerParams, function(player) {
        self.player = player;
        self.player.on("timeupdate", val => {
          if (
            !self.isLive &&
            self.player.currentTime() >= self.player.duration()
          ) {
            self.isEnded = true;
          }
        });
        self.player.on("ended", function() {
          EventBus.$emit("onTogglePIP", false);
        });
        player.on("play", function() {
          // self.showControls = true;
          self.isPlaying = true;
          self.showEgg = true;
          // count viewing time
          if (!self.playInterval) {
            self.playInterval = setInterval(function() {
              self.playedTime += 1;
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
      // if (this.isLive) {
      //   return '#' + this.id + '.uiza-ext-player';
      // } else {
      //   return this.$parent.id + " .uiza-ext-player";
      // }
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
      sb: null,
      chatUser: "",
      currentChannel: null,
      chatMessages: [],
      chatMessage: "",
      overlayTimeouts: [],
      overlayProduct: null,
      isSharing: false,
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
.bp-dropdown {
  margin-top: -4px;
  &__btn {
    background-color: transparent !important;
    border: none !important;
    padding: 0 !important;
    button {
      background: transparent !important;
      border: none !important;
      padding: 0 !important;
    }
    .bp-dropdown__icon {
      display: none !important;
    }
  }
  &__body {
    background-color: rgba(0, 0, 0, 0.6) !important;
    .el-button {
      display: block;
      margin: 0 !important;
    }
  }
}
.uiza-center-play-btn {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -30px;
  margin-left: -30px;
  cursor: pointer;
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
  iframe {
    min-width: 100% !important;
    min-height: 100% !important;
    max-width: 100%;
  }
  .uiza-egg {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }
  &-ended {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    background: #fff !important;
    border: #ccc 1px solid;
    &-exit {
      position: absolute;
      left: 5px;
      top: 10px;
      color: #000;
      cursor: pointer;
      svg {
        margin-right: 10px;
      }
    }
    h4 {
      color: #ff0010;
      font-size: 24px;
      font-weight: 600;
      text-shadow: #ccc 1px 1px 1px;
      margin: 0 !important;
      &:first-child {
        margin-top: 30px;
      }
    }
    img {
      width: 100px;
    }
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
.uiza-chat-messages {
  position: absolute;
  top: 100px;
  bottom: 90px;
  left: 0;
  width: 300px;
  overflow: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  .uiza-chat-messages-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    pointer-events: none;
  }
  &-item {
    padding: 3px 10px 3px 20px;
    font-size: 14px;
    background: rgba(255, 255, 255, 0.7);
    color: #222;
    margin: 5px 0 5px 10px;
    border-radius: 20px;
    overflow: hidden;
    flex: 1 1 auto;
    align-self: flex-start;
    min-width: 150px;
    .time {
      font-size: 11px;
    }
    .message {
      color: #111;
    }
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
      top: -50px;
      left: -100px;
      background: rgba(0, 0, 0, 0.5);
      padding: 5px 15px;
      border-radius: 40px;
      width: 130px;
    }
    > img {
      width: 36px !important;
      cursor: pointer;
    }
    .bp-dropdown {
      &__btn {
        background-color: transparent !important;
        border: none !important;
        padding: 0 !important;
        margin: 12px 0 0 10px !important;
        svg {
          margin-top: 3px !important;
          line-height: 30px;
          font-size: 20px;
          color: #fff;
        }
      }
      &__body {
        border-radius: 60px;
        padding: 0 !important;
      }
    }
  }
}
.uiza-controls-shopping-spacer {
  flex: 1 !important;
}
.uiza-controls-shopping-chat-input {
  flex: 0 0 50%;
  display: flex;
  input {
    flex: 1;
    //Instead of the line below you could use @include border-radius($radius, $vertical-radius)
    border-radius: 10px;
    padding: 5px 10px;
    border: rgba(255, 255, 255, 0.4) 1px solid;
    outline: none !important;
    color: #fff;
    background: rgba(255, 255, 255, 0.2);
  }
}
.uiza-product-list {
  position: absolute;
  height: auto !important;
  bottom: 50px;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.3);
  padding: 10px 0;
}
.uiza-product-list-toggle {
  position: absolute;
  left: 50%;
  top: -20px;
  margin-left: -20px;
  width: 40px;
  height: 40px;
  background: #fff;
  //Instead of the line below you could use @include border-radius($radius, $vertical-radius)
  border-radius: 100%;
  text-align: center;
  z-index: 99;
  //Instead of the line below you could use @include box-shadow($shadow-1, $shadow-2, $shadow-3, $shadow-4, $shadow-5, $shadow-6, $shadow-7, $shadow-8, $shadow-9, $shadow-10)
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
  cursor: pointer;
  svg {
    font-size: 30px;
    margin: 5px 0 0;
    color: #999;
  }
}
.uiza-product-list-item {
  width: 180px;
  min-width: 180px;
  height: 90px;
  padding: 10px;
  margin: 0 5px;
  background: #fff;
  position: relative;
  //Instead of the line below you could use @include box-shadow($shadow-1, $shadow-2, $shadow-3, $shadow-4, $shadow-5, $shadow-6, $shadow-7, $shadow-8, $shadow-9, $shadow-10)
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
  //Instead of the line below you could use @include border-radius($radius, $vertical-radius)
  border-radius: 10px;
  box-sizing: border-box !important;
  img {
    height: 70px;
    width: 50px;
    float: left;
  }
  .desc {
    padding-left: 60px;
  }
  h4 {
    font-size: 12px;
    line-height: 15px !important;
    margin: 0 0 5px 0 !important;
    text-overflow: ellipsis;
    max-width: 100%;
    height: 30px !important;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  .price {
    color: #ff0010;
    font-size: 12px !important;
    line-height: 12px !important;
    font-weight: 500 !important;
  }
  button.uiza-product-view {
    font-size: 12px !important;
    padding: 2px 6px !important;
    font-weight: 500 !important;
    color: #fff !important;
    cursor: pointer;
    background: linear-gradient(90deg, #b9081d, #f21a4c);
    margin: 0 !important;
    margin-top: 5px !important;
    border: 0 !important;
    //Instead of the line below you could use @include border-radius($radius, $vertical-radius)
    border-radius: 6px;
  }
}
</style>