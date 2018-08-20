import contract from 'truffle-contract'
import lotteryTokenArtifact from '../../build/contracts/LotteryToken'

const Lottery = {
  contract: null,
  async init (provider) {
    this.contract = contract(lotteryTokenArtifact)
    this.contract.setProvider(provider)
    this.instance = await this.contract.deployed()
  },
  getBalance (account) {
    return this.contract.deployed().then(instance => {
      return instance.balanceOf(account)
    })
  },
  async getRandomAccount (params) {
    return this.contract.deployed().then(instance => {
      return instance.getRandomParticipant.call(params)
    })
  },
  async mint ({ account, amount }) {
    return this.contract.deployed().then(instance => {
      return instance.mint(amount * 100, { from: account })
    })
  },
  async transfer ({ from, to, amount }) {
    return this.contract.deployed().then(instance => {
      return instance.transfer(to, amount * 100, { from })
    })
  }
}

export default Lottery
