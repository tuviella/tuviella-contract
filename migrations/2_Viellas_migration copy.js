
const TuviellaToken = artifacts.require('TuviellaToken');

module.exports = async function (deployer, network, accounts) {
  
  //deployer.deploy(TuviellaToken, '0x65cc85C1D3C2d0ADF0641e19Ab98edcc25A9C22B');
  
  deployer.deploy(TuviellaToken, accounts[0]);
  
};