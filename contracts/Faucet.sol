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

  function vaciarFaucet() external onlyAdmin{
    token.transfer(token.balanceOf(address(this), admin);
  }
  
  function setAdmin(address newAdmin) external onlyAdmin{
    admin = newAdmin;
  }
}
