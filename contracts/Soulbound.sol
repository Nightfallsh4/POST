// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "erc4973/src/ERC4973.sol";

// import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract Soulbound is ERC4973 {
	string public uri;
	uint public tokenId = 1;
	constructor(
		string memory _name,
		string memory _symbol,
		string memory version,
		string memory _uri
	) ERC4973(_name, _symbol, version) {
		uri = _uri;
	}

	function mint() external {
		_mint(address(0),msg.sender,tokenId,uri);
		tokenId+= 1;
	}
}
