const Web3 = require('web3');
const TuviellaToken = artifacts.require('TuviellaToken');

const web3 = new Web3('http://localhost:8545');

contract('TuviellaToken', (accounts) => {
  const masterChef = accounts[0];
  const faucet = accounts[1];
  let instance;
  let contractAddress;

  before(async () => {
    instance = await TuviellaToken.deployed(masterChef, faucet);
    contractAddress = instance.address;
  });

  it('Should divide initial funds in masterChef and faucet', () => {
    const masterChefBalance = instance.balanceOf(masterChef);
    const faucetBalance = instance.balanceOf(faucet);
    assert.equal(masterChefBalance, faucetBalance, 'Faucet and master chef balances are not equal');
  });
});
