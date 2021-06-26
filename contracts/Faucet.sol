// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract IERC20 {
    function totalSupply() public constant returns (uint);
    function balanceOf(address tokenOwner) public constant returns (uint balance);
    function allowance(address tokenOwner, address spender) public constant returns (uint remaining);
    function transfer(address to, uint tokens) public returns (bool success);
    function approve(address spender, uint tokens) public returns (bool success);
    function transferFrom(address from, address to, uint tokens) public returns (bool success);

    event Transfer(address indexed from, address indexed to, uint tokens);
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
}

contract Faucet {
  mapping(IERC20=>mapping(address=>uint)) expiryOf;
  mapping(IERC20=>address) owner;
  mapping(IERC20=>uint16) secs;

  constructor() {
    adminFaucet = msg.sender;
  }

  modifier onlyAdmin(){
    require(msg.sender == adminFaucet);
    _;
  }
  modifier onlyOwner(){
    require(owner[token] == msg.sender);
    _;
  }

  function receiveTokens(uint amount, IERC20 token) external{
    require(owner[token] == address(0));
    owner[token] = msg.sender;
  }

  function claimed(IERC20 token, uint amount) external{
    uint256 amount = amount;
    require(expiryOf[token][msg.sender] < block.timestamp + secs);
    token.transfer(msg.sender, amount);
    expiryOf[token][msg.sender] = block.timestamp + secs;
  }

  function setSecs(uint16 _secs, IERC20 token) external onlyAdmin{
    secs[token] = _secs;
  }

  function vaciarFaucet(IERC20 token) external onlyOwner{
    token.transfer(token.balanceOf(address(this), msg.sender));
  }


  //Para subir al contrato de admins
  address adminFaucet;
  
  function setAdmin(address newAdmin) external onlyAdmin{
    adminFaucet = newAdmin;
  }
}
