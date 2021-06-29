const TuviellaToken = artifacts.require('TuviellaToken');

module.exports = function(deployer, network, accounts) {
  deployer.deploy(TuviellaToken, accounts[0], accounts[1]);
}
