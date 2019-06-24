<template lang="pug">
.uiza-chat
  .uiza-chat-messages(ref="chatScroller")
    .uiza-chat-messages-wrapper
      div(class="uiza-chat-messages-item" v-for="message in chatMessages" v-bind:key="message.messageId")
        div.uiza-chat-messages-item-photo
          img(:src="message.avatar")
        div.uiza-chat-messages-item-info
          //- {{ message.sender.userId }}
          strong {{ message.username }}
          span.time {{ message.createdAt | moment("from", "now") }}
          div.message {{ message.message }}
  .uiza-chat-input(:class="{ chatting: isChatting }")
    input(v-model="chatMessage" type='text' placeholder='Enter your message' v-on:keyup.enter="sendMessage")
    .uiza-chat-input-buttons
      button(@click="isLiked = !isLiked")
        //- i.uiza-chat-input-buttons-love(:class="{ animate: isLiked }" )
        img(v-if="!isLiked" src="https://www.upsieutoc.com/images/2019/06/14/heart.png")
        img(v-else src="https://www.upsieutoc.com/images/2019/06/14/heat-black.png")
        ul(class="uiza-hearts flying2" :class="{ flying: isLiked }")
          li(class="heart")
          li(class="heart")
          li(class="heart")
          li(class="heart")
          li(class="heart")
          li(class="heart")
          li(class="heart")
          li(class="heart")
          li(class="heart")
      
      button(@click="sendMessage")
        | ENTER
        //- img(src="https://www.upsieutoc.com/images/2019/06/12/chat-icon.png")
</template>
<script>
import SendBird from "sendbird";
// eslint-disable-next-line no-unused-vars
import faker from "faker";
import { setInterval } from "timers";
faker.locale = "vi";

export default {
  props: [],
  mounted() {
    // this.connectSendBird();
  },
  methods: {
    randomName() {
      return faker.name.findName();
    },
    randomAvatar() {
      return faker.image.avatar();
    },
    connectSendBird() {
      const self = this;
      self.chatUser = this.randomName(); // "uiza" + Math.floor(Math.random() * 10);
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
              var ChannelHandler = new self.sb.ChannelHandler();
              ChannelHandler.onMessageReceived = function(channel, message) {
                console.log(channel, message);
                self.chatMessages.push(message);
              };
              self.sb.addChannelHandler("UNIQUE_HANDLER_ID", ChannelHandler);
              self.loadMessages();
            });
          }
        );
      });
    },
    loadMessages() {
      const self = this;
      var messageListQuery = self.currentChannel.createPreviousMessageListQuery();
      messageListQuery.limit = 30;
      messageListQuery.reverse = true;

      messageListQuery.load(function(messageList, error) {
        if (error) {
          return;
        }
        messageList.forEach(function(message) {
          message.avatar = self.randomAvatar();
        });
        self.chatMessages = messageList.reverse();
        console.log(self.chatMessages);
        self.scrollChat();
      });
    },
    scrollChat() {
      setTimeout(
        function() {
          this.$refs.chatScroller.scrollTop = this.$refs.chatScroller.scrollHeight;
        }.bind(this),
        100
      );
    },
    fakeMessage() {
      const spamMessages = [
        faker.phone.phoneNumber(),
        faker.lorem.sentence(),
        faker.address.streetAddress()
      ];
      const randomMessage =
        spamMessages[Math.floor(Math.random() * spamMessages.length)];
      this.chatMessages.push({
        messageId: ++this.messageIndex,
        username: this.randomName(),
        avatar: this.randomAvatar(),
        message: randomMessage,
        createdAt: new Date()
      });
      // clearInterval(this.chatInterval);
      // this.chatIntervalMs += 10;
      // this.chatInterval = setInterval(
      //   function() {
      //     this.fakeMessage();
      //   }.bind(this),
      //   this.chatIntervalMs
      // );
    },
    sendMessage() {
      this.chatMessages.push({
        messageId: ++this.messageIndex,
        username: "Uiza Seller",
        avatar:
          "https://d3co7cvuqq9u2k.cloudfront.net/public/image/logo/uiza_logo_color.png",
        message: this.chatMessage,
        createdAt: new Date()
      });
      this.chatMessage = "";
      if (this.chatInterval === null) {
        this.chatInterval = setInterval(
          function() {
            this.fakeMessage();
          }.bind(this),
          this.chatIntervalMs
        );
      }
    },
    sendMessage2() {
      const self = this;
      if (!self.isChatting) {
        self.isChatting = true;
        return;
      }
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
          // self.isChatting = false;
        });
      } else {
        // self.isChatting = false;
      }
    }
  },
  watch: {
    chatMessages: function(val) {
      this.scrollChat();
    }
  },
  data() {
    return {
      messageIndex: 0,
      sb: null,
      chatUser: "",
      isChatting: true,
      currentChannel: null,
      chatMessages: [],
      chatMessage: "",
      chatInterval: null,
      chatIntervalMs: 1000,
      isLiked: false
    };
  }
};
</script>

