<template lang="pug">
div
  div(v-if='isConfigured' class="medias" v-loading="isLoading" element-loading-text="Loading... Please wait for a moment")
      //- el-button(@click="load") Load
      div(draggable class='item' v-for="item in vods" @click="playItem(item)")
          div(class='item-thumbnail')
              img(:src='item.thumbnail || "https://dashboard.uiza.io/assets/img/image-not-available.jpg"')
          div(class='item-content')
              h4 {{ item.name }}
              p.date {{ item.createdAt }}
      Player(v-if="playing" :entityId="playing.id")
  div(v-else)
    | Not configured
</template>
<style lang="scss">
.item {
  display: flex;
  padding: 10px 0;
  border-bottom: #eee 1px solid;
  cursor: pointer;
  &-thumbnail {
    flex: 0 0 120px;
    img {
      max-width: 120px;
    }
  }
  &-content {
    flex: 1;
    padding-left: 10px;
    h4 {
      margin-top: 0;
    }
  }
}
</style>
<script>
import uiza from "../services/uiza";
import Player from "./Player";

export default {
  components: {
    Player
  },
  created() {},
  mounted() {
    this.load();
  },
  computed: {
    isConfigured: uiza.isConfigured
  },
  methods: {
    load() {
      if (this.isConfigured) {
        this.isLoading = true;
        uiza.getVODs().then(resp => {
          this.vods = resp.data;
          this.isLoading = false;
        });
      }
    },
    playItem(item) {
      this.$router.push({
        name: "play",
        params: {
          id: item.id
        }
      });
    }
  },
  data() {
    return {
      isLoading: false,
      vods: [],
      playing: null
    };
  }
};
</script>