const TuviellaToken = artifacts.require('TuviellaToken');
const Staking = artifacts.require('Staking');

module.exports = async function (deployer, network, accounts) {
  
  //const viellasPerBlock = web3.utils.toWei('0.1', 'ether');
  const viellasPerBlock = web3.utils.toWei('7', 'ether');
  var tvt;
  var stk;

  if(network === 'development'){
    await deployer.deploy(TuviellaToken, accounts[0]);
    tvt = await TuviellaToken.deployed();
    await deployer.deploy(Staking, tvt.address, tvt.address, accounts[0] , viellasPerBlock, 0);

  }else{
    await deployer.deploy(TuviellaToken, '0x65cc85C1D3C2d0ADF0641e19Ab98edcc25A9C22B');
    tvt = await TuviellaToken.deployed();
    await deployer.deploy(Staking, tvt.address, tvt.address, '0x65cc85C1D3C2d0ADF0641e19Ab98edcc25A9C22B', viellasPerBlock, 0);
  }

  stk = await Staking.deployed();

  await tvt.setStakingMinter(stk.address);
};