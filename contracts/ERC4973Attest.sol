// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "erc4973/src/ERC4973.sol";


// import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";

contract ERC4973Attest is ERC4973 {
	
    // State Variables
    string public uri;
	uint256 public tokenId = 1;
    mapping(address => mapping(uint => address)) tokenToAttester;
    mapping(address => mapping(uint => address[])) tokenToAttestation;

    // Modifiers
    modifier isOwner(uint _tokenId) {
        require(ownerOf(_tokenId) == msg.sender,"Only owner can request attest");
        _;
    }

    // Events
    event AttestationRequest(
        address indexed attestee,
        address indexed attester,
        uint indexed _tokenId
    );
    event AttestationFulfilled(
        address indexed attestee,
        address indexed attester,
        uint indexed _tokenId
    );
    event RequestDeleted(
        address indexed attestee,
        uint indexed _tokenId 
    );

    // constructor Functions
	constructor(
		string memory _name,
		string memory _symbol,
		string memory version,
		string memory _uri
	) ERC4973(_name, _symbol, version) {
		uri = _uri;
	}

    // External Function
	function mint() external {
		_mint(address(0), msg.sender, tokenId, uri);
		tokenId += 1;
	}
    function requestAttestation(address attesterAddress, uint _tokenId) external isOwner(_tokenId){
        tokenToAttester[msg.sender][_tokenId] = attesterAddress;
        emit AttestationRequest(msg.sender, attesterAddress, _tokenId);
    }

    function approveAttestation(address attesteeAddress, uint _tokenId) external {
        require(tokenToAttester[attesteeAddress][_tokenId] == msg.sender, "Only requested Address can attest");
        tokenToAttestation[attesteeAddress][_tokenId].push(msg.sender);
        emit AttestationFulfilled(attesteeAddress, msg.sender, _tokenId);
    }

    function deleteRequest(uint _tokenId) external isOwner(_tokenId) {
        delete tokenToAttester[msg.sender][_tokenId];
        emit RequestDeleted(msg.sender, _tokenId);
    }

}