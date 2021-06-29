const Web3 = require('web3');
const Faucet = artifacts.require('Faucet');
const TuviellaToken = artifacts.require('TuviellaToken');
var { MIN_ABI } = require('./utils');
const web3 = new Web3('http://localhost:8545');

contract('Faucet', (accounts) => {
  const masterChef = accounts[0];
  let instanceF;
  let fau_addr;
  let fau;

  let instanceT;
  let vie;
  let vie_addr;

  before(async () => {
    instanceF = await Faucet.deployed(masterChef);
    fau_addr = instanceF.address;
    fau = new web3.eth.Contract(MIN_ABI, fau_addr);
  }).then(async ()=>{
    instanceT = await TuviellaToken.deployed(masterChef, fau_addr);
    vie_addr = instanceT.address;
    vie = new web3.eth.Contract(MIN_ABI, vie_addr);

  });

  it('Should make you owner of a token', async () => {
    assert.equal(fau_addr, instanceF.address, "Las direcciones van mal fau");
    assert.equal(vie_addr, instanceT.address, "Las direcciones van mal vie");

    const masterChefBalance = web3.utils.fromWei((await vie.methods.balanceOf(masterChef).call()).toString(),'ether');
    assert.equal(masterChefBalance, "500000", "El balance del mastercheff no es medio millón");

    const faucetBalance = web3.utils.fromWei((await vie.methods.balanceOf(fau_addr).call()).toString(),'ether');
    assert.equal(faucetBalance, "500000", "El balance de la faucet no es medio millón");


    //await fau.methods.makeMeOwner(vie_addr, web3.utils.toWei('1','ether')).send({from: masterChef});
  });

/*
  it('Should send an amount to the faucet and set the owner of a token', async () => {
    await contract.receiveTokens(web3.utils.toWei('100','ether'), tuviella, web3.utils.toWei('1','ether')).send({from: accounts[1]});

    const masterChefBalance =  await contract.methods.balanceOf(masterChef).call();
    const faucetBalance = await contract.methods.balanceOf(faucet).call();
    assert.equal(masterChefBalance, faucetBalance, 'Faucet and master chef balances are not equal');
  });
*/

});
