const LotteryToken = artifacts.require("LotteryToken");

module.exports = function(deployer) {
  deployer.deploy(LotteryToken, {
    value: 500000000000000000,
    gas: 6721975
  });
};
