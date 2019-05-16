<template lang="pug">
div
    div(id="player")
</template>

<script>
import storage from '../../ext/storage'
import constants from '../constants'

export default {
  props: ['entityId'],
  mounted() {
    const settings = storage.get(constants.SETTINGS_KEY)
    console.log(settings)
    window.UZ.Player.init(
      "#player",
      {
        api: btoa(settings.api_key),
        appId: settings.app_id,
        playerVersion: 4,
        entityId: this.entityId,
        width: "400px",
        height: "200px"
      },
      function(player) {
        // 4. You can add logo at here
        // 5. You can add event listeners at here
        player.on("play", function() {
          console.log("play");
        });
        player.on("pause", function() {
          console.log("pause");
        });
      }
    );
  }
};
</script>