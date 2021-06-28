// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import { Math } from '@openzeppelin/contracts/utils/math/Math.sol';

library Utils {

  /**
   * @dev Get a random value between min and max
   */
  function random(uint256 min, uint256 max) internal view returns (uint256) {
    require(max > min, 'Utils: max is not bigger than min');
    uint rand = uint256(block.timestamp) % max;
    return Math.min(Math.max(rand, min), max);
  }
}
