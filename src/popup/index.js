import Vue from 'vue'
import Vuex from 'vuex'
import root from './root.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import 'csshake/dist/csshake.css';
import 'animate.css';
import "@fortawesome/fontawesome-free/js/all.js";
import locale from 'element-ui/lib/locale/lang/en';
import "prismjs";
import "vue-prism-editor/dist/VuePrismEditor.css";
import "prismjs/themes/prism.css";
import VueAnime from "vue-animejs";
import router from './router'
import store from './stores/index'

Vue.config.productionTip = false
Vue.use(Vuex)
Vue.use(ElementUI, {
  locale
})
Vue.use(VueAnime)
Vue.use(require('vue-moment'))

/* eslint-disable no-new */
new Vue({
  el: '#root',
  router,
  store,
  render: h => h(root)
  // eslint-disable-next-line eol-last
})