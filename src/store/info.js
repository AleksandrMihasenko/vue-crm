import firebase from "firebase/app";

export default {
  state: {
    info: {}
  },
  mutations: {
    setInfo(state, info) {
      state.info = info;
    },
    clearInfo(state) {
      state.info = {};
    }
  },
  actions: {
    async updateInfo({ dispatch, commit, getters }, toUpdate) {
      try {
        const uid = await dispatch("getUid");
        const updateData = {...getters.info, ...toUpdate};
        await firebase.database().ref(`/users/${uid}/info`).update(updateData);
        commit("setInfo", updateData);
      } catch (error) {
        commit("setError", error);
        throw error;
      }
    },
    async fetchInfo({ dispatch, commit }) {
      try {
        const uid = await dispatch("getUid");
        const info = (
          await firebase
            .database()
            .ref(`/users/${uid}/info`)
            .once("value")
        ).val();
        commit("setInfo", info);
      } catch (error) {
        commit("setError", error);
        throw error;
      }
    }
  },
  getters: {
    info: state => state.info
  }
}
