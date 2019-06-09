<template lang="pug">
  div.root
    router-view
</template>
<style lang="scss">
.root {
  min-width: 400px;
  min-height: 520px;
}
</style>

<script>
import Home from "./components/Home";

export default {
  components: {
    Home
  }
};
</script>