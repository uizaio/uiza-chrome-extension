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
    brand_logo: "https://lavima.vn/wp-content/uploads/2018/08/logo-tiki.png",
    brand_url: "https://tiki.vn",
    cart_url: "https://tiki.vn/checkout/cart",
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
