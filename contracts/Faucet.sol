// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";

contract Faucet is AccessControlEnumerable{

  mapping(address=>mapping(address=>uint)) expiryOf;
  mapping(address=>address) owner;
  mapping(address=>uint16) secs;
  mapping(address=>uint) amounts;

  constructor() {
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
  }
  
  function setAdmin(address newAdmin) external onlyAdmin{
    _setupRole(DEFAULT_ADMIN_ROLE, newAdmin);
  }

  modifier onlyAdmin(){
    require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "Mint: must have minter role to mint");
    _;
  }
  modifier onlyOwner(address token){
    require(owner[token] == _msgSender());
    _;
  }

  function receiveTokens(uint amount, address token) external{
    require(owner[token] == address(0));
    owner[token] = msg.sender;
    IERC20(token).transfer(address(this), amount);
  }

  function claim(address token) external{
    require(expiryOf[token][msg.sender] < block.timestamp + secs[token]);
    IERC20(token).transfer(msg.sender, amounts[token]);
    expiryOf[token][msg.sender] = block.timestamp + secs[token];
  }

  function setSecs(uint16 _secs, address token) external onlyAdmin{
    secs[token] = _secs;
  }
  function setAmount(uint16 amount, address token) external onlyOwner(token){
    amounts[token] = amount;
  }

  function vaciarFaucet(address token) external onlyOwner(token){
    IERC20(token).transfer(msg.sender, IERC20(token).balanceOf(address(this)));
  }
}
