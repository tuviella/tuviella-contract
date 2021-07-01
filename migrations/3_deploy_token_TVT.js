const TuviellaToken = artifacts.require('TuviellaToken');
const Faucet = artifacts.require("Faucet");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(TuviellaToken, accounts[0], Faucet.address);
}
