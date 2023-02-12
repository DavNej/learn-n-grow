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
        DataTypes.CreateProfileData calldata vars
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
     * @notice Returns default profile for a given wallet address
     *
     * @param wallet The address to find the default mapping
     *
     * @return uint256 The default profile id, which will be 0 if not mapped.
     */
    function profile(address wallet) external view returns (uint256);

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
     * @notice Returns the handle associated with a profile.
     *
     * @param profileId The token ID of the profile to query the handle for.
     *
     * @return string The handle associated with the profile.
     */
    function getHandle(uint256 profileId) external view returns (string memory);

    /**
     * @notice Publishes a post to a given profile, must be called by the profile owner.
     *
     * @param vars A Post struct containing the needed parameters.
     *
     * @return uint256 An integer representing the post's publication ID.
     */
    function post(DataTypes.Post calldata vars) external returns (uint256);

    /**
     * @notice Publishes a comment to a given profile, must be called by the profile owner.
     *
     * @param vars A Comment struct containing the needed parameters.
     *
     * @return uint256 An integer representing the comment's publication ID.
     */
    function comment(
        DataTypes.Comment calldata vars
    ) external returns (uint256);

    /**
     * @notice Returns the publication count for a given profile.
     *
     * @param profileId The token ID of the profile to query.
     *
     * @return uint256 The number of publications associated with the queried profile.
     */
    function getPubCount(uint256 profileId) external view returns (uint256);

    /**
     * @notice Returns the publication pointer (profileId & pubId) associated with a given publication.
     *
     * @param profileId The token ID of the profile that published the publication to query the pointer for.
     * @param pubId The publication ID of the publication to query the pointer for.
     *
     * @return tuple First, the profile ID of the profile the current publication is pointing to, second, the
     * publication ID of the publication the current publication is pointing to.
     */
    function getPubPointer(
        uint256 profileId,
        uint256 pubId
    ) external view returns (uint256, uint256);

    /**
     * @notice Returns the URI associated with a given publication.
     *
     * @param profileId The token ID of the profile that published the publication to query.
     * @param pubId The publication ID of the publication to query.
     *
     * @return string The URI associated with a given publication.
     */
    function getContentURI(
        uint256 profileId,
        uint256 pubId
    ) external view returns (string memory);

    /**
     * @notice Returns the full publication struct for a given publication.
     *
     * @param profileId The token ID of the profile that published the publication to query.
     * @param pubId The publication ID of the publication to query.
     *
     * @return Publication The publication struct associated with the queried publication.
     */
    function getPub(
        uint256 profileId,
        uint256 pubId
    ) external view returns (DataTypes.Publication memory);

    /**
     * @notice Returns the publication type associated with a given publication.
     *
     * @param profileId The token ID of the profile that published the publication to query.
     * @param pubId The publication ID of the publication to query.
     *
     * @return PubType The publication type, as a member of an enum (either "post" or "comment").
     */
    function getPubType(
        uint256 profileId,
        uint256 pubId
    ) external view returns (DataTypes.PubType);
}
