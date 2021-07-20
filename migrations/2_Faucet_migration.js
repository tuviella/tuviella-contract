const Faucet = artifacts.require("Faucet");

module.exports = function (deployer, network, accounts) {
  deployer.deploy(Faucet, accounts[1]);
  //deployer.deploy(Faucet, '0xC1f60612b749b7DC89Eb99d5b18EaF56EB438fFC');
};
