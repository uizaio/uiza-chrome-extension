<template lang="pug">
    div(class="root")
      el-tabs(v-model="activeTab")
        el-tab-pane(label="Settings" name="settings")
          Settings
        el-tab-pane(label="VODs" name="vods")
          Videos
        el-tab-pane(label="Livestreams" name="live")
          LiveStreamings
</template>
<script>
import Settings from "./Settings";
import Videos from "./Videos";
import LiveStreamings from "./LiveStreamings";

export default {
  components: {
    Settings,
    Videos,
    LiveStreamings
  },
  data: () => ({
    activeTab: "settings"
  }),
  computed: {},
  created() {},
  mounted() {},
  methods: {}
};
</script>
