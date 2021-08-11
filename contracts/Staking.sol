// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 <0.9.0;

import './library/SafeMath.sol';
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./token/TuviellaToken.sol";

contract Staking is Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    // Info of each user.
    struct UserInfo {
        uint256 amount;     // How many tokens the user has provided.
        uint256 rewardDebt; // Reward debt. See explanation below.
        //
        // We do some fancy math here. Basically, any point in time, the amount of CAKEs
        // entitled to a user but is pending to be distributed is:
        //
        //   pending reward = (user.amount * pool.accViellasPerShare) - user.rewardDebt
        //
        // Whenever a user deposits or withdraws LP tokens to a pool. Here's what happens:
        //   1. The pool's `accViellasPerShare` (and `lastRewardBlock`) gets updated.
        //   2. User receives the pending reward sent to his/her address.
        //   3. User's `amount` gets updated.
        //   4. User's `rewardDebt` gets updated.
    }

    // Info of each pool.
    struct PoolInfo {
        IERC20 stakedToken;       // Address of staked token contract.
        uint256 allocPoint;       // How many allocation points assigned to this pool. TUVIELLAs to distribute per block.
        uint256 lastRewardBlock;  // Last block number that TUVIELLAs distribution occurs.
        uint256 accViellasPerShare;   // Accumulated TUVIELLAs per share, times 1e12. See below.
    }

    // The TUVIELLA TOKEN!
    TuviellaToken public viellas;
    // Dev address.
    address public devaddr;
    
    address public devSetter;
    // TUVIELLAs tokens created per block.
    uint256 public viellasPerBlock;
    // Bonus muliplier for early tvt makers.
    uint256 public BONUS_MULTIPLIER = 1;

    // Info of each pool.
    PoolInfo[] public poolInfo;
    // Info of each user that stakes tokens.
    mapping (uint256 => mapping (address => UserInfo)) public userInfo;
    // Total allocation points. Must be the sum of all allocation points in all pools.
    uint256 public totalAllocPoint = 0;
    // The block number when TUVIELLA mining starts.
    uint256 public startBlock;

    event Deposit(address indexed user, uint256 indexed pid, uint256 amount);
    event Withdraw(address indexed user, uint256 indexed pid, uint256 amount);
    event EmergencyWithdraw(address indexed user, uint256 indexed pid, uint256 amount);

    constructor(
        TuviellaToken _viellas,
        address _devaddr,
        address _devSetter,
        uint256 _viellasPerBlock,
        uint256 _startBlock
    ) {
        viellas = _viellas;
        devaddr = _devaddr;
        devSetter = _devSetter;
        viellasPerBlock = _viellasPerBlock;
        startBlock = _startBlock;

        // staking pool
        poolInfo.push(PoolInfo({
            stakedToken: _viellas,
            allocPoint: 1000,
            lastRewardBlock: startBlock,
            accViellasPerShare: 0
        }));

        totalAllocPoint = 1000;

    }

    function updateMultiplier(uint256 multiplierNumber) public onlyOwner {
        BONUS_MULTIPLIER = multiplierNumber;
    }

    function poolLength() external view returns (uint256) {
        return poolInfo.length;
    }

    // Add a new staking token to the pool. Can only be called by the owner.
    // XXX DO NOT add the same staking token more than once. Rewards will be messed up if you do.
    function add(uint256 _allocPoint, IERC20 _stakedToken, bool _withUpdate) public onlyOwner {
        if (_withUpdate) {
            massUpdatePools();
        }
        uint256 lastRewardBlock = block.number > startBlock ? block.number : startBlock;
        totalAllocPoint = totalAllocPoint.add(_allocPoint);
        poolInfo.push(PoolInfo({
            stakedToken: _stakedToken,
            allocPoint: _allocPoint,
            lastRewardBlock: lastRewardBlock,
            accViellasPerShare: 0
        }));
        updateStakingPool();
    }

    // Update the given pool's TUVIELLA allocation point. Can only be called by the owner.
    function set(uint256 _pid, uint256 _allocPoint, bool _withUpdate) public onlyOwner {
        if (_withUpdate) {
            massUpdatePools();
        }
        uint256 prevAllocPoint = poolInfo[_pid].allocPoint;
        poolInfo[_pid].allocPoint = _allocPoint;
        if (prevAllocPoint != _allocPoint) {
            totalAllocPoint = totalAllocPoint.sub(prevAllocPoint).add(_allocPoint);
            updateStakingPool();
        }
    }

    function updateStakingPool() internal {
        uint256 length = poolInfo.length;
        uint256 points = 0;
        for (uint256 pid = 1; pid < length; ++pid) {
            points = points.add(poolInfo[pid].allocPoint);
        }
        if (points != 0) {
            points = points.div(3);
            totalAllocPoint = totalAllocPoint.sub(poolInfo[0].allocPoint).add(points);
            poolInfo[0].allocPoint = points;
        }
    }

    // Return reward multiplier over the given _from to _to block.
    function getMultiplier(uint256 _from, uint256 _to) public view returns (uint256) {
        return _to.sub(_from).mul(BONUS_MULTIPLIER);
    }

    // View function to see pending TUVIELLAs on frontend.
    function pendingViellas(uint256 _pid, address _user) external view returns (uint256) {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][_user];
        uint256 accViellasPerShare = pool.accViellasPerShare;
        uint256 stakedSupply = pool.stakedToken.balanceOf(address(this));
        if (block.number > pool.lastRewardBlock && stakedSupply != 0) {
            uint256 multiplier = getMultiplier(pool.lastRewardBlock, block.number);
            uint256 viellasReward = multiplier.mul(viellasPerBlock).mul(pool.allocPoint).div(totalAllocPoint);
            accViellasPerShare = accViellasPerShare.add(viellasReward.mul(1e12).div(stakedSupply));
        }
        return user.amount.mul(accViellasPerShare).div(1e12).sub(user.rewardDebt);
    }

    // Update reward variables for all pools. Be careful of gas spending!
    function massUpdatePools() public {
        uint256 length = poolInfo.length;
        for (uint256 pid = 0; pid < length; ++pid) {
            updatePool(pid);
        }
    }


    // Update reward variables of the given pool to be up-to-date.
    function updatePool(uint256 _pid) public {
        PoolInfo storage pool = poolInfo[_pid];
        if (block.number <= pool.lastRewardBlock) {
            return;
        }
        uint256 stakedSupply = pool.stakedToken.balanceOf(address(this));
        if (stakedSupply == 0) {
            pool.lastRewardBlock = block.number;
            return;
        }
        uint256 multiplier = getMultiplier(pool.lastRewardBlock, block.number);
        uint256 viellasReward = multiplier.mul(viellasPerBlock).mul(pool.allocPoint).div(totalAllocPoint);

        if(viellas.totalSupply() < 1000000 ether - viellasReward.mul(11).div(10)){
            viellas.mint(devaddr, viellasReward.div(10));
            viellas.mint(address(this), viellasReward);
        }

        pool.accViellasPerShare = pool.accViellasPerShare.add(viellasReward.mul(1e12).div(stakedSupply));
        pool.lastRewardBlock = block.number;
    }

    // Deposit LP tokens to MasterChef for TUVIELLA allocation.
    function deposit(uint256 _pid, uint256 _amount) public {

        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        updatePool(_pid);
        if (user.amount > 0) {
            uint256 pending = user.amount.mul(pool.accViellasPerShare).div(1e12).sub(user.rewardDebt);
            if(pending > 0) {
                safeViellasTransfer(msg.sender, pending);
            }
        }
        if (_amount > 0) {
            pool.stakedToken.safeTransferFrom(address(msg.sender), address(this), _amount);
            user.amount = user.amount.add(_amount);
        }
        user.rewardDebt = user.amount.mul(pool.accViellasPerShare).div(1e12);
        emit Deposit(msg.sender, _pid, _amount);
    }

    // Withdraw LP tokens from MasterChef.
    function withdraw(uint256 _pid, uint256 _amount) public {

        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        require(user.amount >= _amount, "withdraw exceeds user balance");

        updatePool(_pid);
        uint256 pending = user.amount.mul(pool.accViellasPerShare).div(1e12).sub(user.rewardDebt);
        if(pending > 0) {
            safeViellasTransfer(msg.sender, pending);
        }
        if(_amount > 0) {
            user.amount = user.amount.sub(_amount);
            pool.stakedToken.safeTransfer(address(msg.sender), _amount);
        }
        user.rewardDebt = user.amount.mul(pool.accViellasPerShare).div(1e12);
        emit Withdraw(msg.sender, _pid, _amount);
    }

    // Withdraw without caring about rewards. EMERGENCY ONLY.
    function emergencyWithdraw(uint256 _pid) public {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        pool.stakedToken.safeTransfer(address(msg.sender), user.amount);
        emit EmergencyWithdraw(msg.sender, _pid, user.amount);
        user.amount = 0;
        user.rewardDebt = 0;
    }

    // Safe cake transfer function, just in case if rounding error causes pool to not have enough CAKEs.
    function safeViellasTransfer(address _to, uint256 _amount) internal {
        uint256 viellasBalance = viellas.balanceOf(address(this));
        if (_amount > viellasBalance) {
            viellas.transfer(_to, viellasBalance);
        } else {
            viellas.transfer(_to, _amount);
        }
    }

    // Update dev address by the previous dev.
    function dev(address _devaddr) public {
        require(msg.sender == devSetter, "devSetter: wut?");
        devaddr = _devaddr;
    }

    // brrr en tu cartera
    function brrr(uint256 _pid) public{

        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];

        updatePool(_pid);

        uint256 pending = user.amount.mul(pool.accViellasPerShare).div(1e12).sub(user.rewardDebt);
        require(pending > 0, "No pending to brrr");
        safeViellasTransfer(msg.sender, pending);
    }

    // Reinvest viellas
    function reinvest() public{
        PoolInfo storage pool = poolInfo[0];
        UserInfo storage user = userInfo[0][msg.sender];
        updatePool(0);
        
        uint256 pending = user.amount.mul(pool.accViellasPerShare).div(1e12).sub(user.rewardDebt);
        require(pending > 0, "No pending to reinvest");
        
        user.amount = user.amount.add(pending);
        
        user.rewardDebt = user.amount.mul(pool.accViellasPerShare).div(1e12);
        emit Deposit(msg.sender, 0, pending);
    }

    //returns the pid of the pool
    function findPidOf(IERC20 token) public view returns (uint256 _pid){
        for(uint256 i = 0; i<poolInfo.length; i++){
            if(token == poolInfo[i].stakedToken){
                return i;
            }
        }
    }
}
