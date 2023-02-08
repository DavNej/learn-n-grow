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
    struct ProfileStruct {
        string handle;
        string imageURI;
    }

    /**
     * @notice A struct containing the parameters required for the `createProfile()` function.
     *
     * @param to The address receiving the profile.
     * @param handle The handle to set for the profile, must be unique and non-empty.
     * @param imageURI The URI to set for the profile image.
     */
    struct CreateProfileData {
        address to;
        string handle;
        string imageURI;
    }
}
