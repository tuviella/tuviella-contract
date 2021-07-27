const Faucet = artifacts.require("Faucet");
const TuviellaToken = artifacts.require('TuviellaToken');

module.exports = async function (deployer, network, accounts) {
  
  
  //Publico
  deployer.deploy(TuviellaToken, '0x65cc85C1D3C2d0ADF0641e19Ab98edcc25A9C22B', '0x65cc85C1D3C2d0ADF0641e19Ab98edcc25A9C22B');
  deployer.deploy(Faucet, '0x65cc85C1D3C2d0ADF0641e19Ab98edcc25A9C22B', "0xA126412AD78D70E23f2b00e778dB4B1cBC0a0150");
  //*/

  /*
  //Local 
  deployer.deploy(Faucet, accounts[1], TuviellaToken.address);
  deployer.deploy(TuviellaToken, accounts[0], Faucet.address);
  //*/
};