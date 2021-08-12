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
    const ui = await stk.methods.userInfo(1, masterChef).call();
    assert.equal(amount, fromWei(ui[0]),"Incorrect staked amount");
  });

  it('Should withdraw all', async () => {
    //TODO Nunca hay viellas para harvestear
    //assert.equal(1, await stk.methods.pendingViellas(1, masterChef).call() , "There is no viellas to harvest");

    var viellasBalance = await viellas.methods.balanceOf(stk_addr).call();

    var userInfo = await stk.methods.userInfo(1, masterChef).call();
    await stk.methods.withdraw(1, userInfo[0]).send({from: masterChef, gasLimit: 1000000});
    userInfo = await stk.methods.userInfo(1, masterChef).call();
    assert.equal(userInfo[0], 0, "Withdraw not done correctly");

    assert.equal(viellasBalance < await viellas.methods.balanceOf(stk_addr).call(), true, "Viellas not received by staking");
  });


  it('Only devSetter should change dev address', async () => {
    try{
      await stk.methods.dev(accounts[1]).send({from: accounts[1]});
      assert.equal(0,1, "Not dev has changed dev address")
    }catch(ex){}

    await stk.methods.dev(accounts[1]).send({from: masterChef});
    assert.equal(accounts[1], await stk.methods.devaddr().call(), "Accounts[1] is not dev addres");
    
    await sleep(1000);

    await stk.methods.updatePool(1).send({from: masterChef, gasLimit: 1000000});

    try{
      await stk.methods.dev(viellas_addr).send({from: masterChef});
      assert.equal(0,1, "Not dev has changed dev address");
    }catch(ex){}
    assert.equal(viellas_addr, await stk.methods.devaddr().call(), "TuViellaToken is not dev addres");

  });
  

  it('Should return the pid of a pool', async () => {
    assert.equal(0, await stk.methods.findPidOf(viellas_addr).call(), "Pid is not correct");
    assert.equal(1, await stk.methods.findPidOf(token_addr).call(), "Pid is not correct");
  });

  

  it('Should show accViellasPerShare', async () => {

    const amount = 100;
    await token.methods.approve(stk_addr, toWei(amount)).send({from: masterChef});
    await stk.methods.deposit(1, toWei(amount)).send({from: masterChef, gasLimit: 1000000});

    await stk.methods.massUpdatePools().send({from: masterChef, gasLimit: 1000000});
    await sleep(10000);


    for(var i = 0; i< 10; i++){
      web3.eth.sendTransaction({from: accounts[9], to: accounts[i], value: toWei(1)});
      web3.eth.sendTransaction({from: accounts[i], to: accounts[9], value: toWei(1)});
    }
    await stk.methods.updatePool(1).send({from: masterChef, gasLimit: 1000000});

    const base_mult = 1;
    const num1 = 7;
    const num2 = 3;
    
    const mult = await stk.methods.getMultiplier(num1, num1 + num2).call();
    assert.equal(num2, mult * base_mult, "ERROR!!! multiplier: " + mult * base_mult);


    const pend = await stk.methods.pendingViellas(1, masterChef).call();
    assert.equal(fromWei(pend) != 0, true, "ERROR!!!! PendingViellas: " + pend);


    const pi = await stk.methods.poolInfo(1).call();
    assert.equal(fromWei(pi[3]) != 0, true, "ERROR!!!! accViellasPerShare: " + pi[3]);
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
