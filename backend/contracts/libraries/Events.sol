// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import {DataTypes} from "./DataTypes.sol";

library Events {
    /**
     * @dev Emitted when a profile is created.
     *
     * @param profileId The newly created profile's token ID.
     * @param creator The profile creator, who created the token with the given profile ID.
     * @param handle The handle set for the profile.
     * @param imageURI The image uri set for the profile.
     * @param timestamp The current block timestamp.
     */
    event ProfileCreated(
        uint256 indexed profileId,
        address indexed creator,
        string handle,
        string imageURI,
        uint256 timestamp
    );

    /**
     * @dev Emitted when a profile's URI is set.
     *
     * @param profileId The token ID of the profile for which the URI is set.
     * @param imageURI The URI set for the given profile.
     * @param timestamp The current block timestamp.
     */
    event ProfileImageURISet(
        uint256 indexed profileId,
        string imageURI,
        uint256 timestamp
    );
}
