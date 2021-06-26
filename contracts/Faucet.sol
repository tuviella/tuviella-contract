// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

interface IERC20 {
    function balanceOf(address tokenOwner) external view returns (uint balance);
    function transfer(address to, uint tokens) external returns (bool success);

    event Transfer(address indexed from, address indexed to, uint tokens);
}

contract Faucet {

  mapping(IERC20=>mapping(address=>uint)) expiryOf;
  mapping(IERC20=>address) owner;
  mapping(IERC20=>uint16) secs;
  mapping(IERC20=>uint) amounts;

  constructor() public {
    adminFaucet = msg.sender;
  }

  modifier onlyAdmin(){
    require(msg.sender == adminFaucet);
    _;
  }
  modifier onlyOwner(IERC20 token){
    require(owner[token] == msg.sender);
    _;
  }

  function receiveTokens(uint amount, IERC20 token) external{
    require(owner[token] == address(0));
    owner[token] = msg.sender;
    token.transfer(address(this), amount);
  }

  function claimed(IERC20 token) external{
    require(expiryOf[token][msg.sender] < block.timestamp + secs[token]);
    token.transfer(msg.sender, amounts[token]);
    expiryOf[token][msg.sender] = block.timestamp + secs[token];
  }

  function setSecs(uint16 _secs, IERC20 token) external onlyAdmin{
    secs[token] = _secs;
  }
  function setAmount(uint16 amount, IERC20 token) external onlyOwner(token){
    amounts[token] = amount;
  }

  function vaciarFaucet(IERC20 token) external onlyOwner(token){
    token.transfer(msg.sender, token.balanceOf(address(this)));
  }


  //Para subir al contrato de admins
  address adminFaucet;
  
  function setAdmin(address newAdmin) external onlyAdmin{
    adminFaucet = newAdmin;
  }
}
