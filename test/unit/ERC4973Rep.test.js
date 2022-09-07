const { mine } = require("@nomicfoundation/hardhat-network-helpers")
const { expect, assert } = require("chai")
const { network, getNamedAccounts, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")
const { MerkleTree } = require("merkletreejs")
const keccak256 = require("keccak256")

/* global BigInt */

!developmentChains.includes(network.name)
	? describe.skip
	: describe("ERC4973Rep token Unit test", function () {
			let erc4973Rep, deployer, player, playerRep, leaves, tree
			beforeEach(async () => {
				deployer = (await getNamedAccounts()).deployer
				player = (await getNamedAccounts()).player
				await deployments.fixture(["all"])
				erc4973Rep = await ethers.getContract("ERC4973Rep", deployer)
				playerRep = await ethers.getContract("ERC4973Rep", player)
				leaves = [deployer, player].map((x) => keccak256(x))
				tree = new MerkleTree(leaves, keccak256, { sortPairs: true })
			})

			describe("Constructor Function", () => {
				it("Check if issuer is set", async () => {
					const issuer = await erc4973Rep.issuer()
					assert.equal(issuer, deployer)
				})

				it("Checks if addIncrement is set", async () => {
					const addIncrement = await erc4973Rep.addIncrement()
					assert.equal(addIncrement, 5)
				})

				it("Checks if reduceIncrement os set", async () => {
					const reduceIncrement = await erc4973Rep.reduceIncrement()
					assert.equal(reduceIncrement, 25)
				})
			})

			describe("approve Function tests", () => {
				it("Reverts when not issuer", async () => {
					const leaf = keccak256(player).toString("hex")
					const proof = tree.getHexProof(leaf)
					await playerRep.mint(proof)
					await expect(playerRep.approve(player, 5)).to.be.revertedWith(
						"Only issuer can Approve Addresses",
					)
				})

				it("approvedList set Correctly", async () => {
					const expiryBlockNum = 3
					await erc4973Rep.approve(player, expiryBlockNum)
					const approvedList = await erc4973Rep.getApprovedList(player)
					assert.equal(approvedList.exists, true)
					assert.equal(approvedList.expiryBlock.toNumber(), expiryBlockNum)
				})
				it("emits ApprovalGranted", async () => {
					const expiryBlockNum = 3
					expect(await erc4973Rep.approve(player, expiryBlockNum)).to.emit(
						erc4973Rep.address,
						"ApprovalGranted",
					)
				})
			})

			describe("increaseReputation function tests", () => {
				it("Reverts if not approved or issuer", async () => {
					const expiryBlockNum = 3
					const leaf = keccak256(player).toString("hex")
					const proof = tree.getHexProof(leaf)
					await playerRep.mint(proof)
					const tokenId = await playerRep.tokenId()
					await expect(
						playerRep.increaseReputation(player, tokenId),
					).to.be.revertedWith("Not Authorised or Expired")
				})

				it("Reverts if approve expired", async () => {
					const leaf = keccak256(player).toString("hex")
					const proof = tree.getHexProof(leaf)
					await playerRep.mint(proof)
					const tokenId = await playerRep.tokenId()
					const expiryBlockNum = await ethers.provider.getBlockNumber()
					await erc4973Rep.approve(player, expiryBlockNum + 4)
					await mine(5)
					await expect(
						playerRep.increaseReputation(player, tokenId),
					).to.be.revertedWith("Not Authorised or Expired")
				})
				it("Approve passes if approved exists and before expiryBlock", async () => {
					const leaf = keccak256(player).toString("hex")
					const proof = tree.getHexProof(leaf)
					await playerRep.mint(proof)
					const tokenId = await playerRep.tokenId()
					const expiryBlockNum = await ethers.provider.getBlockNumber()
					await erc4973Rep.approve(player, expiryBlockNum + 4)
					await mine(2)
					await playerRep.increaseReputation(player, tokenId)
				})

				it("Reverts if userAddress doesnt own SBT", async () => {
					const tokenId = await playerRep.tokenId()
					const expiryBlockNum = await ethers.provider.getBlockNumber()
					await erc4973Rep.approve(player, expiryBlockNum + 4)
					await mine(2)
					await expect(
						erc4973Rep.increaseReputation(player, tokenId),
					).to.be.revertedWith("ownerOf: token doesn't exist")
				})
				it("Reverts if userAddress doesnt own given tokenId", async () => {
					const leaf = keccak256(player).toString("hex")
					const proof = tree.getHexProof(leaf)
					await playerRep.mint(proof)
					const tokenId = await playerRep.tokenId()
					const expiryBlockNum = await ethers.provider.getBlockNumber()
					await erc4973Rep.approve(player, expiryBlockNum + 4)
					await mine(2)
					await expect(
						erc4973Rep.increaseReputation(player, tokenId + 1),
					).to.be.revertedWith("ownerOf: token doesn't exist")
				})

				it("Reputation changed properly", async () => {
					const leaf = keccak256(player).toString("hex")
					const proof = tree.getHexProof(leaf)
					await playerRep.mint(proof)
					const tokenId = await playerRep.tokenId()
					const reputation = await playerRep.getReputation(player, tokenId)
					const addIncrement = await playerRep.addIncrement()
					const expiryBlockNum = await ethers.provider.getBlockNumber()
					await erc4973Rep.approve(player, expiryBlockNum + 4)
					await playerRep.increaseReputation(player, tokenId)
					const updatedReputation = await playerRep.getReputation(
						player,
						tokenId,
					)
					assert.equal(reputation + addIncrement, updatedReputation.toNumber())
				})

				it("emits ReputationChange", async () => {
					const leaf = keccak256(player).toString("hex")
					const proof = tree.getHexProof(leaf)
					await playerRep.mint(proof)
					const tokenId = await playerRep.tokenId()
					const expiryBlockNum = await ethers.provider.getBlockNumber()
					await erc4973Rep.approve(player, expiryBlockNum + 4)
					expect(await playerRep.increaseReputation(player, tokenId)).to.emit(
						playerRep.address,
						"ReputationChange",
					)
				})
			})

			describe("decreaseReputation function tests", async () => {
				it("Reputation changed to 0 when less than reduceIncrement", async () => {
					const leaf = keccak256(player).toString("hex")
					const proof = tree.getHexProof(leaf)
					await playerRep.mint(proof)
					const tokenId = await playerRep.tokenId()
					const reputation = await playerRep.getReputation(player, tokenId)
					const reduceIncrement = await playerRep.reduceIncrement()
					const expiryBlockNum = await ethers.provider.getBlockNumber()
					await erc4973Rep.approve(player, expiryBlockNum + 4)
					await playerRep.decreaseReputation(player, tokenId)
					const updatedReputation = await playerRep.getReputation(
						player,
						tokenId,
					)
					assert.equal(0, updatedReputation.toNumber())
				})

				it("emits ReputationChange", async () => {
					const leaf = keccak256(player).toString("hex")
					const proof = tree.getHexProof(leaf)
					await playerRep.mint(proof)
					const tokenId = await playerRep.tokenId()
					const expiryBlockNum = await ethers.provider.getBlockNumber()
					await erc4973Rep.approve(player, expiryBlockNum + 4)
					expect(await playerRep.decreaseReputation(player, tokenId)).to.emit(
						playerRep.address,
						"ReputationChange",
					)
				})
			})

			describe("Revoke Function tests", async () => {
				it("Reverts if not issuer", async () => {
					const expiryBlockNum = await ethers.provider.getBlockNumber()
					await erc4973Rep.approve(player, expiryBlockNum + 4)
					await expect(playerRep.revoke(player)).to.be.revertedWith(
						"Only issuer can Revoke Addresses",
					)
				})

				it("Checks if approved is revoked", async () => {
					const expiryBlockNum = await ethers.provider.getBlockNumber()
					await erc4973Rep.approve(player, expiryBlockNum + 4)
					await erc4973Rep.revoke(player)
					const approved = await erc4973Rep.getApprovedList(player)
					assert.equal(0, approved.expiryBlock)
					assert.equal(false, approved.exists)
				})
			})
	  })
