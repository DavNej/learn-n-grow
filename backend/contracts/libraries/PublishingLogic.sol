// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import {DataTypes} from "./DataTypes.sol";
import {Errors} from "./Errors.sol";
import {Events} from "./Events.sol";
import {Constants} from "./Constants.sol";

/**
 * @title PublishingLogic
 * @author DavNej
 *
 * @notice This is the library that contains the logic for profile creation.
 */
library PublishingLogic {
    /**
     * @notice Executes the logic to create a profile with the given parameters to the given address.
     *
     * @param vars The Profile struct containing the following parameters:
     *      to: The address receiving the profile.
     *      handle: The handle to set for the profile, must be unique and non-empty.
     *      imageURI: The URI to set for the profile image.
     * @param profileId The profile ID to associate with this profile NFT (token ID).
     * @param _profileIdByHandleHash The storage reference to the mapping of profile IDs by handle hash.
     * @param _profileById The storage reference to the mapping of profile structs by IDs.
     */
    function createProfile(
        DataTypes.CreateProfileData calldata vars,
        uint256 profileId,
        mapping(bytes32 => uint256) storage _profileIdByHandleHash,
        mapping(uint256 => DataTypes.Profile) storage _profileById
    ) internal {
        _validateHandle(vars.handle);

        if (
            bytes(vars.imageURI).length > Constants.MAX_PROFILE_IMAGE_URI_LENGTH
        ) revert Errors.ProfileImageURILengthInvalid();

        bytes32 handleHash = keccak256(bytes(vars.handle));

        if (_profileIdByHandleHash[handleHash] != 0)
            revert Errors.HandleTaken();

        _profileIdByHandleHash[handleHash] = profileId;
        _profileById[profileId].handle = vars.handle;
        _profileById[profileId].imageURI = vars.imageURI;

        emit Events.ProfileCreated(
            profileId,
            msg.sender, // Creator is always the msg sender
            vars.handle,
            vars.imageURI,
            block.timestamp
        );
    }

    /**
     * @notice Creates a post publication mapped to the given profile.
     *
     * @dev To avoid a stack too deep error, reference parameters are passed in memory rather than calldata.
     *
     * @param profileId The profile ID to associate this publication to.
     * @param contentURI The URI to set for this publication.
     * @param pubId The publication ID to associate with this publication.
     * @param _pubByIdByProfile The storage reference to the mapping of publications by publication ID by profile ID.
     */
    function createPost(
        uint256 profileId,
        string memory contentURI,
        uint256 pubId,
        mapping(uint256 => mapping(uint256 => DataTypes.Publication))
            storage _pubByIdByProfile
    ) internal {
        _pubByIdByProfile[profileId][pubId].contentURI = contentURI;

        emit Events.PostCreated(profileId, pubId, contentURI, block.timestamp);
    }

    /**
     * @notice Creates a comment publication mapped to the given profile.
     *
     * @dev This function is unique in that it requires many variables, so, unlike the other publishing functions,
     * we need to pass the full Comment struct in memory to avoid a stack too deep error.
     *
     * @param vars The Comment struct to use to create the comment.
     * @param pubId The publication ID to associate with this publication.
     * @param _profileById The storage reference to the mapping of profile structs by IDs.
     * @param _pubByIdByProfile The storage reference to the mapping of publications by publication ID by profile ID.
     */
    function createComment(
        DataTypes.Comment memory vars,
        uint256 pubId,
        mapping(uint256 => DataTypes.Profile) storage _profileById,
        mapping(uint256 => mapping(uint256 => DataTypes.Publication))
            storage _pubByIdByProfile
    ) internal {
        // Validate existence of the pointed publication
        uint256 pubCount = _profileById[vars.profileIdPointed].pubCount;
        if (pubCount < vars.pubIdPointed || vars.pubIdPointed == 0)
            revert Errors.PublicationDoesNotExist();

        // Ensure the pointed publication is not the comment being created
        if (
            vars.profileId == vars.profileIdPointed &&
            vars.pubIdPointed == pubId
        ) revert Errors.CannotCommentOnOwnPub();

        _pubByIdByProfile[vars.profileId][pubId].contentURI = vars.contentURI;
        _pubByIdByProfile[vars.profileId][pubId].profileIdPointed = vars
            .profileIdPointed;
        _pubByIdByProfile[vars.profileId][pubId].pubIdPointed = vars
            .pubIdPointed;

        // Prevents a stack too deep error
        emit Events.CommentCreated(
            vars.profileId,
            pubId,
            vars.contentURI,
            vars.profileIdPointed,
            vars.pubIdPointed,
            block.timestamp
        );
    }

    function _validateHandle(string calldata handle) private pure {
        bytes memory byteHandle = bytes(handle);
        if (
            byteHandle.length == 0 ||
            byteHandle.length > Constants.MAX_HANDLE_LENGTH
        ) revert Errors.HandleLengthInvalid();

        uint256 byteHandleLength = byteHandle.length;
        for (uint256 i = 0; i < byteHandleLength; ) {
            if (
                (byteHandle[i] < "0" ||
                    (byteHandle[i] > "9" && byteHandle[i] < "a") ||
                    byteHandle[i] > "z") &&
                byteHandle[i] != "." &&
                byteHandle[i] != "-" &&
                byteHandle[i] != "_"
            ) revert Errors.HandleContainsInvalidCharacters();
            // no underflow or overflow is possible
            unchecked {
                ++i;
            }
        }
    }
}
