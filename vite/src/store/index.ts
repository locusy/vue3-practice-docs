import { createStore } from 'vuex'

interface State {
  userName: string
}

export default createStore({
  state(): State {
    return {
      userName: "子君",
    }
  },
  mutations: {},
  actions: {},
  modules: {}
})