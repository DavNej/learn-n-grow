// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

library Errors {
    error HandleContainsInvalidCharacters();
    error HandleLengthInvalid();
    error HandleTaken();
    error ProfileImageURILengthInvalid();
    error ProfileImageURIEmpty();
    error NotProfileOwner();
    error UnsafeURI();
}
