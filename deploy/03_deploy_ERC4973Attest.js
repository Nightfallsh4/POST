// deploy/00_deploy_your_contract.js

//const { ethers } = require("hardhat");
const { MerkleTree } = require("merkletreejs")
const keccak256 = require("keccak256")

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments
	const { deployer, player } = await getNamedAccounts()
	const leaves = [deployer, player].map(x => keccak256(x))
	const tree = new MerkleTree(leaves, keccak256, {sortPairs:true})
  const root = tree.getHexRoot()
  const leaf = keccak256(player)


	await deploy("ERC4973Attest", {
		from: deployer,
		args: [
			"ERC4973Attest",
			"ATTEST",
			"1",
			"bafybeifuhw26cjjqimxaayh4vii2dwwfmcxvexlxqawy3mtxhjtfevkf7i",
			root,
			3,
			0,
		],
		log: true,
	})
}
module.exports.tags = ["ERC4973Attest", "all"]
