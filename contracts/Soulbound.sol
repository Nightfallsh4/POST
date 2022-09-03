// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "erc4973/src/ERC4973.sol";

// import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract Soulbound is ERC4973 {
	string public uri = "nightfallsh4.medium.com";
	uint public tokenId = 1;
	constructor(
		string memory _name,
		string memory _symbol,
		string memory version
	) ERC4973(_name, _symbol, version) {}

	function mint() external {
		_mint(address(0),msg.sender,tokenId,uri);
		tokenId+= 1;
	}
}
