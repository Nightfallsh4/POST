// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "erc4973/src/ERC4973.sol";

error NotAuthorised();

contract ERC4973Rep is ERC4973 {
	struct Approved {
		uint256 expiryBlock;
		bool exits;
	}

	string public uri;
	uint256 public tokenId = 1;
	address public issuer;
	mapping(address => mapping(uint256 => uint256)) public reputation;

	uint256 public addIncrement;
	uint256 public reduceIncrement;

	
	mapping(address => Approved) public approvedList;

	event ReputationChange(
		address indexed userAddress,
		uint indexed newReputation
	);

	event Revoked(
		address indexed revokedAddress
	);

	modifier isIssuerOrApproved() {
		require(
			(approvedList[msg.sender].exits &&
				approvedList[msg.sender].expiryBlock >= block.number) ||
				msg.sender == issuer,
			"Not Authorised or Expired"
		);
		_;
	}

	constructor(
		string memory _name,
		string memory _symbol,
		string memory version,
		string memory _uri,
		uint256 _addIncrement,
		uint256 _reduceIncrement
	) ERC4973(_name, _symbol, version) {
		issuer = msg.sender;
		uri = _uri;
		addIncrement = _addIncrement;
		reduceIncrement = _reduceIncrement;
	}

	function mint() external {
		_mint(address(0), msg.sender, tokenId, uri);
		tokenId += 1;
	}

	function increaseReputation(address userAddress, uint256 _tokenId)
		external
		isIssuerOrApproved()
	{
		require(ownerOf(_tokenId)== userAddress, "Address doesn't have SBT");
		reputation[userAddress][_tokenId] += addIncrement;
		emit ReputationChange(userAddress,reputation[userAddress][_tokenId]);
	}

	function decreaseReputation(address userAddress, uint256 _tokenId)
		external
		isIssuerOrApproved()
	{
		require(ownerOf(_tokenId)== userAddress, "Address doesn't have SBT");
		reputation[userAddress][_tokenId] -= reduceIncrement;
		emit ReputationChange(userAddress,reputation[userAddress][_tokenId]);
	}

	function approve(
		address addressToApprove,
		uint256 expiryBlock
	) external {
		require(msg.sender == issuer, "Only issuer can Approve Addresses");
		approvedList[addressToApprove] = Approved(expiryBlock,true);
	}

	function revoke(address addressToRevoke) external {
		require(msg.sender == issuer, "Only issuer can Approve Addresses");
		delete approvedList[addressToRevoke];
		emit Revoked(addressToRevoke);
	}
}
