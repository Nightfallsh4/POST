const ethers = require("ethers")
const { parseEther } = require("ethers/lib/utils")
const addressAbi = require("../nextjs-app/deployedAddress/address.json")

async function main() {
	let httpProvider = new ethers.providers.JsonRpcProvider()
	const contractAddress = "0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9"

	const postFactory = new ethers.Contract(contractAddress, addressAbi.postFactory.abi)
	const privateKey =
		"0x8166f546bab6da521a8369cab06c5d2b9e46670292d85c875ee9ec20e84ffb61"
	const wallet = new ethers.Wallet(privateKey, httpProvider)

	const contractWithSigner = postFactory.connect(wallet)

	const tx = await contractWithSigner.createSoulboundToken(
		"Test1",
		"T1",
        "1",
		"nightfallsh4.medium.com",
		"0xe5138641064c9686935546c3267e44a6a0a8d58c623e1ff8e291b704b7f39d58",
		3,
		0,
		{ value: parseEther("0.1") },
	)

    const txReceipt = await tx.wait(1)
    console.log(txReceipt.events[0].args.dropAddress)
}

main()