<style lang="scss">
.uiza-chat {
  position: absolute;
  top: 100px;
  bottom: 120px;
  left: 0;
  width: 300px;
  max-width: 100%;
  display: flex;
  flex-direction: column;

  &-input {
    flex: 0 0 50px;
    display: flex;
    margin-left: 20px;
    background: rgba(29, 53, 87, 0.3);
    border-radius: 20px;
    width: 100%;
    transition: all 1s;
    &:not(.chatting) {
      width: 40px !important;
      padding-left: 10px !important;
      background: linear-gradient(
        180deg,
        rgba(255, 120, 128, 0.8) 0%,
        rgba(234, 26, 39, 0.8) 100%
      ) !important;
      input {
        display: none !important;
      }
      .uiza-chat-input-buttons button:first-child {
        display: none !important;
      }
    }
    input {
      flex: 1;
      padding: 15px 20px;
      border: none !important;
      outline: none !important;
      color: #fff !important;
      font-size: 12px !important;
      background: transparent !important;
      &::placeholder {
        color: #eee !important;
      }
    }
    &-buttons {
      flex: 0 0 auto;
      display: flex;
      margin-right: 16px !important;
      button {
        position: relative;
        padding: 0 !important;
        border: 0 !important;
        outline: none !important;
        background: transparent !important;
        margin-left: 10px !important;
        color: #ddd !important;
        font-size: 13px;
        cursor: pointer;
        img {
          width: 16px;
          margin-top: 2px;
        }
        svg {
          width: 20px !important;
          height: 20px !important;
        }
      }
      &-love {
        display: block;
        background-image: url("https://s3-us-west-2.amazonaws.com/s.cdpn.io/66955/web_heart_animation.png");
        background-repeat: no-repeat;
        background-size: 2900%;
        background-position: left;
        height: 50px;
        width: 50px;
        margin: 0 auto;
        cursor: pointer;
      }
    }
  }

  &-messages {
    flex: 1;
    padding: 0 0 20px 10px !important;
    overflow: auto;
    display: flex;
    align-items: flex-start;
    scroll-behavior: smooth;
    &::-webkit-scrollbar {
      display: none;
    }
    &-wrapper {
      display: flex;
      flex-direction: column;
      // Use this only for autoscroll
      // justify-content: flex-end;
      pointer-events: none;
    }
    &-item {
      padding: 3px 10px 3px 10px;
      font-size: 14px;
      color: #eee;
      margin: 5px 0 5px 10px;
      overflow: hidden;
      flex: 1 1 auto;
      // align-self: flex-start;
      min-width: 150px;
      background: rgba(29, 53, 87, 0.65);
      border-radius: 150px;
      &-photo {
        float: left;
        img {
          width: 40px;
          height: 40px;
          border-radius: 100%;
        }
      }
      &-info {
        padding-left: 54px;
        padding-top: 5px;
        strong {
          font-weight: 400;
        }
        .time {
          font-size: 11px;
          margin-left: 10px;
          color: #ccc;
        }
        .message {
          color: #ccc;
          font-size: 12px !important;
          margin: 5px 0 !important;
        }
      }
    }
  }
}
.animate {
  animation: heart-burst 0.8s steps(28) forwards;
}

@keyframes heart-burst {
  0% {
    background-position: left;
  }
  100% {
    background-position: right;
  }
}
.uiza-hearts {
  position: absolute;
  bottom: 24px;
  left: -8px;
  display: none;
  .heart {
    position: absolute;
    left: 0;
    list-style: none;
    width: 16px;
    height: 18px;
    margin: 4px;
    box-sizing: border-box;
    &:before,
    &:after {
      position: absolute;
      content: "";
      left: 12px;
      top: 0;
      width: 12px;
      height: 18px;
      background: red;
      border-radius: 16px 16px 0 0;
      transform: rotate(-45deg);
      transform-origin: 0 100%;
    }
    &:after {
      left: 0;
      transform: rotate(45deg);
      transform-origin: 100% 100%;
    }
  }
  &.flying {
    display: block !important;
    .heart:nth-child(even) {
      animation: 2.8s flyingEven linear; // infinite
    }
    > .heart:nth-child(odd) {
      animation: 2.8s flyingOdd linear; // infinite
    }
    > .heart:nth-child(1) {
      animation-delay: 0.2s;
    }
    > .heart:nth-child(2) {
      animation-delay: 0.3s;
    }
    > .heart:nth-child(3) {
      animation-delay: 0.6s;
    }
    > .heart:nth-child(4) {
      animation-delay: 1.5s;
    }
    > .heart:nth-child(5) {
      animation-delay: 2.2s;
    }
    > .heart:nth-child(6) {
      animation-delay: 2.9s;
    }
    > .heart:nth-child(7) {
      animation-delay: 3.2s;
    }
    > .heart:nth-child(8) {
      animation-delay: 3.5s;
    }
    > .heart:nth-child(9) {
      animation-delay: 3.8s;
    }
    > .heart:nth-child(10) {
      animation-delay: 4.1s;
    }
    > .heart:nth-child(11) {
      animation-delay: 4.5s;
    }
    > .heart:nth-child(12) {
      animation-delay: 5s;
    }
  }
}

@keyframes flyingEven {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
    filter: blur(0px);
  }
  100% {
    transform: translate(100px, -480px) scale(3);
    opacity: 0;
    filter: blur(10px);
  }
}
@keyframes flyingOdd {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
    filter: blur(0px);
  }
  100% {
    transform: translate(-100px, -480px) scale(3);
    opacity: 0;
    filter: blur(10px);
  }
}
</style>