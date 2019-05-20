import Vue from "vue";
import Vuex from "vuex";
import settings from "./settings";

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";

export default new Vuex.Store({
  modules: {
    settings
  },
  strict: debug
});
