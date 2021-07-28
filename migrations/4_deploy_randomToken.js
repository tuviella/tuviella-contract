const randomToken = artifacts.require('randomToken');

module.exports = function(deployer) {
  deployer.deploy(randomToken, web3.utils.toWei('1000000', 'ether'));
}
