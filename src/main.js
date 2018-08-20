import '@babel/polyfill'
import Vue from 'vue'
import './plugins/bootstrap-vue'
import App from './App.vue'
import Web3 from 'web3'
import store from './store'
Vue.config.productionTip = false

if (typeof web3 !== 'undefined') {
  console.warn(
    'Using web3 detected from external source.' +
    " If you find that your accounts don't appear or you have 0 MetaCoin," +
    " ensure you've configured that source properly." +
    ' If using MetaMask, see the following link.' +
    ' Feel free to delete this warning. :)' +
    ' http://truffleframework.com/tutorials/truffle-and-metamask'
  )
  // Use Mist/MetaMask's provider
  // eslint-disable-next-line no-undef
  window.web3 = new Web3(web3.currentProvider)
} else {
  console.warn(
    'No web3 detected. Falling back to http://127.0.0.1:9545.' +
    " You should remove this fallback when you deploy live, as it's inherently insecure." +
    ' Consider switching to Metamask for development.' +
    ' More info here: http://truffleframework.com/tutorials/truffle-and-metamask'
  )
  // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
  window.web3 = new Web3(
    new Web3.providers.HttpProvider('http://127.0.0.1:7545')
  )
}

Vue.prototype.$web3 = window.web3

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
