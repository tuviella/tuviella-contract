const Web3 = require('web3');
const Faucet = artifacts.require('Faucet');
const TuviellaToken = artifacts.require('TuviellaToken');
const web3 = new Web3('http://localhost:8545');

contract('TuviellaToken', (accounts) => {
  const masterChef = accounts[0];
  let faucet;
  let FInstance;
  let instance;
  let contractAddress;
  let contract;

  before(async () => {
    FInstance = await Faucet.deployed(masterChef);
    faucet = FInstance.address;

    instance = await TuviellaToken.deployed(masterChef, faucet);
    contractAddress = instance.address;
    contract = new web3.eth.Contract(instance.abi, contractAddress);
  });

  it('Should divide initial funds in masterChef and faucet', async () => {
    const masterChefBalance =   await contract.methods.balanceOf(masterChef).call();
    const faucetBalance = await contract.methods.balanceOf(faucet).call();
    assert.equal(masterChefBalance, faucetBalance, 'Faucet and master chef balances are not equal');
  });
});
