import { expect } from 'chai'
import Web3 from 'web3'
import Lottery from '../../src/contracts/Lottery'

describe('Lottery', () => {
  it('should init', () => {
    const web3Provider = new Web3.providers.HttpProvider('HTTP://127.0.0.1:7545')
    Lottery.init(web3Provider)
    console.log(Lottery.contract.web3.currentProvider)
    console.log(Lottery.instance)
    expect(Lottery.instance).to.be.a('object')
  })
})
