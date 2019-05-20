import Vue from 'vue'
import Vuex from 'vuex'
import root from './root.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en'
import router from './router'
import store from './stores/index'

Vue.config.productionTip = false
Vue.use(Vuex)
Vue.use(ElementUI, { locale })

/* eslint-disable no-new */
new Vue({
  el: '#root',
  router,
  store,
  render: h => h(root)
  // eslint-disable-next-line eol-last
})