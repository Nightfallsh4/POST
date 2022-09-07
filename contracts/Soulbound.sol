// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "erc4973/src/ERC4973.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

error TransfersNotSupportedYet();

contract Soulbound is ERC4973 {
	// State Varaibles
	string public uri;
	uint256 public tokenId;
	bytes32 public root;
	uint256 public mintLimit;
	mapping(address => uint) private tokenPerAddress;
	// Constructor Function
	constructor(
		string memory _name,
		string memory _symbol,
		string memory version,
		string memory _uri,
		bytes32 _root,
		uint256 _mintLimit,
		uint256 initialTokenId
	) ERC4973(_name, _symbol, version) {
		uri = _uri;
		root = _root;
		mintLimit = _mintLimit;
		tokenId = initialTokenId;
	}

	// External Functions
	function mint(bytes32[] memory proof) external {
		require(isValid(proof), "Not Valid proof for Address");
		require(tokenPerAddress[msg.sender]<mintLimit, "Token Limit Reached");
		tokenPerAddress[msg.sender] += 1;
		tokenId += 1;
		_mint(address(0), msg.sender, tokenId, uri);
	}


	function give(
		address, /*to*/
		string calldata, /*uri*/
		bytes calldata /*signature*/
	) external override returns (uint256) {
		// require(msg.sender != to, "give: cannot give from self");
		// uint256 tokenId = _safeCheckAgreement(msg.sender, to, uri, signature);
		// _mint(msg.sender, to, tokenId, uri);
		// _usedHashes.set(tokenId);
		// return tokenId;
		revert TransfersNotSupportedYet();
	}


	function isValid(bytes32[] memory proof) public view returns (bool){
		return MerkleProof.verify(proof, root, keccak256(abi.encodePacked(msg.sender)));
	}

}
