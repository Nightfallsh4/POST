const {ethers} = require("hardhat")
const { parseEther } = require("ethers/lib/utils")
const addressAbi = require("../deployments/goerli/PostFactory.json")
const allowList = require("../nextjs-app/deployedAddress/allowList.json")

require("dotenv")

async function main() {

	const leaves = allowList.allowed.map((x) => keccak256(x))
	const tree = new MerkleTree(leaves, keccak256, { sortPairs: true })
	const root = tree.getHexRoot()


	const contractAddress = "0x3e646aCfDaa901239A72f86a79bf1aE93B2596ee"

	const postFactory = await ethers.getContractAt("PostFactory", contractAddress)


	const tx = await postFactory.createSoulboundReputationToken(
		"Test1",
		"T1",
        "1",
		"nightfallsh4.medium.com",
		root,
		3,
		0,
		{ value: parseEther("0.00001") },
	)

    const txReceipt = await tx.wait(1)
    console.log(txReceipt.events[0].args.dropAddress)
}

main()