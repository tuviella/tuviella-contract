const Faucet = artifacts.require("Faucet");
const TuviellaToken = artifacts.require('TuviellaToken');

module.exports = async function (deployer, network, accounts) {
  
  
  //Publico
  deployer.deploy(Faucet, '0x65cc85C1D3C2d0ADF0641e19Ab98edcc25A9C22B', TuviellaToken.address);

  //Local 
  //deployer.deploy(Faucet, accounts[1], TuviellaToken.address);
};