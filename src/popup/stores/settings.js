import { getField, updateField } from 'vuex-map-fields';

const state = {
  settings: {
    api_key: "",
    app_id: ""
  },
  playerSettings: {
    width: '685px',
    height: '385px',
    color: "#FF0000",
    brand_logo:
      "https://storage.googleapis.com/shopdunk-images/tintucshopdunknew/2018/05/tai-sao-logo-hang-Apple-la-trai-tao-do-2.png",
    brand_url: "https://apple.com",
    cart_url: "https://google.com",
    ads: [
      {
        time: new Date(2017, 12, 12, 0, 0, 10, 0),
        duration: 10
      }
    ]
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
