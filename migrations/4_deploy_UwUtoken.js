const UwUtoken = artifacts.require('UwUtoken');

module.exports = function(deployer) {
  deployer.deploy(UwUtoken, BigInt(10**6 * 10**18));
}
