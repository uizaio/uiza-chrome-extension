<template lang="pug">
div.uiza-ext-player-holder
    div.uiza-ext-player-holder-img(v-on:click.stop="showPlayer")
        img(src="https://2.bp.blogspot.com/-LaFuqxk9jag/Vwcx0NIk8jI/AAAAAAAAJBo/-u9AvpBVosU-lJZCoG6fKT23czNx1KKEg/s1600/hee.gif" alt="View live stream")
        span.uiza-ext-player-holder-text {{ thumbText }}
    //- el-dialog(:visible.sync="isDialogShown" :width="playerParams.width" :append-to-body="true" :lock-scroll="false" :id="rawId")
    div(ref="fixedPlayer" v-show="isDialogShown" id="uiza-ext-player-fixed" class="uiza-ext-player-fixed" :class="{ 'uiza-ext-player-fixed-minimized': isPip }")
        button.uiza-ext-player-fixed-close(@click="closePopup")
            i.fas.fa-times
        Player(v-if="isDialogShown" :params="playerParams" :settings="playerSettings" :json="jsonData" :id="rawId")
</template>

<script>
import Player from './Player';
import EventBus from '../EventBus';
import $ from 'jquery';

export default {
    components: {
        Player
    },
    created() {
        EventBus.$on('onTogglePIP', function() {
            // this.isDialogShown = !this.isDialogShown;
            this.isPip = !this.isPip;
        }.bind(this))
    },
    methods: {
        showPlayer($event) {
            $event.preventDefault();
            this.isDialogShown = true;
            setTimeout(function() {
                $(this.$refs.fixedPlayer).appendTo('body');
            }.bind(this), 100);
        },
        closePopup() {
            this.isDialogShown = false;
            this.counter++;
        }
    },
    computed: {
        playerParams() {
            return this.$parent.data.playerParams
        },
        playerSettings() {
            return this.$parent.data.playerSettings
        },
        jsonData() {
            return this.$parent.jsonData;
        },
        id() {
            return this.$parent.id + this.counter;
        },
        rawId() {
            return this.$parent.id.replace('#', '') + this.counter;
        },
        thumbText() {
            return this.playerParams.feedId ? 'Live' : 'VOD'
        }
    },
    data() {
        return {
            isDialogShown: false,
            isPip: false,
            counter: 0
        }
    }
}
</script>

<style lang="scss">
.uiza-ext-player-fixed {
    position: fixed;
    top: calc(50vh - 180px);
    left: calc(50vw - 340px);
    z-index: 9999999;
    &.uiza-ext-player-fixed-minimized {
        position: fixed !important;
        left: auto !important;
        top: auto !important;
        right: 5px !important;
        bottom: 5px !important;
    }
    &-close {
        position: absolute !important;
        top: -10px !important;
        right: -10px !important;
        background: #FFF !important;
        border: #CCC 1px solid !important;
        outline: none !important;
        border-radius: 100% !important;
        height: 36px !important;
        width: 36px !important;
        z-index: 2147483647;
        text-align: center;
        padding: 2px 0 0 0 !important;
    }
}
.uiza-ext-player-holder {
    width: 100%;
    height: 90%;
    position: relative;
    &-img {
        text-align: center;
        img {
            max-width: 100%;
            max-height: 90%;
            object-fit: cover;
        }
    }
    &-text {
        position: absolute;
        right: 10px;
        top: 10px;
        color: red;
        font-size: 16px;
        font-weight: 600;
    }
}
.el-dialog {
    &__header {
        padding: 0 !important;
    }
    &__body {
        padding: 0 !important;
    }
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
    background-color: rgba(0, 0, 0, .6) !important;
    .el-button {
      display: block;
      margin: 0 !important;
    }
  }
}
</style>