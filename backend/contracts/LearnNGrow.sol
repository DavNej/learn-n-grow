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
        DataTypes.CreateProfileData calldata vars
    ) external override returns (uint256) {
        unchecked {
            uint256 profileId = ++_profileCounter;
            _profileByAddress[msg.sender] = profileId;
            _safeMint(msg.sender, profileId);
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
    function profile(address wallet) external view override returns (uint256) {
        return _profileByAddress[wallet];
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

    /// @inheritdoc ILearnNGrow
    function getHandle(
        uint256 profileId
    ) external view override returns (string memory) {
        return _profileById[profileId].handle;
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

    /// @inheritdoc ILearnNGrow
    function post(
        DataTypes.Post calldata vars
    ) external override returns (uint256) {
        _validateCallerIsProfileOwner(vars.profileId);
        return _createPost(vars.profileId, vars.contentURI);
    }

    function _createPost(
        uint256 profileId,
        string memory contentURI
    ) internal returns (uint256) {
        unchecked {
            uint256 pubId = ++_profileById[profileId].pubCount;
            PublishingLogic.createPost(
                profileId,
                contentURI,
                pubId,
                _pubByIdByProfile
            );
            return pubId;
        }
    }

    /// @inheritdoc ILearnNGrow
    function comment(
        DataTypes.Comment calldata vars
    ) external override returns (uint256) {
        _validateCallerIsProfileOwner(vars.profileId);
        return _createComment(vars);
    }

    function _createComment(
        DataTypes.Comment memory vars
    ) internal returns (uint256) {
        unchecked {
            uint256 pubId = ++_profileById[vars.profileId].pubCount;
            PublishingLogic.createComment(
                vars,
                pubId,
                _profileById,
                _pubByIdByProfile
            );
            return pubId;
        }
    }

    /// @inheritdoc ILearnNGrow
    function getPubCount(
        uint256 profileId
    ) external view override returns (uint256) {
        return _profileById[profileId].pubCount;
    }

    /// @inheritdoc ILearnNGrow
    function getPubPointer(
        uint256 profileId,
        uint256 pubId
    ) external view override returns (uint256, uint256) {
        uint256 profileIdPointed = _pubByIdByProfile[profileId][pubId]
            .profileIdPointed;
        uint256 pubIdPointed = _pubByIdByProfile[profileId][pubId].pubIdPointed;
        return (profileIdPointed, pubIdPointed);
    }

    /// @inheritdoc ILearnNGrow
    function getContentURI(
        uint256 profileId,
        uint256 pubId
    ) external view override returns (string memory) {
        return _pubByIdByProfile[profileId][pubId].contentURI;
    }

    /// @inheritdoc ILearnNGrow
    function getPub(
        uint256 profileId,
        uint256 pubId
    ) external view override returns (DataTypes.Publication memory) {
        return _pubByIdByProfile[profileId][pubId];
    }

    /// @inheritdoc ILearnNGrow
    function getPubType(
        uint256 profileId,
        uint256 pubId
    ) external view override returns (DataTypes.PubType) {
        if (pubId == 0 || _profileById[profileId].pubCount < pubId) {
            return DataTypes.PubType.Nonexistent;
        } else if (_pubByIdByProfile[profileId][pubId].profileIdPointed == 0) {
            return DataTypes.PubType.Post;
        } else {
            return DataTypes.PubType.Comment;
        }
    }
}
