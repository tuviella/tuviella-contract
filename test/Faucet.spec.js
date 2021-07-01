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

    instanceT = await TuviellaToken.deployed(masterChef, fau_addr);
    vie_addr = instanceT.address;
    vie = new web3.eth.Contract(MIN_ABI, vie_addr);

  });

  it('Should divide initial funds in masterChef and faucet', async () => {
    assert.equal(fau_addr, instanceF.address, "Faucet address is not working");
    assert.equal(vie_addr, instanceT.address, "Tuviella address is not working");

    const masterChefBalance = web3.utils.fromWei((await vie.methods.balanceOf(masterChef).call()).toString(),'ether');
    assert.equal(masterChefBalance, "500000", "Mastercheff balance is not half million");

    const faucetBalance = web3.utils.fromWei((await vie.methods.balanceOf(fau_addr).call()).toString(),'ether');
    assert.equal(faucetBalance, "500000", "Faucet balance is not half million");
  });

  it('Should trigger receive function', async() =>{

    //TODO pago voluntario de eth para pagar fees. No debería ser necesario.
    assert.equal(await fau.methods.getEthBalance().call(), 0, "Balance of eth is not 0");
    await web3.eth.sendTransaction({from: masterChef, to: fau_addr, value: web3.utils.toWei('30', "ether")});
    assert.equal(await fau.methods.getEthBalance().call(), web3.utils.toWei('30', "ether"), "Balance of eth is not correct");
  });

  it('Should make masterChef owner of Tuviella', async () => {
    assert.equal(await fau.methods.getOwnerOf(accounts[2]).call(), 0, "MasterChef is not owner of tuviella");

    await fau.methods.makeMeOwner(vie_addr, web3.utils.toWei('10', "ether"), 1).send({from: masterChef});

    assert.equal(await fau.methods.getOwnerOf(vie_addr).call(), masterChef, "MasterChef is not owner of tuviella");
    assert.equal(await fau.methods.getAmountOf(vie_addr).call(), web3.utils.toWei('10', "ether"), "The claiming amount is not set correctly");
    assert.equal(await fau.methods.getSecsOf(vie_addr).call(), 1, "Cooldown is not set correctly");
  });


  it('Should never change the owner', async () => {
    try{
      await fau.methods.makeMeOwner(vie_addr, web3.utils.toWei('10', "ether"), 1).send({from: masterChef});
    }catch(ex){
      assert.equal(await fau.methods.getOwnerOf(vie_addr).call(), masterChef, "MasterChef is not owner of tuviella");
    }
  });


  it('Should return 0x000..00 as no owner', async () => {
    assert.equal(await fau.methods.getOwnerOf(accounts[2]).call(), 0, "MasterChef is not owner of tuviella");
  });


  it('Should let the owner set the cooldown', async () => {
    await fau.methods.setSecs(vie_addr ,2).send({from: masterChef});
    assert.equal(await fau.methods.getSecsOf(vie_addr).call(), 2, "Cooldown is not set correctly");
  });


  it('Should revert if not owner try to set the cooldown', async () => {
    try{
      await fau.methods.setSecs(4).call({from: accounts[2]});
    }catch(ex){
      assert.equal(await fau.methods.getSecsOf(vie_addr).call(), 2, "Cooldown is not set correctly");
    }
  });


  it('Should let the owner set the amount to claim', async () => {
    await fau.methods.setAmount(vie_addr, web3.utils.toWei('5', "ether")).send({from: masterChef});
    assert.equal(await fau.methods.getAmountOf(vie_addr).call(), web3.utils.toWei('5', "ether"), "Amount to claim is not set correctly");
  });


  it('Should revert if not owner try to set the amount to claim', async () => {
    try{
      await fau.methods.setAmount(vie_addr, web3.utils.toWei('7', "ether")).send({from: accounts[2]});
    }catch(ex){
      assert.equal(await fau.methods.getAmountOf(vie_addr).call(), web3.utils.toWei('5', "ether"), "Amount to claim is not set correctly");
    }
  });

  
  it('Should claim an amount', async () => {
    
    var initialBalance = web3.utils.fromWei((await vie.methods.balanceOf(accounts[3]).call()).toString(),'ether');
    assert.equal(initialBalance, 0, "Account is not empty");

    await fau.methods.claim(vie_addr).send({from: accounts[0]});

    
    const faucetBalance = web3.utils.fromWei((await vie.methods.balanceOf(fau_addr).call()).toString(),'ether');
    assert.equal(faucetBalance, "499995", "Faucet balance is not half million");
    const claimerBalance = web3.utils.fromWei((await vie.methods.balanceOf(accounts[1]).call()).toString(),'ether');
    assert.equal(claimerBalance, "500005", "Claimer balance is not correct");
    
  });


});
