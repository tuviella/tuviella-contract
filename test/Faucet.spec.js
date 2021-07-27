const Web3 = require('web3');
const Faucet = artifacts.require('Faucet');
const UwUToken = artifacts.require('randomToken');

const web3 = new Web3('http://localhost:8545');


contract('Faucet', (accounts) => {
  const owner = accounts[0];
  const admin = accounts[1];
  let instanceF;
  let fau_addr;
  let fau;

  let instanceT;
  let uwu;
  let uwu_addr;

  before(async () => {
    instanceF = await Faucet.deployed(admin);
    fau_addr = instanceF.address;
    fau = new web3.eth.Contract(instanceF.abi, fau_addr);

    instanceT = await UwUToken.deployed(admin, fau_addr);
    uwu_addr = instanceT.address;
    uwu = new web3.eth.Contract(instanceT.abi, uwu_addr);

  });

  it('Should trigger receive function', async() =>{
    //TODO pago voluntario de eth para pagar fees. No debería ser necesario.
    assert.equal(await fau.methods.getEthBalance().call(), 0, "eth balance is not 0");
    await web3.eth.sendTransaction({from: owner, to: fau_addr, value: web3.utils.toWei('30', "ether")});
    assert.equal(await fau.methods.getEthBalance().call(), web3.utils.toWei('30', "ether"), "Balance of eth is not correct");
    await fau.methods.getEther().send({from: admin});
    assert.equal(await fau.methods.getEthBalance().call(), web3.utils.toWei('0', "ether"), "Balance of eth is not 0 after getEther");
  });

  it('Should send tokens to the faucet', async() =>{
    assert.equal(await uwu.methods.balanceOf(fau_addr).call(), 0, "Balance of faucet is not 0");
    await fau.methods.makeMeOwner(uwu_addr, web3.utils.toWei('10', "ether"), 1).send({from: owner});
    await uwu.methods.transfer(fau_addr, web3.utils.toWei('500000', "ether")).send({from: owner});

    assert.equal(await uwu.methods.balanceOf(fau_addr).call(), web3.utils.toWei('500000', "ether"), "token balance is not correct");
    assert.equal(await fau.methods.getOwnerOf(uwu_addr).call(), owner, "owner is not owner of token");
    assert.equal(await fau.methods.getAmountOf(uwu_addr).call(), web3.utils.toWei('10', "ether"), "amount is correct");
    assert.equal(await fau.methods.getSecsOf(uwu_addr).call(), 1, "cooldown is correct");
  });


  it('Should never change the owner', async () => {
    try{
      await fau.methods.makeMeOwner(uwu_addr).send({from: admin});
    }catch(ex){
      assert.equal(await fau.methods.getOwnerOf(uwu_addr).call(), owner, "owner is not owner of UwU");
    }
  });

  it('Should let the owner set up the token distribution', async () => {
    await fau.methods.setUpToken(uwu_addr, web3.utils.toWei('5', "ether"), 2).send({from: owner});
    assert.equal(await fau.methods.getSecsOf(uwu_addr).call(), 2, "Cooldown is not set correctly");
    assert.equal(await fau.methods.getAmountOf(uwu_addr).call(), web3.utils.toWei('5', "ether"), "Amount to claim is not set correctly");
  });

  it('Should return 0x000..00 as no owner', async () => {
    assert.equal(await fau.methods.getOwnerOf(accounts[2]).call(), 0, "owner is not owner of token");
  });

  it('Should revert if not owner try to set up the token distribution', async () => {
    try{
      await fau.methods.setUpToken(uwu_addr, web3.utils.toWei('5', "ether"), 4).send({from: admin});
    }catch(ex){
      assert.equal(await fau.methods.getSecsOf(uwu_addr).call(), 2, "Cooldown is not set correctly");
    }
  });

  
  it('Should claim an amount', async () => {
    
    var initialBalance = web3.utils.fromWei((await uwu.methods.balanceOf(accounts[2]).call()).toString(),'ether');
    assert.equal(initialBalance, 0, "Account is not empty");

    await fau.methods.claim(uwu_addr).send({from: accounts[2]});
    
    const faucetBalance = web3.utils.fromWei((await uwu.methods.balanceOf(fau_addr).call()).toString(),'ether');
    assert.equal(faucetBalance, 499995, "Faucet balance is not half million");
    const claimerBalance = web3.utils.fromWei((await uwu.methods.balanceOf(accounts[2]).call()).toString(),'ether');
    assert.equal(claimerBalance, 5, "Claimer balance is not correct");
  });

  it('Should not let unknown users empty the faucet', async()=>{
    try{
      await fau.methods.vaciarFaucet(uwu_addr).send({from: admin});
    }catch(ex){
      const faucetBalance = web3.utils.fromWei((await uwu.methods.balanceOf(fau_addr).call()).toString(),'ether');
      assert.equal(faucetBalance, 499995 , "Faucet balance is not correct");
    }
  });

  it('Should let to owner empty the faucet', async()=>{
    await fau.methods.vaciarFaucet(uwu_addr).send({from: owner});
    const faucetBalance = web3.utils.fromWei((await uwu.methods.balanceOf(fau_addr).call()).toString(),'ether');
    assert.equal(faucetBalance, 0, "Faucet balance is not half million");
    const ownerBalance = web3.utils.fromWei((await uwu.methods.balanceOf(owner).call()).toString(),'ether');
    assert.equal(ownerBalance, 999995, "Owner balance is not half million");
  });

  it('Should let admin or owner unset the owner of a token', async()=>{
    await fau.methods.unsetOwner(uwu_addr).send({from: owner});
    assert.equal(await fau.methods.getOwnerOf(uwu_addr).call(), 0, 'The token has owner');

    await fau.methods.makeMeOwner(uwu_addr, web3.utils.toWei('3','ether'), 2).send({from: owner});

    await fau.methods.unsetOwner(uwu_addr).send({from: admin});
    assert.equal(await fau.methods.getOwnerOf(uwu_addr).call(), 0, 'The token has owner');
  });

  it('Should not let unknown user unset the owner of a token', async()=>{
    await fau.methods.makeMeOwner(uwu_addr, web3.utils.toWei('3','ether'), 2).send({from: accounts[3]});
    try{
      await fau.methods.unsetOwner(uwu_addr).send({from: accounts[2]});
    }catch(ex){
      assert.equal(await fau.methods.getOwnerOf(uwu_addr).call(), accounts[3], 'The token has not owner');
      await fau.methods.unsetOwner(uwu_addr).send({from:  accounts[3]});
    }
  });

  it('Should not let unknown user set an admin', async()=>{
    try{
      await fau.methods.setAdmin(owner).send({from: owner});
    }catch(ex){
      //set admin falta implementar
      //await fau.methods.setAdmin(owner).send({from: admin});
      //await fau.methods.setAdmin(admin).send({from: owner});
    }
  });

  it('Should fill the faucet', async() => {
    await uwu.methods.transfer(fau_addr, web3.utils.toWei('500000', 'ether')).send({from: owner});
    await fau.methods.makeMeOwner(uwu_addr, web3.utils.toWei('5', "ether"), 10).send({from: owner});
  });

  it('Should NOT let an user claim twice', async () => {

    
    var initialBalance = web3.utils.fromWei((await uwu.methods.balanceOf(accounts[3]).call()).toString(),'ether');
    assert.equal(initialBalance, 0, "Account is not empty");

    await fau.methods.claim(uwu_addr).send({from: accounts[3]});
    try{
      await fau.methods.claim(uwu_addr).send({from: accounts[3]});
    }catch(ex){
      const claimerBalance = web3.utils.fromWei((await uwu.methods.balanceOf(accounts[3]).call()).toString(),'ether');
      assert.equal(claimerBalance, 5, "Claimer balance is not correct");
    }


  });
  
  it('Should unset admin', async()=>{
    await fau.methods.unsetAdmin(admin).send({from: admin});
    try{
      await fau.methods.unsetAdmin(admin).send({from: admin});
      assert.equal(0,1,"Exception not thrown");
    }catch(ex){
    }
  });

});
