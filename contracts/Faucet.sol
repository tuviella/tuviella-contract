// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";

contract Faucet is AccessControlEnumerable{

  mapping(address=>mapping(address=>uint)) expiryOf;
  mapping(address=>address) owner;
  mapping(address=>uint16) secs;
  mapping(address=>uint) amounts;

  constructor(address admin) {
    _setupRole(DEFAULT_ADMIN_ROLE, admin);
  }
  
  function setAdmin(address newAdmin) external onlyAdmin{
    _setupRole(DEFAULT_ADMIN_ROLE, newAdmin);
  }
  modifier onlyAdmin(){
    require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "onlyAdmin function");
    _;
  }
  modifier onlyOwner(address token){
    require(owner[token] == _msgSender(), "onlyOwner function");
    _;
  }
  modifier noOwner(address token){
    require(owner[token] == address(0), "noOwner function");
    _;
  }

  function _makeMeOwner(address token, uint amountForClaimers, uint16 _secs) internal noOwner(token) {
    owner[token] = msg.sender;
    amounts[token] = amountForClaimers;
    secs[token] = _secs;
  }
  function makeMeOwner(address token, uint amountForClaimers, uint16 _secs) external payable{
    _makeMeOwner(token, amountForClaimers, _secs);
  }

  function receiveTokens(address token, uint amount, uint amountForClaimers, uint16 _secs) external payable{
    _makeMeOwner(token, amountForClaimers, _secs);
    IERC20(token).transfer(address(this), amount);
  }

  function claim(address token) external{
    require(expiryOf[token][msg.sender] < block.timestamp + secs[token]);
    IERC20(token).transfer(msg.sender, amounts[token]);
    expiryOf[token][msg.sender] = block.timestamp + secs[token];
  }

  function setSecs(address token, uint16 _secs) external onlyOwner(token){
    secs[token] = _secs;
  }
  function setAmount(address token, uint _amount) external onlyOwner(token){
    amounts[token] = _amount;
  }

  function vaciarFaucet(address token) external onlyOwner(token){
    IERC20(token).transfer(msg.sender, IERC20(token).balanceOf(address(this)));
  }

  //getters que se pueden quitar
  function getOwnerOf(address token) external view returns(address){
    return owner[token];
  }
  function getAmountOf(address token) external view returns(uint){
    return amounts[token];
  }
  function getSecsOf(address token) external view returns(uint16){
    return secs[token];
  }
  
}
