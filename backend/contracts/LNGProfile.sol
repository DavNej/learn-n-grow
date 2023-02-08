// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

// import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * Minter already has minted his profile
 * @param addr address of the minter
 */
error LNGProfile__AlreadyMinted(address addr);

/**
 * @title Learn N Grow Profile
 * @author DavNej
 *
 * @notice This contract is the NFT that is minted upon profile creation.
 */

contract LNGProfile is Ownable, ERC721URIStorage {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    mapping(address => Profile) profiles;

    struct Profile {
        uint256 tokenId;
        string name;
        string description;
        string image;
    }

    string public baseURI;

    event ProfileMinted(address addr);

    constructor(string memory _baseURI) ERC721("LNGProfile", "LNGP") {
        _setBaseURI(_baseURI);
        _tokenIdCounter.increment();
    }

    /**
     * @notice mint an NFT representing the profile for a user
     * @param name string | name of the profile
     * @param description string | description of the profile
     * @param image string | URI of the profile's avatar
     * @dev Reverts if an address already minted its profile
     */
    function mintProfile(
        string memory name,
        string memory description,
        string memory image
    ) external returns (uint256) {
        // require(profiles[msg.sender].tokenId == 0, "Profile already minted");
        if (profiles[msg.sender].tokenId != 0)
            revert LNGProfile__AlreadyMinted(msg.sender);

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        profiles[msg.sender] = Profile(tokenId, name, description, image);

        _safeMint(msg.sender, tokenId);

        emit ProfileMinted(msg.sender);

        return tokenId;
    }

    /**
     * @notice retrieve profile for a given address
     * @param addr address owning the profile
     */
    function getProfile(address addr) public view returns (Profile memory) {
        return profiles[addr];
    }

    function _setBaseURI(string memory _baseUri) public onlyOwner {
        baseURI = _baseUri;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    // function tokenURI(uint256 _tokenId)
    //     public
    //     view
    //     virtual
    //     override(ERC721A)
    //     returns (string memory)
    // {
    //     require(_exists(_tokenId), "token does not exist");

    //     return
    //         string(
    //             abi.encodePacked(baseURI, Strings.toString(_tokenId), ".json")
    //         );
    // }

    receive() external payable {
        revert("Contract does not receive funds");
    }
}
