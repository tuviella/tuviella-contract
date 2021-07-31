function toWei(num){
  return web3.utils.toWei(num.toString(), 'ether');
}
function fromWei(num){
  return web3.utils.fromWei(num.toString(), 'ether');
}


const Web3 = require('web3');
const TuviellaToken = artifacts.require('TuviellaToken');
const web3 = new Web3('http://localhost:8545');

contract('TuviellaToken', (accounts) => {
  const masterChef = accounts[0];
  let instance;
  let contractAddress;
  let contract;

  before(async () => {
    instance = await TuviellaToken.deployed(masterChef);
    contractAddress = instance.address;
    contract = new web3.eth.Contract(instance.abi, contractAddress);
  });

  it('Should mint initial funds to masterChef', async () => {
    const masterChefBalance = await contract.methods.balanceOf(masterChef).call();
    assert.equal(masterChefBalance, toWei(1000000), 'Masterchef balance is not correct');
  });

  
  it('Should substract txFee to amount sent', async () => {
    const masterChefBalance = fromWei((await contract.methods.balanceOf(masterChef).call())) - 10 + 0.0175;

    await contract.methods.transfer(accounts[1], toWei(10)).send({from:masterChef});

    assert.equal(masterChefBalance, fromWei((await contract.methods.balanceOf(masterChef).call())) , 'incorrect fee charge');
    assert.equal(fromWei((await contract.methods.balanceOf(accounts[1]).call())), 10 - 0.07, "Incorrect fee charge");

    await contract.methods.transfer(accounts[2], toWei(5)).send({from:accounts[1]});
    assert.equal(masterChefBalance + 0.00875, fromWei((await contract.methods.balanceOf(masterChef).call())), "incorrect random Holder");
  });

  it('Should let send all tuviellas', async () => {
    const masterChefBalance = await contract.methods.balanceOf(masterChef).call();

    await contract.methods.transfer(accounts[1], masterChefBalance).send({from:masterChef});

    assert.equal(await contract.methods.balanceOf(masterChef).call(), 0, "Balance should be 0");
  });

  it('Should pay to devs and burn', async () => {

    var bal = 5250026387812500000000;
    const txFee = toWei(100) * 70 / 10000;
    const amountBurn = txFee * 5000 / 10000;
    const amountDevs = txFee * 2500 / 10000;
    bal += amountBurn + amountDevs;

    var lastTxHolderFee  = toWei(100) * 0.007 * 0.25;
    const received = bal * 2500 / (2500 + 5000);

    var masterChefBalance = (lastTxHolderFee + received);
    masterChefBalance = Math.round(masterChefBalance / 10**8) * 10**8;

    assert.equal(await contract.methods.balanceOf(contractAddress).call(), 5250026387812500000000, "Balance should not be 0");

    assert.equal(await contract.methods.balanceOf(masterChef).call(), 0, "Incorrect masterchef balance");
    await contract.methods.transfer(accounts[2], toWei(100)).send({from: accounts[1]});

    assert.equal(await contract.methods.balanceOf(contractAddress).call(), bal, "Incorrect balance in contract");
    assert.equal(await contract.methods.balanceOf(masterChef).call(), lastTxHolderFee, "Incorrect masterchef balance");
    
    await contract.methods.devsGetPaid().send({from: accounts[1]});

    assert.equal(await contract.methods.balanceOf(masterChef).call(), masterChefBalance, "Amount recived by devs not correct");
    
    assert.equal(await contract.methods.balanceOf(contractAddress).call(), 0, "Balance should be 0");

  });
});
