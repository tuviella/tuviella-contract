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
    assert.equal(masterChefBalance, web3.utils.toWei('1000000', 'ether'), 'Masterchef balance is not correct');
  });

  
  it('Should substract txFee to amount sent', async () => {
    const masterChefBalance = web3.utils.fromWei((await contract.methods.balanceOf(masterChef).call()).toString(), 'ether') - 10 + 0.0175;

    await contract.methods.transfer(accounts[1], web3.utils.toWei('10', 'ether')).send({from:masterChef});

    assert.equal(masterChefBalance, web3.utils.fromWei((await contract.methods.balanceOf(masterChef).call()).toString(), 'ether') , 'incorrect fee charge');
    assert.equal(web3.utils.fromWei((await contract.methods.balanceOf(accounts[1]).call()).toString(), 'ether'), 10 - 0.07, "Incorrect fee charge");

    await contract.methods.transfer(accounts[2], web3.utils.toWei('5', 'ether')).send({from:accounts[1]});
    assert.equal(masterChefBalance + 0.00875, web3.utils.fromWei((await contract.methods.balanceOf(masterChef).call()).toString(), 'ether'), "incorrect random Holder");
  });

  it('Should let send all tuviellas', async () => {
    const masterChefBalance = await contract.methods.balanceOf(masterChef).call();

    await contract.methods.transfer(accounts[1], masterChefBalance).send({from:masterChef});

    assert.equal(await contract.methods.balanceOf(masterChef).call(), 0, "Balance should be 0");
  });
});
