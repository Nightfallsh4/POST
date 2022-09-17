// const {ethers} = require("hardhat")
// const { parseEther } = require("ethers/lib/utils")
// const {MerkleTree} = require("merkletreejs")
// const keccak256 = require("keccak256")
// async function main() {
//     const leaves = allowList.allowed.map((x) => keccak256(x))
// 	const tree = new MerkleTree(leaves, keccak256, { sortPairs: true })
// 	const root = tree.getHexRoot()
//     const proof = tree.getHexProof(keccak256())

//     contractAddress = ""
//     const postFactory = await ethers.getContractAt("Soulbound", contractAddress)
// }