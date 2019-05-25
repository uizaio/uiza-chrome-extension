<template lang="pug">
.uiza-ext-player
  .uiza-chat-messages(ref="chatScroller")
    .uiza-chat-messages-wrapper
      div(class="uiza-chat-messages-item" v-for="message in chatMessages" v-bind:key="message.messageId")
        strong {{ message.sender.userId }} says: 
        //- time sent at {{ message.createdAt }}
        span {{ message.message }}
  .uiza-controls(v-if="showControls")
    .uiza-controls-shopping-bag
      a(href='#' @click="showProducts = !showProducts")
        i.fas.fa-shopping-bag
    .uiza-controls-shopping-chat-input
      input(v-model="chatMessage" type='text' placeholder='Enter your message' v-on:keyup.enter="sendMessage")
    .uiza-controls-shopping-spacer
    .uiza-controls-shopping-cart
      span(class="uiza-controls-shopping-cart-qty") {{ itemsInCart }}
      a(href='#' @click="goToCart()")
        i.fas.fa-shopping-cart
    .uiza-controls-shopping-share
      a(href='#')
        i.fas.fa-share-alt
    .uiza-controls-shopping-emotion
      a(href='#')
        i.far.fa-kiss-wink-heart
  .uiza-product-list(v-if="showProducts && showControls")
    .uiza-product-list-toggle(@click="showProducts = false")
      i.fas.fa-arrow-circle-down
    carousel.uiza-product-list-swiper(:paginationEnabled="false" :perPage="10")
        slide.uiza-product-list-item(v-for="product in products" v-bind:key="product.id")
          img(:src='product.image')
          .desc
            h4 {{ product.name }}
            .price {{ product.price }}
            button.uiza-product-view(@click="selectedProduct = product") View product

  .uiza-product-overlay(v-if="products.length && showControls")
    .uiza-product-overlay-image
      img(:src="randomProduct.image")
    .uiza-product-overlay-wrapper
      .uiza-product-overlay-name {{ randomProduct.name }}
      div
        a.uiza-product-overlay-cart.uiza-product-view(@click="selectedProduct = randomProduct") Add to cart

  PlayerControls(class="controls" v-if="player" :player="player" :isLive="isLive")

  PopupProduct(v-if="selectedProduct && showControls" :product="selectedProduct" @close="close" @cartChanged="onCartChanged")

</template>

<script>
import PopupProduct from "./Product";
import PlayerControls from "./PlayerControls";
import { Carousel, Slide } from "vue-carousel";
import SendBird from "sendbird";

const UIZA_EXT_CART = "UIZA_EXT_CART";

export default {
  components: {
    PopupProduct,
    PlayerControls,
    Carousel,
    Slide
  },
  mounted() {
    this.connectSendBird();
    this.getItemsInCart();
    this.initPlayer();
  },
  methods: {
    scrollChat() {
      setTimeout(function() {
        this.$refs.chatScroller.scrollTop = this.$refs.chatScroller.scrollHeight;
      }.bind(this), 100);
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
              self.sb.addChannelHandler('UNIQUE_HANDLER_ID', ChannelHandler);
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
            alert('Failed to send message, please try again');
            return;
          }
          self.chatMessages.push(message)
          self.chatMessage = '';
          self.scrollChat();
        });
      }
    },
    initPlayer() {
      const self = this;
      const playerId = this.$parent.id + " .uiza-ext-player";
      const playerParams = { ...this.$parent.data.playerParams };
      console.log(playerId, playerParams);
      window.UZ.Player.init(playerId, playerParams, function(player) {
        self.player = player;
        player.on("play", function() {
          self.showControls = true;
        });
        player.on("pause", function() {
          self.showControls = false;
        });
      });
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
    goToCart() {
      location.href = this.jsonData.cart_url;
    }
  },
  computed: {
    isLive() {
      return !!this.$parent.data.playerParams.feedId;
    },
    jsonData() {
      return this.$parent.jsonData;
    },
    products() {
      return this.jsonData.products;
    },
    randomProduct() {
      return this.products.length
        ? this.products[Math.floor(Math.random() * this.products.length)]
        : null;
    }
  },
  data() {
    return {
      player: null,
      showControls: true,
      showProducts: false,
      selectedProduct: null,
      itemsInCart: 0,
      sb: null,
      chatUser: '',
      currentChannel: null,
      chatMessages: [],
      chatMessage: ''
    };
  }
};
</script>

<style lang="scss">
.uiza-ext-player {
  position: relative;
  font-family: Segoe UI, Tahoma, Geneva, Verdana, sans-serif;
  > iframe {
    width: 100% !important;
    height: 100% !important;
  }
}
.uiza-chat-messages {
  position: absolute;
  top: 0;
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
    background: rgba(255, 255, 255, 0.1);
    pointer-events: none;
  }
  &-item {
    padding: 3px 0 3px 10px;
    font-size: 12px;
    color: #fff;
    flex: 1 1 auto;
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
  height: 110px;
  bottom: 50px;
  left: 0;
  right: 0;
  background: linear-gradient(90deg, #fb9da3, #fb747c);
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
    margin-top: 0;
    margin-bottom: 5px;
    text-overflow: ellipsis;
    max-width: 100%;
    height: 30px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .price {
    color: #ff0010;
    font-size: 14px;
    font-weight: 500;
  }
  button.uiza-product-view {
    font-size: 14px;
    padding: 4px 10px;
    font-weight: 500;
    color: #fff;
    cursor: pointer;
    background: linear-gradient(90deg, #b9081d, #f21a4c);
    margin-top: 10px;
    border: 0 !important;
    //Instead of the line below you could use @include border-radius($radius, $vertical-radius)
    border-radius: 6px;
  }
}
</style>