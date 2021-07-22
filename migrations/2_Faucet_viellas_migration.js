const Faucet = artifacts.require("Faucet");
const TuviellaToken = artifacts.require('TuviellaToken');

module.exports = function (deployer, network, accounts) {
  deployer.deploy(Faucet, accounts[1], TuviellaToken.address);
  //deployer.deploy(Faucet, '0xC1f60612b749b7DC89Eb99d5b18EaF56EB438fFC', TuviellaToken.address);

  deployer.deploy(TuviellaToken, accounts[0], Faucet.address);
  //deployer.deploy(TuviellaToken, '0xC1f60612b749b7DC89Eb99d5b18EaF56EB438fFC', Faucet.address);
};