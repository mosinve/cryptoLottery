const LotteryCoin = artifacts.require('LotteryToken')

contract('LotteryCoin', function (accounts) {
  it('should deploy correctly', function () {
    return LotteryCoin.deployed().then(instance => assert.ok(instance))
  })

  it('should mint specified amount to owner', function () {
    const amountToMint = 1000
    let lottery
    return LotteryCoin.deployed()
      .then(async instance => {
        lottery = instance
        return lottery.mint(amountToMint)
      })
      .then(result => {
        return lottery.totalSupply()
      })
      .then(totalSupply => {
        assert.equal(totalSupply.toNumber(), amountToMint)
        return lottery.balanceOf(accounts[0])
      })
      .then(balance => assert.equal(balance.valueOf(), amountToMint))
  })

  it('should not mint if running not by owner', function () {
    const amountToMint = 2000
    let lottery
    return LotteryCoin.deployed()
      .then(async instance => {
        lottery = instance
        return lottery.mint(amountToMint, { from: accounts[1] })
      })
      .catch(error => assert(true))
      .then(result => result && assert.fail())
  })

  it('should transfer to specified account by owner', function () {
    const amountToTransfer = 1000
    let lottery
    return LotteryCoin.deployed()
      .then(async instance => {
        lottery = instance
        return lottery.transfer(accounts[1], amountToTransfer)
      })
      .catch(error => assert.ifError(error))
      .then(result => {
        return lottery.totalSupply()
      })
      .then(totalSupply => {
        assert.equal(totalSupply.toNumber(), amountToTransfer)
        return lottery.balanceOf(accounts[1])
      })
      .then(balance => {
        assert.equal(balance.valueOf(), amountToTransfer)
        return lottery.balanceOf(accounts[0])
      })
      .then(balance => {
        assert.equal(balance.valueOf(), 0)
      })
  })

  it('should not transfer to specified account by anyone else', function () {
    const amountToTransfer = 1000
    let lottery
    return LotteryCoin.deployed()
      .then(async instance => {
        lottery = instance
        return lottery.transfer(accounts[1], amountToTransfer, { from: accounts[1] })
      })
      .catch(error => assert(true))
      .then(result => {
        return lottery.totalSupply()
      })
      .then(totalSupply => {
        assert.equal(totalSupply.toNumber(), amountToTransfer)
        return lottery.balanceOf(accounts[1])
      })
      .then(balance => {
        assert.equal(balance.valueOf(), amountToTransfer)
        return lottery.balanceOf(accounts[0])
      })
      .then(balance => {
        assert.equal(balance.valueOf(), 0)
      })
  })
})
