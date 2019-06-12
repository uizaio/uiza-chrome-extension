<template lang="pug">
.uiza-chat
  .uiza-chat-messages(ref="chatScroller")
    .uiza-chat-messages-wrapper
      div(class="uiza-chat-messages-item" v-for="message in chatMessages" v-bind:key="message.messageId")
        div.uiza-chat-messages-item-photo
          img(src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsHFOl5w6A4z7ot5suqTPa0OM4AggTKkfvdfdjrLy4KBelSAbyDw")
        div.uiza-chat-messages-item-info
          strong {{ message.sender.userId }} 
          span.time {{ message.createdAt | moment("from", "now") }}
          div.message {{ message.message }}
  .uiza-chat-input(:class="{ chatting: isChatting }")
    input(v-model="chatMessage" type='text' placeholder='Enter your message' v-on:keyup.enter="sendMessage")
    .uiza-chat-input-buttons
      button(@click="isLiked = !isLiked")
        i.uiza-chat-input-buttons-love(:class="{ animate: isLiked }" )
      //-   i.far.fa-heart
      //- button(v-if="isLiked" @click="isLiked = false")
      //-   i.fas.fa-heart
      button(@click="sendMessage")
        img(src="https://www.upsieutoc.com/images/2019/06/12/chat-icon.png")
</template>
<script>
import SendBird from "sendbird";

export default {
  props: [],
  mounted() {
    this.connectSendBird();
  },
  methods: {
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
              var ChannelHandler = new self.sb.ChannelHandler();
              ChannelHandler.onMessageReceived = function(channel, message) {
                console.log(channel, message);
                self.chatMessages.push(message);
              };
              self.sb.addChannelHandler("UNIQUE_HANDLER_ID", ChannelHandler);
            });
          }
        );
      });
    },
    loadMessages() {
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
    },
    scrollChat() {
      setTimeout(
        function() {
          this.$refs.chatScroller.scrollTop = this.$refs.chatScroller.scrollHeight;
        }.bind(this),
        100
      );
    },
    sendMessage() {
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
          self.isChatting = false;
        });
      } else {
        self.isChatting = false;
      }
    }
  },
  data() {
    return {
      sb: null,
      chatUser: "",
      isChatting: false,
      currentChannel: null,
      chatMessages: [],
      chatMessage: "",
      isLiked: false
    };
  }
};
</script>

<style lang="scss">
.uiza-chat {
  position: absolute;
  top: 130px;
  bottom: 90px;
  left: 0;
  width: 300px;
  max-width: 100%;
  display: flex;
  flex-direction: column;

  &-input {
    flex: 0 0 50px;
    display: flex;
    background: linear-gradient(
      180deg,
      rgba(156, 168, 182, 0.7) 0%,
      rgba(28, 44, 63, 0.7) 100%
    );
    border-radius: 0 20px 20px 0;
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
        padding: 0 !important;
        border: 0 !important;
        outline: none !important;
        background: transparent !important;
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
    align-items: flex-end;
    &::-webkit-scrollbar {
      display: none;
    }
    &-wrapper {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      pointer-events: none;
    }
    &-item {
      padding: 3px 10px 3px 10px;
      font-size: 14px;
      color: #eee;
      margin: 5px 0 5px 10px;
      overflow: hidden;
      flex: 1 1 auto;
      align-self: flex-start;
      min-width: 150px;
      background: linear-gradient(
        180deg,
        rgba(76, 143, 239, 0.65) 0%,
        rgba(29, 53, 87, 0.65) 100%
      );
      border-radius: 150px;
      &-photo {
        float: left;
        img {
          width: 36px;
          height: 36px;
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
</style>