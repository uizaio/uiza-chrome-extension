<template lang="pug">
    div(class="root")
      el-tabs(v-model="activeTab")
        el-tab-pane(label="Settings" name="settings")
          Settings(@settingsSaved="onSettingsSaved")
        el-tab-pane(label="Banners" name="banners")
          Banners
        el-tab-pane(label="VODs" name="vods")
          Videos(v-if="activeTab === 'vods'")
        el-tab-pane(label="Livestreams" name="live")
          LiveStreamings(v-if="activeTab === 'live'")
</template>
<script>
import Settings from "./Settings";
import Videos from "./Videos";
import LiveStreamings from "./LiveStreamings";
import Banners from "./Banners";

export default {
  components: {
    Settings,
    Videos,
    LiveStreamings,
    Banners
  },
  data: () => ({
    activeTab: "banners"
  }),
  computed: {},
  created() {},
  mounted() {},
  methods: {
    onSettingsSaved() {
      this.activeTab = "vods";
    }
  }
};
</script>
