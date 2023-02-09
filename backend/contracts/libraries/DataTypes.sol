// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

/**
 * @title DataTypes
 * @author DavNej
 *
 * @notice A standard library of data types used throughout Learn N Grow.
 */
library DataTypes {
    /**
     * @notice A struct containing profile data.
     *
     * @param handle The profile's associated handle.
     * @param imageURI The URI to be used for the profile's image.
     */
    struct Profile {
        string handle;
        string imageURI;
    }
}
