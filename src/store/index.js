import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import auth from './auth.module'
import loader from './loader.module'
import error from './error.module'
import users from './users.module'

Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
  key: 'authbase',
  storage: window.localStorage,
  reducer: (state) => ({ auth: { user: state.auth.user } })
})

export default new Vuex.Store({
  modules: {
    auth,
    loader,
    error,
    users
  },
  plugins: [
    vuexLocal.plugin
  ]
})
