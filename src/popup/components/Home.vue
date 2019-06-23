<template lang="pug">
    div(class="root")
      el-tabs(v-model="activeTab")
        el-tab-pane(label="Settings" name="settings")
          Settings(@settingsSaved="onSettingsSaved")
        el-tab-pane(label="Banners" name="banners")
          Banners
        el-tab-pane(label="Custom Style" name="css")
          CustomCss
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
import CustomCss from "./CustomCss";

export default {
  components: {
    Settings,
    Videos,
    LiveStreamings,
    Banners,
    CustomCss
  },
  data: () => ({
    activeTab: "css"
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
