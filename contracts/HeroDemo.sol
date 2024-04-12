// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./TurboInterfaces.sol";

contract HeroDemo {
    // State variables to store properties and their proof status
    mapping(uint256 => mapping(uint256 => mapping(HeaderProperty => bytes32)))
        public headerProperties;
    mapping(uint256 => mapping(uint256 => mapping(HeaderProperty => bool)))
        public isHeaderProven;
    mapping(uint256 => mapping(uint256 => mapping(AccountFields => bytes32)))
        public accountFields;
    mapping(uint256 => mapping(uint256 => mapping(AccountFields => bool)))
        public isAccountProven;

    // Reference to the ITurboSwap interface
    ITurboSwap public turboSwap;

    // Constructor to initialize the ITurboSwap interface
    constructor(address _turboSwapAddress) {
        turboSwap = ITurboSwap(_turboSwapAddress);
    }

    // Function to prove a header property
    function proveHeaderProperty(
        uint256 chainId,
        uint256 blockNumber,
        HeaderProperty property
    ) external {
        bytes32 provenProperty = turboSwap.headers(
            chainId,
            blockNumber,
            property
        );

        // Store the proven property to this contract storage
        headerProperties[chainId][blockNumber][property] = provenProperty;
        isHeaderProven[chainId][blockNumber][property] = true;
    }

    function proveAccountField(
        uint256 chainId,
        uint256 blockNumber,
        address account,
        AccountFields field
    ) external {
        bytes32 provenField = turboSwap.accounts(
            chainId,
            blockNumber,
            account,
            field
        );

        // Store the proven property to this contract storage
        accountFields[chainId][blockNumber][field] = provenField;
        isAccountProven[chainId][blockNumber][field] = true;
    }
}
