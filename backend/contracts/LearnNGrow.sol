// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import {ILearnNGrow} from "./interfaces/ILearnNGrow.sol";
import {Events} from "./libraries/Events.sol";
import {Constants} from "./libraries/Constants.sol";
import {DataTypes} from "./libraries/DataTypes.sol";
import {Errors} from "./libraries/Errors.sol";
import {PublishingLogic} from "./libraries/PublishingLogic.sol";
import {ProfileTokenURILogic} from "./libraries/ProfileTokenURILogic.sol";
import {LearnNGrowStorage} from "./LearnNGrowStorage.sol";
import {IERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

/**
 * @title LearnNGrow
 * @author DavNej
 *
 * @notice This is the main entrypoint of LearnNGrow. It contains publishing and profile interaction functionality.
 */

contract LearnNGrow is ERC721, LearnNGrowStorage, ILearnNGrow {
    constructor(
        string memory name,
        string memory symbol
    ) ERC721(name, symbol) {}

    /// @inheritdoc ILearnNGrow
    function createProfile(
        DataTypes.CreateProfileData calldata vars
    ) external override returns (uint256) {
        unchecked {
            uint256 profileId = ++_profileCounter;
            _mint(vars.to, profileId);
            PublishingLogic.createProfile(
                vars,
                profileId,
                _profileIdByHandleHash,
                _profileById
            );
            return profileId;
        }
    }

    /// @inheritdoc ILearnNGrow
    function getProfile(
        uint256 profileId
    ) external view override returns (DataTypes.ProfileStruct memory) {
        return _profileById[profileId];
    }

    /**
     * @dev Overrides the ERC721 tokenURI function to return the associated URI with a given profile.
     */
    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        return
            ProfileTokenURILogic.getProfileTokenURI(
                tokenId,
                ownerOf(tokenId),
                _profileById[tokenId].handle,
                _profileById[tokenId].imageURI
            );
    }

    /// @inheritdoc ILearnNGrow
    function setProfileImageURI(
        uint256 profileId,
        string calldata imageURI
    ) external override {
        _validateCallerIsProfileOwner(profileId);
        _setProfileImageURI(profileId, imageURI);
    }

    function _setProfileImageURI(
        uint256 profileId,
        string calldata imageURI
    ) internal {
        if (bytes(imageURI).length > Constants.MAX_PROFILE_IMAGE_URI_LENGTH)
            revert Errors.ProfileImageURILengthInvalid();
        _profileById[profileId].imageURI = imageURI;
        emit Events.ProfileImageURISet(profileId, imageURI, block.timestamp);
    }

    function _validateCallerIsProfileOwner(uint256 profileId) internal view {
        if (msg.sender != ownerOf(profileId)) revert Errors.NotProfileOwner();
    }
}
