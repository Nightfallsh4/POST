// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "./Soulbound.sol";

error NotAuthorised();

contract ERC4973Rep is Soulbound {
	struct Approved {
		uint256 expiryBlock;
		bool exists;
	}

    // State Variables

	address public issuer;
	mapping(address => mapping(uint256 => uint256)) private reputation;

	uint256 public addIncrement;
	uint256 public reduceIncrement;

	mapping(address => Approved) private approvedList;

	// Events
	event ReputationChange(
		address indexed userAddress,
		uint256 indexed newReputation
	);

	event ApprovalGranted(address indexed approvedAddress);
	event Revoked(address indexed revokedAddress);

	// Modifiers
	modifier isIssuerOrApproved() {
		require(
			(approvedList[msg.sender].exists &&
				approvedList[msg.sender].expiryBlock >= block.number) ||
				msg.sender == issuer,
			"Not Authorised or Expired"
		);
		_;
	}

	// Contructor Function
	constructor(
		string memory _name,
		string memory _symbol,
		string memory version,
		string memory _uri,
		bytes32 _root,
		uint256 _mintLimit,
		uint256 initialTokenId,
		uint256 _addIncrement,
		uint256 _reduceIncrement
	) Soulbound(_name, _symbol, version, _uri, _root, _mintLimit, initialTokenId) {
		issuer = msg.sender;
		addIncrement = _addIncrement;
		reduceIncrement = _reduceIncrement;
	}

	// External Functions
	// function mint() external {
	// 	_mint(address(0), msg.sender, tokenId, uri);
	// 	tokenId += 1;
	// }

	function increaseReputation(address userAddress, uint256 _tokenId)
		external
		isIssuerOrApproved
	{
		require(ownerOf(_tokenId) == userAddress, "Address doesn't have SBT");
		reputation[userAddress][_tokenId] += addIncrement;
		emit ReputationChange(userAddress, reputation[userAddress][_tokenId]);
	}

	function decreaseReputation(address userAddress, uint256 _tokenId)
		external
		isIssuerOrApproved
	{
		require(ownerOf(_tokenId) == userAddress, "Address doesn't have SBT");
		if (reputation[userAddress][_tokenId] >= reduceIncrement) {
			reputation[userAddress][_tokenId] -= reduceIncrement;
		}else {
			reputation[userAddress][_tokenId] = 0;
		}
		emit ReputationChange(userAddress, reputation[userAddress][_tokenId]);
	}

	function approve(address addressToApprove, uint256 expiryBlock) external {
		require(msg.sender == issuer, "Only issuer can Approve Addresses");
		approvedList[addressToApprove] = Approved(expiryBlock, true);
		emit ApprovalGranted(addressToApprove);
	}

	function revoke(address addressToRevoke) external {
		require(msg.sender == issuer, "Only issuer can Revoke Addresses");
		delete approvedList[addressToRevoke];
		emit Revoked(addressToRevoke);
	}

	// Getter Functions
	function getReputation(address userAddress, uint256 _tokenId)
		public
		view
		returns (uint256)
	{
		return reputation[userAddress][_tokenId];
	}

	function getApprovedList(address userAddress)
		public
		view
		returns (Approved memory)
	{
		return approvedList[userAddress];
	}
}
