const RandomToken = artifacts.require('RandomToken');

module.exports = async function(deployer) {
  await deployer.deploy(RandomToken, web3.utils.toWei('1000000', 'ether'));
}
