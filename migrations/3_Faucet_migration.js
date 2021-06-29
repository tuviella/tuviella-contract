const Faucet = artifacts.require("Faucet");

module.exports = function (deployer, network, accounts) {
  deployer.deploy(Faucet, accounts[0]);
};
