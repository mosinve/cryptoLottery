<template lang='pug'>
.container#app
  .row.justify-content-center.align-items-center.h-100
    .card-group
      b-card(no-body)
        b-card-header Balance  {{ balance }}
        b-tabs(card)
          b-tab(title = 'Refill token balance')
            form.form(@submit.prevent = 'mint')
              .form-group
                input.form-control(type = 'number'
                                   placeholder = 'Amount of coins'
                                   v-model = 'amountToMint')
              button.btn.btn-primary(type = 'submit') Deposit
          b-tab(title = 'Raffle prize')
            form.form(@submit.prevent = 'transferRandom')
              | Transfer to {{ randomAccount }}
              .form-group
                input.form-control(type = 'number'
                                   placeholder = 'Amount of coins'
                                   v-model = 'prize')
              button.btn.btn-primary(type = 'submit') Transfer
          b-tab(title = 'Send to')
            form.form(@submit.prevent = 'transfer')
              .form-group
                input.form-control(type = 'text'
                                   placeholder = 'Recipient address'
                                   v-model = 'recipient')
              .form-group
                input.form-control(type = 'number'
                                   placeholder = 'Amount of coins'
                                   v-model = 'amountToTransfer')
              button.btn.btn-primary(type = 'submit') Send
</template>

<script>
import Lottery from './contracts/Lottery'

import { mapState, mapActions } from 'vuex'

export default {
  name: 'App',

  data () {
    return {
      amountToMint: null,
      amountToTransfer: null,
      recipient: null,
      prize: null
    }
  },

  async mounted () {
    await this.getAccount()
    this.getBalance(this.account)
  },

  computed: {
    ...mapState([ 'account', 'balance', 'randomAccount' ])
  },

  methods: {
    ...mapActions(['getAccount', 'getBalance', 'getRandomAccount']),
    async mint () {
      Lottery.mint({ amount: this.amountToMint, account: this.account }).then(result => {
        this.getBalance(this.account)
      })
    },
    async transfer () {
      await Lottery.transfer({ amount: this.amountToTransfer, from: this.account, to: this.recipient })
      this.getBalance(this.account)
    },
    async transferRandom () {
      this.getRandomAccount().then(
        async account => {
          await Lottery.transfer({ amount: this.prize, from: this.account, to: account })
        }
      )
      this.getBalance(this.account)
    }
  }
}
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
