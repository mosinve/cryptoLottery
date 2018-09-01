const LotteryToken = artifacts.require("LotteryToken");

module.exports = function(deployer) {
  deployer.deploy(LotteryToken, {
    value: 10000000000000000
  })
}
