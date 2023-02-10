// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import {ILearnNGrow} from "./interfaces/ILearnNGrow.sol";
import {Events} from "./libraries/Events.sol";
import {DataTypes} from "./libraries/DataTypes.sol";
import {Errors} from "./libraries/Errors.sol";
import {PublishingLogic} from "./libraries/PublishingLogic.sol";
import {ProfileTokenURILogic} from "./libraries/ProfileTokenURILogic.sol";
import {LearnNGrowStorage} from "./LearnNGrowStorage.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

/**
 * @title LearnNGrow
 * @author DavNej
 *
 * @notice This is the main entrypoint of LearnNGrow. It contains publishing and profile interaction functionality.
 */

contract LearnNGrow is ERC721Enumerable, LearnNGrowStorage, ILearnNGrow {
    constructor(
        string memory name,
        string memory symbol
    ) ERC721(name, symbol) {}

    /// @inheritdoc ILearnNGrow
    function createProfile(
        DataTypes.Profile calldata vars
    ) external override returns (uint256) {
        unchecked {
            uint256 profileId = ++_profileCounter;
            _mint(msg.sender, profileId);
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
    ) external view override returns (DataTypes.Profile memory) {
        return _profileById[profileId];
    }

    /// @inheritdoc ILearnNGrow
    function getProfileIdByHandle(
        string calldata handle
    ) external view override returns (uint256) {
        bytes32 handleHash = keccak256(bytes(handle));
        return _profileIdByHandleHash[handleHash];
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
        ProfileTokenURILogic._validateImageURI(imageURI);
        _setProfileImageURI(profileId, imageURI);
    }

    function _setProfileImageURI(
        uint256 profileId,
        string calldata imageURI
    ) internal {
        _profileById[profileId].imageURI = imageURI;
        emit Events.ProfileImageURISet(profileId, imageURI, block.timestamp);
    }

    function _validateCallerIsProfileOwner(uint256 profileId) internal view {
        if (msg.sender != ownerOf(profileId)) revert Errors.NotProfileOwner();
    }
}
