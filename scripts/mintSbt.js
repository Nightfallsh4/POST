const {ethers} = require("hardhat")
const { parseEther } = require("ethers/lib/utils")
const {MerkleTree} = require("merkletreejs")
const keccak256 = require("keccak256")
const allowList = require("../nextjs-app/deployedAddress/allowList.json")
require("dotenv")
async function main() {
    const leaves = allowList.allowed.map((x) => keccak256(x))
	const tree = new MerkleTree(leaves, keccak256, { sortPairs: true })
	const root = tree.getHexRoot()
    const proof = tree.getHexProof(keccak256("0xB721347D2938a5594a12DF5Cc36D598b839Cb98f"))

    contractAddress = "0xD2dFdAE2B7952becc308FeE43df9173dfB70C075"
    const soulbound = await ethers.getContractAt("Soulbound", contractAddress)
    const txResponse = await soulbound.mint(proof)
    const txReceipt = await txResponse.wait(1)
    console.log(txReceipt);
}
main()