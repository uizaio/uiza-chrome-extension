<template lang="pug">
div.uiza-ext-player-holder
    div.uiza-ext-player-holder-img(v-on:click.stop="showPlayer")
        img(src="https://2.bp.blogspot.com/-LaFuqxk9jag/Vwcx0NIk8jI/AAAAAAAAJBo/-u9AvpBVosU-lJZCoG6fKT23czNx1KKEg/s1600/hee.gif" alt="View live stream")
        span.uiza-ext-player-holder-text Live
    el-dialog(:visible.sync="isDialogShown" :width="playerParams.width" :append-to-body="true" :id="rawId")
        Player(:params="playerParams" :settings="playerSettings" :json="jsonData" :id="id")
</template>

<script>
import Player from './Player';
export default {
    components: {
        Player
    },
    methods: {
        showPlayer($event) {
            $event.preventDefault();
            this.isDialogShown = true
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
            return this.$parent.id;
        },
        rawId() {
            return this.$parent.id.replace('#', '');
        }
    },
    data() {
        return {
            isDialogShown: false
        }
    }
}
</script>

<style lang="scss">
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
</style>