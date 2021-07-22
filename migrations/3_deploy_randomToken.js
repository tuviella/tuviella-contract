const randomToken = artifacts.require('randomToken');

module.exports = function(deployer) {
  deployer.deploy(randomToken, BigInt(10**6 * 10**18));
}
