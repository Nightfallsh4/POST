const { ethers } = require("hardhat")
require("dotenv")

async function main() {
	contractAddress = "0x3e646aCfDaa901239A72f86a79bf1aE93B2596ee"
	const postFactory = await ethers.getContractAt("PostFactory", contractAddress)
	const txResponse = await postFactory.withdrawFees()
	const txReceipt = await txResponse.wait(1)
	console.log(txReceipt)
}
main()
