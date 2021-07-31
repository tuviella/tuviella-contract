// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";

abstract contract TransactionFee is ERC20, AccessControlEnumerable {
  bytes32 public constant DEVELOPER_ROLE = keccak256("DEVELOPER_ROLE");

  /**
   * @dev Transaction fee 0.7%
   */
  uint16 feeTransaction = 70;
  /**
   * @dev Burn percentage of the transaction fee 50%
   */
  uint16 burnFee = 5000;
  /**
   * @dev Developers fee of the transaction 25%
   */
  uint16 devFee = 2500;
  /**
   * @dev Holder fee of the transaction 25%
   */
  uint16 holderFee = 2500;

  constructor() {
    _setupRole(DEVELOPER_ROLE, _msgSender());
  }

  /**
   * @dev Get transaction fee to pay for every transaction
   */
  function getTransactionFee() public view returns (uint16) {
    return feeTransaction;
  }

  /**
   * @dev Set transaction fee to pay for every transaction
   */
  function setTransactionFee(uint16 _fee) external {
    feeTransaction = _fee;
  }

  /**
   * @dev Get devs fee for every transaction
   */
  function getDevsFee() public view returns (uint16) {
    return devFee;
  }

  /**
   * @dev Set devs fee for every transaction
   */
  function setDevsFee(uint16 _fee) external {
    devFee = _fee;
  }

  /**
   * @dev Get burn fee for every transaction
   */
  function getBurnFee() public view returns (uint16) {
    return burnFee;
  }

  /**
   * @dev Set burn fee for every transaction
   */
  function setBurnFee(uint16 _fee) external {
    burnFee = _fee;
  }

  /**
   * @dev Get holder fee for every transaction
   */
  function getHolderFee() public view returns (uint16) {
    return holderFee;
  }

  /**
   * @dev Set holder fee for every transaction
   */
  function setHolderFee(uint16 _fee) external {
    holderFee = _fee;
  }

  function addDev(address _wallet) external {
    grantRole(DEVELOPER_ROLE, _wallet);
  }

  function removeDev(address _wallet) external {
    revokeRole(DEVELOPER_ROLE, _wallet);
  }
}
