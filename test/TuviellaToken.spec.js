const Web3 = require('web3');
const TuviellaToken = artifacts.require('TuviellaToken');
var { MIN_ABI } = require('./utils');
const web3 = new Web3('http://localhost:8545');

contract('TuviellaToken', (accounts) => {
  const masterChef = accounts[0];
  const faucet = accounts[1];
  let instance;
  let contractAddress;
  let contract;

  before(async () => {
    instance = await TuviellaToken.deployed(masterChef, faucet);
    contractAddress = instance.address;
    contract = new web3.eth.Contract(MIN_ABI, contractAddress);
  });

  it('Should divide initial funds in masterChef and faucet', async () => {
    const masterChefBalance =   await contract.methods.balanceOf(masterChef).call();
    const faucetBalance = await contract.methods.balanceOf(faucet).call();
    assert.equal(masterChefBalance, faucetBalance, 'Faucet and master chef balances are not equal');
  });
});
