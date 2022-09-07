const { expect, assert } = require("chai")
const { network, getNamedAccounts, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")
const { MerkleTree } = require("merkletreejs")
const keccak256 = require("keccak256")

/* global BigInt */

!developmentChains.includes(network.name)
	? describe.skip
	: describe("Souldbound token Unit test", function () {
			let soulbound, deployer, player, leaves, tree
			beforeEach(async () => {
				deployer = (await getNamedAccounts()).deployer
				player = (await getNamedAccounts()).player
				await deployments.fixture(["Soulbound"])
				soulbound = await ethers.getContract("Soulbound", deployer)
				leaves = [deployer, player].map(x => keccak256(x))
				tree = new MerkleTree(leaves, keccak256, {sortPairs:true})			})

			describe("Check constructor fucntion", function () {
				it("Checks if params set correctly", async () => {
					const name = await soulbound.name()
					const symbol = await soulbound.symbol()
					const tokenURI = await soulbound.uri()
					const root = await soulbound.root()
					const mintLimit = await soulbound.mintLimit()
					const tokenId = await soulbound.tokenId()

					assert.equal("Soulbound", name)
					assert.equal("SB", symbol)
					assert.equal(
						"bafybeid4yz4ytfi46ku76nvpzmifkcrysa5w7err6yb6uftflga5g7z33u",
						tokenURI,
					)
					assert.equal(
						"0x070e8db97b197cc0e4a1790c5e6c3667bab32d733db7f815fbe84f5824c7168d",
						root,
					)
					assert.equal(3, mintLimit)
					assert.equal(0, tokenId)
				})
			})

			describe("Check mint function", function () {
				it("Check if minted to correct address", async () => {
					const leaf = keccak256(deployer).toString("hex")
					const proof = tree.getHexProof(leaf)
					await soulbound.mint(proof)
					const tokenId = await soulbound.tokenId()
					const address = await soulbound.ownerOf(tokenId)
					assert.equal(deployer, address)
				})

				it("check if tokenId has increased", async () => {
					const tokenId = await soulbound.tokenId()
					const leaf = keccak256(deployer).toString("hex")
					const proof = tree.getHexProof(leaf)
					await soulbound.mint(proof)					
					const secondTokenId = await soulbound.tokenId()
					assert.equal(tokenId.toNumber() + 1, secondTokenId.toNumber())
				})

				it("Checks if balanceOf is updated", async () => {
					const initialBalance = await soulbound.balanceOf(deployer)
					const leaf = keccak256(deployer).toString("hex")
					const proof = tree.getHexProof(leaf)
					await soulbound.mint(proof)	
					const secondBalance = await soulbound.balanceOf(deployer)
					assert.equal(initialBalance.toNumber() + 1, secondBalance.toNumber())
				})

				it("Checks if tokenURI is set", async () => {
					const leaf = keccak256(deployer).toString("hex")
					const proof = tree.getHexProof(leaf)
					await soulbound.mint(proof)	
					const tokenId = await soulbound.tokenId()
					const tokenURI = await soulbound.tokenURI(tokenId)
					assert.equal(
						"bafybeid4yz4ytfi46ku76nvpzmifkcrysa5w7err6yb6uftflga5g7z33u",
						tokenURI,
					)
				})
			})

			describe("Testing ERC4973 features", () => {
				it("Checks if unequips", async () => {
					const leaf = keccak256(deployer).toString("hex")
					const proof = tree.getHexProof(leaf)
					await soulbound.mint(proof)	
					const tokenId = await soulbound.tokenId()
					await soulbound.unequip(tokenId)
					await expect(soulbound.ownerOf(tokenId)).to.be.revertedWith(
						"ownerOf: token doesn't exist",
					)
				})

				// it("Checks if give works", async () => {
				// 	const tokenId = await soulbound.tokenId()
				// 	await soulbound.mint()
				// 	const tokenURI = await soulbound.tokenURI(tokenId)
				// 	const owner = await soulbound.ownerOf(tokenId)
				// 	const contractHash = await soulbound._getHash(
				// 		deployer,
				// 		player,
				// 		tokenURI,
				// 	)

				// 	console.log(owner)
				// 	console.log(player)
				// 	const types = {
				// 		Agreement: [
				// 			{ name: "active", type: "address" },
				// 			{ name: "passive", type: "address" },
				// 			{ name: "tokenURI", type: "string" },
				// 		],
				// 	}
				// 	const domain = {
				// 		name: "Soulbound",
				// 		version: "1",
				// 		chainId: 31337,
				// 		verifyingContract: soulbound.address,
				// 	}
				// 	// console.log(tokenURI)
				// 	const agreement = {
				// 		active: deployer,
				// 		passive: player,
				// 		tokenURI: tokenURI,
				// 	}
				// 	const signer = await ethers.getSigner(player)

				// 	// const signature = await signer._signTypedData(
				// 	// 	domain,
				// 	// 	types,
				// 	// 	agreement,
				// 	// )
				// 	const signature = await signer.signMessage(player)

				// 	console.log("Contract Hash:- " + contractHash)
				// 	console.log("Signature:- "+signature)
				// 	const { compact } = ethers.utils.splitSignature(signature)
				// 	console.log(compact)
				// 	const secondTokenId = await soulbound.give(
				// 		player,
				// 		tokenURI,
				// 		compact,
				// 	)
				// 	console.log("secondTokenId:- " + secondTokenId)
				// 	const secondOwner = await soulbound.ownerOf(secondTokenId)
				// 	console.log(secondOwner)
				// 	assert.equal(player, secondOwner)
				// })
			})
	  })
