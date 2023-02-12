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
     * @param pubCount The number of publications made to this profile.
     */
    struct Profile {
        string handle;
        string imageURI;
        uint256 pubCount;
    }

    /**
     * @notice A struct containing the parameters required for the `createProfile()` function.
     *
     * @param handle The handle to set for the profile, must be unique and non-empty.
     * @param imageURI The URI to set for the profile image.
     */
    struct CreateProfileData {
        string handle;
        string imageURI;
    }

    /**
     * @notice An enum specifically used in a helper function to easily retrieve the publication type for integrations.
     *
     * @param Post A standard post, having a URI but no pointer to another publication.
     * @param Comment A comment, having a URI and a pointer to another publication.
     */
    enum PubType {
        Post,
        Comment,
        Nonexistent
    }

    /**
     * @notice A struct containing data associated with each new publication.
     *
     * @param contentURI The URI associated with this publication.
     * @param profileIdPointed The profile token ID this publication points to, for comments.
     * @param pubIdPointed The publication ID this publication points to, for comments.
     */
    struct Publication {
        string contentURI;
        uint256 profileIdPointed;
        uint256 pubIdPointed;
    }

    /**
     * @notice A struct containing the parameters required for the `post()` function.
     *
     * @param profileId The token ID of the profile to publish to.
     * @param contentURI The URI to set for this new publication.
     */
    struct Post {
        uint256 profileId;
        string contentURI;
    }

    /**
     * @notice A struct containing the parameters required for the `comment()` function.
     *
     * @param profileId The token ID of the profile to publish to.
     * @param contentURI The URI to set for this new publication.
     * @param profileIdPointed The profile token ID to point the comment to.
     * @param pubIdPointed The publication ID to point the comment to.
     */
    struct Comment {
        uint256 profileId;
        string contentURI;
        uint256 profileIdPointed;
        uint256 pubIdPointed;
    }
}
