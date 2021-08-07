function toWei(num){
  return web3.utils.toWei(num.toString(), 'ether');
}
function fromWei(num){
  return web3.utils.fromWei(num.toString(), 'ether');
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const Web3 = require('web3');
const Staking = artifacts.require('Staking');
const RandomToken = artifacts.require('RandomToken');
const TuviellaToken = artifacts.require('TuviellaToken');
const web3 = new Web3('http://localhost:8545');

contract('Staking', (accounts) => {
  const masterChef = accounts[0];
  let instanceStk;
  let stk_addr;
  let stk;
  
  let instanceT;
  let token;
  let token_addr;
  
  let instanceViellas;
  let viellas;
  let viellas_addr;


  before(async () => {
    instanceStk = await Staking.deployed(masterChef);
    stk_addr = instanceStk.address;
    stk = new web3.eth.Contract(instanceStk.abi, stk_addr);

    instanceT = await RandomToken.deployed(masterChef);
    token_addr = instanceT.address;
    token = new web3.eth.Contract(instanceT.abi, token_addr);

    instanceViellas = await TuviellaToken.deployed(masterChef);
    viellas_addr = instanceViellas.address;
    viellas = new web3.eth.Contract(instanceViellas.abi, viellas_addr);
  });

  it('Should get length of the pool. Only TUVIELLA pool created', async () => {
    var len = await stk.methods.poolLength().call({from: accounts[1]});
    assert.equal(len, 1, "Incorrect pool length.");
  });


  it('Should add a pool', async () => {
    await stk.methods.add(1000, token_addr, true).send({from: masterChef, gasLimit: 1000000});
    var len = await stk.methods.poolLength().call({from: accounts[1]});
    assert.equal(len, 2, "Incorrect pool length.");
  });


  it('Should get pool info', async () => {
    var poolInfo = await stk.methods.poolInfo(0).call();
    assert.equal(poolInfo[0], viellas_addr, "viellas and poolInfo[0] are not same");

    var poolInfo = await stk.methods.poolInfo(1).call();
    assert.equal(poolInfo[0], token_addr, "token and poolInfo[1] are not same");
  });

 
  it('Should deposit an amount', async () => {

    const amount = 100;
    await token.methods.approve(stk_addr, toWei(amount)).send({from: masterChef});
    await stk.methods.deposit(1, toWei(amount)).send({from: masterChef, gasLimit: 1000000});
  });

  it('Should withdraw all', async () => {

    var viellasBalance = await viellas.methods.balanceOf(stk_addr).call();

    var userInfo = await stk.methods.userInfo(1, masterChef).call();
    await stk.methods.withdraw(1, userInfo[1]).send({from: masterChef, gasLimit: 1000000});
    userInfo = await stk.methods.userInfo(1, masterChef).call();
    assert.equal(userInfo[1], 0, "User have balance in platform");

    assert.equal(viellasBalance < await viellas.methods.balanceOf(stk_addr).call(), true, "Viellas not received by staking")
  });

  it('Should show pending viellas', async () => {
    await stk.methods.massUpdatePools().send({from: masterChef, gasLimit: 1000000});
    var pending = await stk.methods.pendingViellas(1, masterChef).call();
    assert.equal(pending, 0, "There's pendng viellas")
  });
  
  it('Should calculate rewards comparing devs rewards and staking rewards', async () => {
    await stk.methods.massUpdatePools().send({from: masterChef, gasLimit: 1000000});
    await sleep(8000);

    const devsTotalReward = parseInt((await viellas.methods.balanceOf(viellas_addr).call()).toString());
    //assert.equal(num_prueba, devsTotalReward, "Incorrect devs total reward");

    const poolsReward = await viellas.methods.balanceOf(stk_addr).call();
    
    const condition = devsTotalReward < Math.floor(poolsReward / 10) + 10 && devsTotalReward > Math.floor(poolsReward / 10) - 10;

    assert.equal(condition, true, "devs: " + devsTotalReward + ", pools: " + Math.floor(poolsReward / 10) + ". Not equal");
  });
  






  it('Only devSetter should change dev address', async () => {
    try{
      await stk.methods.dev(accounts[1]).send({from: accounts[1]});
      assert.equal(0,1, "Not dev has changed dev address")
    }catch(ex){}
    
    var viellasBal = await viellas.methods.balanceOf(accounts[1]).call();

    await stk.methods.dev(accounts[1]).send({from: masterChef});
    assert.equal(accounts[1], await stk.methods.devaddr().call(), "Accounts[1] is not dev addres");
    
    await sleep(1000);

    await stk.methods.updatePool(1).send({from: masterChef, gasLimit: 1000000});

    assert.equal(viellasBal < await viellas.methods.balanceOf(accounts[1]).call(), true, "Viellas not minted to dev");

    try{
      await stk.methods.dev(viellas_addr).send({from: masterChef});
      assert.equal(0,1, "Not dev has changed dev address")
    }catch(ex){}
    assert.equal(viellas_addr, await stk.methods.devaddr().call(), "TuViellaToken is not dev addres");

  });


  /*

  function updateMultiplier(uint256 multiplierNumber) public onlyOwner{}
  //function poolLength() external view returns (uint256) {}
  //function add(uint256 _allocPoint, IERC20 _stakedToken, bool _withUpdate) public onlyOwner {}
  function set(uint256 _pid, uint256 _allocPoint, bool _withUpdate) public onlyOwner {}
  function getMultiplier(uint256 _from, uint256 _to) public view returns (uint256) {}
  //function pendingViellas(uint256 _pid, address _user) external view returns (uint256) {}
  //function massUpdatePools() public {}
  //function updatePool(uint256 _pid) public {}
  //function deposit(uint256 _pid, uint256 _amount) public {}
  //function withdraw(uint256 _pid, uint256 _amount) public {}
  function emergencyWithdraw(uint256 _pid) public {}
  //function dev(address _devaddr) public {}

  */
});
