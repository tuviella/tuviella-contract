// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Reward {

  address admin;
  address staking;
  IERC20 viellas;

  constructor(IERC20 _viellas) {
    admin = msg.sender;
    viellas = _viellas;
  }

  function setStakingAddress(address _staking) external{
    require(msg.sender == admin, "You cant set anything!");
    staking = _staking;
    admin = address(0);
  }

  function payTo(address to, uint256 amount) external{
    require(msg.sender == staking, "You cant pay anyone!");
    
    uint256 viellasBalance = viellas.balanceOf(address(this));
    if (amount > viellasBalance) {
        viellas.transfer(to, viellasBalance);
    } else {
        viellas.transfer(to, amount);
    }
  }

  function totalVuiellasInContract() public view returns(uint256){
    return viellas.balanceOf(address(this));
  }
}
