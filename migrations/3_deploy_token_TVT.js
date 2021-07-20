const TuviellaToken = artifacts.require('TuviellaToken');
const Faucet = artifacts.require("Faucet");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(TuviellaToken, accounts[0], Faucet.address);
  //deployer.deploy(TuviellaToken, '0xC1f60612b749b7DC89Eb99d5b18EaF56EB438fFC', Faucet.address);
}
