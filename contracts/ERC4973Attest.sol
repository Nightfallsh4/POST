// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "./Soulbound.sol";

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";

contract ERC4973Attest is Soulbound {
	// State Variables

	mapping(address => mapping(uint256 => address)) private tokenToAttester;
	mapping(address => mapping(uint256 => address[])) private tokenToAttestation;

	// Modifiers
	modifier isOwner(uint256 _tokenId) {
		require(ownerOf(_tokenId) == msg.sender, "Only owner can request attest");
		_;
	}

	// Events
	event AttestationRequest(
		address indexed attestee,
		address indexed attester,
		uint256 indexed _tokenId
	);
	event AttestationFulfilled(
		address indexed attestee,
		address indexed attester,
		uint256 indexed _tokenId
	);
	event RequestDeleted(address indexed attestee, uint256 indexed _tokenId);

	// constructor Functions
	constructor(
		string memory _name,
		string memory _symbol,
		string memory version,
		string memory _uri,
		bytes32 _root,
		uint256 _mintLimit,
		uint256 initialTokenId
	)
		Soulbound(_name, _symbol, version, _uri, _root, _mintLimit, initialTokenId)
	{}

	// External Function
	// function mint() external {
	// 	_mint(address(0), msg.sender, tokenId, uri);
	// 	tokenId += 1;
	// }

	function requestAttestation(address attesterAddress, uint256 _tokenId)
		external
		isOwner(_tokenId)
	{
		tokenToAttester[msg.sender][_tokenId] = attesterAddress;
		emit AttestationRequest(msg.sender, attesterAddress, _tokenId);
	}

	function approveAttestation(address attesteeAddress, uint256 _tokenId)
		external
	{
		require(
			tokenToAttester[attesteeAddress][_tokenId] == msg.sender,
			"Only requested Address can attest"
		);
		tokenToAttestation[attesteeAddress][_tokenId].push(msg.sender);
		emit AttestationFulfilled(attesteeAddress, msg.sender, _tokenId);
	}

	function deleteRequest(uint256 _tokenId) external isOwner(_tokenId) {
		delete tokenToAttester[msg.sender][_tokenId];
		emit RequestDeleted(msg.sender, _tokenId);
	}

	// Getter Functions

	function getTokenToAttester(address userAddress, uint256 _tokenId)
		public
		view
		returns (address)
	{
		return tokenToAttester[userAddress][_tokenId];
	}

	function getTokenToAttestation(address userAddress, uint256 _tokenId)
		public
		view
		returns (address[] memory)
	{
		return tokenToAttestation[userAddress][_tokenId];
	}
}
