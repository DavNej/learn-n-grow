// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import {DataTypes} from "../libraries/DataTypes.sol";

/**
 * @title ILearnNGrow
 * @author DavNej
 *
 * @notice This is the interface for the main entry point of Learn N Grow.
 */
interface ILearnNGrow {
    /**
     * @notice Creates a profile with the specified parameters, minting a profile NFT to the given recipient.
     *
     * @param vars A Profile struct containing the following params:
     *      to: The address receiving the profile.
     *      handle: The handle to set for the profile, must be unique and non-empty.
     *      imageURI: The URI to set for the profile image.
     *
     */
    function createProfile(
        DataTypes.Profile calldata vars
    ) external returns (uint256);

    /**
     * @notice Sets a profile's URI, which is reflected in the `tokenURI()` function.
     *
     * @param profileId The token ID of the profile to set the URI for.
     * @param imageURI The URI to set for the given profile.
     */
    function setProfileImageURI(
        uint256 profileId,
        string calldata imageURI
    ) external;

    /**
     * @notice Returns the profile token ID according to a given handle.
     *
     * @param handle The handle to resolve the profile token ID with.
     *
     * @return uint256 The profile ID the passed handle points to.
     */
    function getProfileIdByHandle(
        string calldata handle
    ) external view returns (uint256);

    /**
     * @notice Returns the full profile struct associated with a given profile token ID.
     *
     * @param profileId The token ID of the profile to query.
     *
     * @return The Profile struct of the given profile.
     */
    function getProfile(
        uint256 profileId
    ) external view returns (DataTypes.Profile memory);
}
