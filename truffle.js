/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() {
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>')
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: 'localhost',
      port: 7545,
      network_id: '*', // Match any network id
      gas: 500000
    },
    rsk: {
      gas: 2500000,
      gasPrice: 1,
      host: '40.113.113.161',
      from: '0xcfb6620fb480e0de1d58f854fc58a35bb266dfaf',
      port: 4444,
      network_id: '*' // Match any network id
    }
  }
}
