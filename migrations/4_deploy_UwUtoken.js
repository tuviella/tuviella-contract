const UwUtoken = artifacts.require('UwUtoken');

module.exports = function(deployer) {
  deployer.deploy(UwUtoken, 10**6 * 10**18);
}
