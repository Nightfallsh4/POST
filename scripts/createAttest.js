const ethers = require("ethers")
const { parseEther } = require("ethers/lib/utils")
const addressAbi = require("../nextjs-app/deployedAddress/address.json")

async function main() {
	let httpProvider = new ethers.providers.JsonRpcProvider()
	const contractAddress = "0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9"

	const postFactory = new ethers.Contract(contractAddress, addressAbi.abi)
	const privateKey =
		"0x8166f546bab6da521a8369cab06c5d2b9e46670292d85c875ee9ec20e84ffb61"
	const wallet = new ethers.Wallet(privateKey, httpProvider)

	const contractWithSigner = postFactory.connect(wallet)

	const tx = await contractWithSigner.createSoulboundAttestationToken(
		"Test1",
		"T1",
        "1",
		"nightfallsh4.medium.com",
		"0x070e8db97b197cc0e4a1790c5e6c3667bab32d733db7f815fbe84f5824c7168d",
		3,
		0,
		{ value: parseEther("0.1") },
	)

    const txReceipt = await tx.wait(1)
    console.log(txReceipt.events[0].args.dropAddress)
}

main()