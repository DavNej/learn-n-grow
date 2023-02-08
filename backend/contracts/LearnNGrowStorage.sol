// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import {DataTypes} from "./libraries/DataTypes.sol";

/**
 * @title LearnNGrowStorage
 * @author DavNej
 *
 * @notice This is an abstract contract that *only* contains storage for the LearnNGrow contract. This
 * *must* be inherited last in order to preserve the LearnNGrow storage layout. Adding
 * storage variables should be done solely at the bottom of this contract.
 */
abstract contract LearnNGrowStorage {
    mapping(bytes32 => uint256) internal _profileIdByHandleHash;
    mapping(uint256 => DataTypes.ProfileStruct) internal _profileById;

    uint256 internal _profileCounter;
}
