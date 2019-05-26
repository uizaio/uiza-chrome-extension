import { getField, updateField } from 'vuex-map-fields';

const state = {
  settings: {
    api_key: "",
    app_id: ""
  },
  playerSettings: {
    width: '500px',
    height: '300px',
    color: "#FF0000",
    brand_logo:
      "https://storage.googleapis.com/shopdunk-images/tintucshopdunknew/2018/05/tai-sao-logo-hang-Apple-la-trai-tao-do-2.png",
    brand_url: "https://apple.com"
  }
};

export default {
  namespaced: true,
  state,
  getters: {
    getField
  },
  mutations: {
    updateField
  }
}
