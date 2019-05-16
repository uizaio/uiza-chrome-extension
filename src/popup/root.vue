<template lang="pug">
    div(class="root")
      el-tabs(v-model="activeTab")
        el-tab-pane(label="Settings" name="settings")
          Settings
        el-tab-pane(label="VODs" name="vods")
          Videos
        el-tab-pane(label="Livestreams" name="live")
          div hello 
</template>
<script>
  import Settings from './components/Settings'
  import Videos from './components/Videos'

  export default {
    components: {
      Settings,
      Videos
    },
    data: () => ({
      activeTab: 'vods'
    }),
    computed: { },
    created () { },
    mounted () { },
    methods: { }
  }
</script>
<style lang="scss">
  .root {
    min-width: 400px;
    min-height: 500px;
  }
</style>