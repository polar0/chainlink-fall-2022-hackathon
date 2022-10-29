//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";
import "./IPromiseFactory.sol";

/**
 * @notice Sends a request to the Chainlink oracle to verify a Twitter account
 * - The oracle will return the username, address, and verification status
 * - It uses a Chainlink node & an external adapter to interact with the Twitter API
 */

contract VerifyTwitter is ChainlinkClient, ConfirmedOwner {
    using Chainlink for Chainlink.Request;

    // Chainlink variables
    bytes32 private constant ORACLE_JOB_ID = "79bf989ad07648c0a59bd679f366592d";
    uint256 private constant ORACLE_PAYMENT = (1 * LINK_DIVISIBILITY) / 10; // 0.1 LINK

    // Declare the PromiseFactory contract address and the interface
    address public s_promiseFactoryContract;
    IPromiseFactory public s_promiseFactoryInterface;

    // Variables returned by the oracle
    string public s_username;
    address public s_userAddress;
    bool public s_verified = false;

    // Events
    event VerificationRequested(bytes32 indexed requestId, string username);
    event VerificationFailed(bytes32 indexed requestId, string username);
    event VerificationFulfilled(
        bytes32 indexed requestId,
        string username,
        address userAddress,
        bool verified
    );

    /**
     * @notice Initialize the link token and target oracle
     * @param _linkTokenContract (Mumbai): 0x326C977E6efc84E512bB9C30f76E30c160eD06FB
     * @param _oracleContract (Mumbai): 0x2BB8Dd9C16edeF313eb9ccBd5F42A8b577cB1E3c
     * @param _promiseFactoryContract: The address of the PromiseFactory contract
     * Job ID: 79bf989a-d076-48c0-a59b-d679f366592d
     */

    constructor(
        address _linkTokenContract,
        address _oracleContract,
        address _promiseFactoryContract
    ) ConfirmedOwner(msg.sender) {
        setChainlinkToken(_linkTokenContract);
        setChainlinkOracle(_oracleContract);
        setPromiseFactoryContract(_promiseFactoryContract);
    }

    /**
     * @notice Request a Twitter username to be verified
     * @param _username The username to verify
     */

    function requestVerification(string memory _username)
        public
        returns (bytes32 requestId)
    {
        Chainlink.Request memory req = buildChainlinkRequest(
            ORACLE_JOB_ID,
            address(this),
            this.fulfillVerification.selector
        );
        string memory userAddress = addressToString(msg.sender);

        // Generate a signature with
        // "Verifying my Twitter account for ETH address <address>" as the message
        // It will prevent the signature from being passed as a parameter
        string memory signature = string(
            abi.encodePacked(
                "Verifying my Twitter account for ETH address ",
                userAddress
            )
        );

        req.add("username", s_username);
        req.add("signature", signature);
        req.add("address", userAddress);
        // req.add("copyPath1", "data,username"); // username (string)
        // req.add("copyPath2", "data,result"); // verified (bool)
        // req.add("copyPath3", "data,userAddress"); // user address (msg.sender here) (address)
        requestId = sendOperatorRequest(req, ORACLE_PAYMENT);

        emit VerificationRequested(requestId, _username);
    }

    /**
     * @notice Callback function used by the oracle to return the verification result
     * @param _requestId The request ID
     * @param _username The username to verify
     * @param _verified The verification result
     */

    function fulfillVerification(
        bytes32 _requestId,
        string memory _username,
        bool _verified,
        address _userAddress
    ) public recordChainlinkFulfillment(_requestId) {
        s_username = _username;
        s_userAddress = _userAddress;
        s_verified = _verified;

        if (_verified) {
            // It's ok if the user already have a verified account, they can still verify another one
            // Call the PromiseFactory contract to verify the user
            // Which will map their address to their verified Twitter username(s)
            s_promiseFactoryInterface.addTwitterVerifiedUser(
                _userAddress,
                _username
            );

            emit VerificationFulfilled(
                _requestId,
                _username,
                _userAddress,
                _verified
            );
        } else {
            emit VerificationFailed(_requestId, _username);
        }
    }

    /**
     * @notice Call the promise factory contract to verify a Twitter account
     * @dev It also sets the promise factory contract interface with this address
     * @param _promiseFactoryContract The address of the PromiseFactory contract
     */

    function setPromiseFactoryContract(address _promiseFactoryContract)
        public
        onlyOwner
    {
        s_promiseFactoryContract = _promiseFactoryContract;
        s_promiseFactoryInterface = IPromiseFactory(_promiseFactoryContract);
    }

    /**
     * @notice Convert address to string
     * @param _addr The address to convert
     */

    function addressToString(address _addr)
        public
        pure
        returns (string memory)
    {
        bytes32 value = bytes32(uint256(uint160(_addr)));
        bytes memory alphabet = "0123456789abcdef";
        bytes memory str = new bytes(42);
        str[0] = "0";
        str[1] = "x";

        for (uint256 i = 0; i < 20; i++) {
            str[2 + i * 2] = alphabet[uint8(value[i + 12] >> 4)];
            str[3 + i * 2] = alphabet[uint8(value[i + 12] & 0x0f)];
        }

        return string(str);
    }

    function getPromiseFactoryContract() public view returns (address) {
        return s_promiseFactoryContract;
    }

    function getOraclePayment() public pure returns (uint256) {
        return ORACLE_PAYMENT;
    }
}
