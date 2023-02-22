// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import {Constants} from "../libraries/Constants.sol";
import {Errors} from "../libraries/Errors.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

library ProfileTokenURILogic {
    uint8 internal constant DEFAULT_FONT_SIZE = 24;
    uint8 internal constant MAX_HANDLE_LENGTH_WITH_DEFAULT_FONT_SIZE = 17;

    /**
     * @notice Generates the token URI for the profile NFT.
     *
     * @dev The decoded token URI JSON metadata contains the following fields: name, description, image and attributes.
     * The image field contains a base64-encoded SVG. Both the JSON metadata and the image are generated fully on-chain.
     *
     * @param id The token ID of the profile.
     * @param owner The address which owns the profile.
     * @param handle The profile's handle.
     * @param imageURI The profile's picture URI.
     *
     * @return string The profile's token URI as a base64-encoded JSON string.
     */
    function getProfileTokenURI(
        uint256 id,
        address owner,
        string memory handle,
        string memory imageURI
    ) internal pure returns (string memory) {
        string memory handleWithAtSymbol = string(
            abi.encodePacked("@", handle)
        );
        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(
                        abi.encodePacked(
                            '{"name":"',
                            handleWithAtSymbol,
                            '","description":"',
                            handleWithAtSymbol,
                            ' - Learn N Grow profile","image":"data:image/svg+xml;base64,',
                            _generateSVGImageBase64Encoded(
                                handleWithAtSymbol,
                                imageURI
                            ),
                            '","attributes":[{"trait_type":"id","value":"#',
                            Strings.toString(id),
                            '"},{"trait_type":"owner","value":"',
                            Strings.toHexString(uint160(owner)),
                            '"},{"trait_type":"handle","value":"',
                            handleWithAtSymbol,
                            '"}]}'
                        )
                    )
                )
            );
    }

    /**
     * @notice Generates the token image.
     *
     * @dev If the image URI was set and meets URI format conditions, it will be embedded in the token image.
     * Otherwise, transaction will be reverted. Handle font size is a function of handle length.
     *
     * @param handleWithAtSymbol The profile's handle beginning with "@" symbol.
     * @param imageURI The profile's picture URI.
     *
     * @return string The profile token image as a base64-encoded SVG.
     */
    function _generateSVGImageBase64Encoded(
        string memory handleWithAtSymbol,
        string memory imageURI
    ) internal pure returns (string memory) {
        _validateImageURI(imageURI);

        return
            Base64.encode(
                abi.encodePacked(
                    '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="450" height="450" viewBox="0 0 450 450" fill="none"><defs><clipPath id="outer-rounded-border"><rect width="450" height="450" rx="16" fill="white" /></clipPath></defs><g><g clip-path="url(#outer-rounded-border)"><image width="100%" height="100%" href="',
                    imageURI,
                    '" /><rect id="bottom-background" y="380" width="450" height="70" fill="#00AAFF" /><text id="handle" fill="#ffffff" text-anchor="middle" dominant-baseline="middle" x="225" y="415" font-family="system-ui" font-size="',
                    Strings.toString(
                        _handleLengthToFontSize(
                            bytes(handleWithAtSymbol).length
                        )
                    ),
                    '" font-weight="500">',
                    handleWithAtSymbol,
                    "</text></g></g></svg>"
                )
            );
    }

    /**
     * @notice Maps the handle length to a font size.
     *
     * @dev Gives the font size as a function of handle length using the following formula:
     *
     *      fontSize(handleLength) = 24                              when handleLength <= 17
     *      fontSize(handleLength) = 24 - (handleLength - 12) / 2    when handleLength  > 17
     *
     * @param handleLength The profile's handle length.
     * @return uint256 The font size.
     */
    function _handleLengthToFontSize(
        uint256 handleLength
    ) internal pure returns (uint256) {
        return
            handleLength <= MAX_HANDLE_LENGTH_WITH_DEFAULT_FONT_SIZE
                ? DEFAULT_FONT_SIZE
                : DEFAULT_FONT_SIZE - (handleLength - 12) / 2;
    }

    /**
     * @notice Validate if profile picture URI is not empty and safe.
     *
     * @dev It checks if there is a imageURI and makes sure it does not contain double-quotes to prevent
     * injection attacks through the generated SVG.
     *
     * @param imageURI The imageURI set by the profile owner.
     */
    function _validateImageURI(string memory imageURI) internal pure {
        bytes memory imageURIBytes = bytes(imageURI);

        if (imageURIBytes.length > Constants.MAX_PROFILE_IMAGE_URI_LENGTH)
            revert Errors.ProfileImageURILengthInvalid();

        if (imageURIBytes.length == 0) {
            revert Errors.ProfileImageURIEmpty();
        }

        uint256 imageURIBytesLength = imageURIBytes.length;
        for (uint256 i = 0; i < imageURIBytesLength; ) {
            if (imageURIBytes[i] == '"') {
                // Avoids embedding a user provided imageURI containing double-quotes to prevent injection attacks
                revert Errors.UnsafeURI();
            }
            unchecked {
                ++i;
            }
        }
    }
}
