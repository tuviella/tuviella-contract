// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import 'libs/node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract Faucet {
  address admin;
  mapping(address=>uint) expiryOf;
  IERC20 token;
  uint16 secs;

  constructor() {
    secs = 86400;
    admin = msg.sender;
  }

  modifier onlyAdmin(){
    require(msg.sender == admin);
    _;
  }

  function claimed() external{
    uint256 amount = 100 * 10**18;
    require(expiryOf[msg.sender] < block.timestamp + secs);
    require(token.balanceOf(address(this)) >  amount);
    token.transfer(msg.sender, amount);
    expiryOf[msg.sender] = block.timestamp + secs;
  }

  function setToken(IERC20 _token) external onlyAdmin{
    require(msg.sender == admin);
    token = _token;
  }

  function setSecs(uint16 _secs) external onlyAdmin{
    secs = _secs;
  }

  function apagar(bool vaciar) external onlyAdmin{
    if(vaciar){
      vaciarFaucet();
    }
    token = address(0);
  }

  function vaciarFaucet() external onlyAdmin{
    token.transfer(token.balanceOf(address(this), admin);
  }
  
  function setAdmin(address newAdmin) external onlyAdmin{
    admin = newAdmin;
  }
}
