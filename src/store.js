import Vue from 'vue'
import Vuex from 'vuex'
import Lottery from './contracts/Lottery'

Lottery.init(window.web3.currentProvider)

Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    account: null,
    balance: null,
    randomAccount: null
  },
  mutations: {
    SET_ACCOUNT (state, { account }) {
      state.account = account
    },
    SET_BALANCE (state, { balance }) {
      state.balance = balance / 100
    },
    SET_RND_ACCOUNT (state, { randomAccount }) {
      state.randomAccount = randomAccount
    }
  },
  actions: {
    async getAccount ({ commit }) {
      const accounts = await Vue.prototype.$web3.eth.getAccounts()
      commit('SET_ACCOUNT', { account: accounts[0] })
    },
    async getBalance ({ commit, state }) {
      const balance = await Lottery.getBalance(state.account)
      commit('SET_BALANCE', { balance })
    },
    async getRandomAccount ({ commit, state }) {
      const randomAccount = await Lottery.getRandomAccount({ from: state.account })
      commit('SET_RND_ACCOUNT', { randomAccount })
      return randomAccount
    }
  }
})
