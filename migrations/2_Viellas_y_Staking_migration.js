const TuviellaToken = artifacts.require('TuviellaToken');
const Staking = artifacts.require('Staking');
const Reward = artifacts.require('Reward');
const Faucet = artifacts.require("Faucet");
const RandomToken = artifacts.require('RandomToken');

module.exports = async function (deployer, network, accounts) {
  
  //const viellasPerBlock = web3.utils.toWei('0.1', 'ether');
  const viellasPerBlock = web3.utils.toWei('7', 'ether');
  var tvt;
  var stk;
  var rwrd;
  var rnd;
  var fau;

  if(network === 'development'){
    await deployer.deploy(TuviellaToken, accounts[0]);
    tvt = await TuviellaToken.deployed();

    await deployer.deploy(Reward, tvt.address);
    rwrd = await Reward.deployed();

    await deployer.deploy(Staking, tvt.address, tvt.address, accounts[0] , viellasPerBlock, 0, rwrd.address);
    await deployer.deploy(Faucet, accounts[1], tvt.address);

  }else{
    await deployer.deploy(TuviellaToken, '0x65cc85C1D3C2d0ADF0641e19Ab98edcc25A9C22B');
    tvt = await TuviellaToken.deployed();

    await deployer.deploy(Reward, tvt.address);
    rwrd = await Reward.deployed();

    await deployer.deploy(Staking, tvt.address, tvt.address, '0x65cc85C1D3C2d0ADF0641e19Ab98edcc25A9C22B', viellasPerBlock, 0);
    await deployer.deploy(Faucet, '0x65cc85C1D3C2d0ADF0641e19Ab98edcc25A9C22B', tvt.address);
  }

  await deployer.deploy(RandomToken, web3.utils.toWei('1000000', 'ether'));

  rnd = await RandomToken.deployed(); 
  fau = await Faucet.deployed()
  stk = await Staking.deployed();

  await rwrd.setStakingAddress(stk.address);
  await tvt.setStakingMinter(stk.address);
  



  var content = "export const " + network + "TuViellaAddress = \"" + tvt.address + "\"\n";
  content += "export const " + network + "FaucetAddress = \"" + fau.address + "\"\n";
  content += "export const " + network + "StakingAddress = \"" + stk.address + "\"\n";
  content += "export const " + network + "RandomTokenAddress = \"" + rnd.address + "\"\n";

  var fs = require('fs');
  fs.writeFile(network + ".js", content, (err)=>{
    if(err){
      console.log(err);
    }
  });


  };