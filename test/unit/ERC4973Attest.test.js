const { expect, assert } = require("chai")
const { network, getNamedAccounts, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")
const { MerkleTree } = require("merkletreejs")
const keccak256 = require("keccak256")

/* global BigInt */

!developmentChains.includes(network.name)
	? describe.skip
	: describe("ERC4973Attest token Unit test", function () {
			let erc4973Attest, deployer, player, playerAttest, player2, leaves, tree
			beforeEach(async () => {
				deployer = (await getNamedAccounts()).deployer
				player = (await getNamedAccounts()).player
                player2 = (await getNamedAccounts()).player2
				await deployments.fixture(["all"])
				erc4973Attest = await ethers.getContract("ERC4973Attest", deployer)
				playerAttest = await ethers.getContract("ERC4973Attest", player)
                player2Attest = await ethers.getContract("ERC4973Attest", player2)
                leaves = [deployer, player].map((x) => keccak256(x))
				tree = new MerkleTree(leaves, keccak256, { sortPairs: true })
			})

            describe("requestAttestation Functions Tests", () => {
                it("Reverts if not owner", async () => {
                    const leaf = keccak256(player).toString("hex")
					const proof = tree.getHexProof(leaf)
					await playerAttest.mint(proof)
                    tokenId = await playerAttest.tokenId()
                    await expect(erc4973Attest.requestAttestation(player, tokenId)).to.be.revertedWith("Only owner can request attest")
                })
                it("tokenToAttester is set correctly", async () => {
                    const leaf = keccak256(player).toString("hex")
					const proof = tree.getHexProof(leaf)
					await playerAttest.mint(proof)
                    tokenId = await playerAttest.tokenId()
                    await playerAttest.requestAttestation(player2, tokenId)
                    const attester = await playerAttest.getTokenToAttester(player, tokenId)
                    assert.equal(player2, attester)
                })
                it("emits AttestationRequest", async () => {
                    const leaf = keccak256(player).toString("hex")
					const proof = tree.getHexProof(leaf)
					await playerAttest.mint(proof)
                    tokenId = await playerAttest.tokenId()
                    expect(await playerAttest.requestAttestation(player2, tokenId)).to.emit("AttestationRequest")
                })
            })

            describe("approve attestation function", () => {
                it("reverts of address is not requested attester", async () => {
                    const leaf = keccak256(player).toString("hex")
					const proof = tree.getHexProof(leaf)
					await playerAttest.mint(proof)
                    tokenId = await playerAttest.tokenId()
                    await playerAttest.requestAttestation(player2, tokenId)
                    await expect(erc4973Attest.approveAttestation(player, tokenId)).to.be.revertedWith("Only requested Address can attest")
                })

                it("Correctly added to attestation list", async () => {
                    const leaf = keccak256(player).toString("hex")
					const proof = tree.getHexProof(leaf)
					await playerAttest.mint(proof)
                    tokenId = await playerAttest.tokenId()
                    await playerAttest.requestAttestation(player2, tokenId)
                    await player2Attest.approveAttestation(player, tokenId)
                    const attestationList = await playerAttest.getTokenToAttestation(player, tokenId)
                    assert.equal(player2,attestationList[0])
                })

                it("emits AttestationFulfilled", async () => {
                    const leaf = keccak256(player).toString("hex")
					const proof = tree.getHexProof(leaf)
					await playerAttest.mint(proof)
                    tokenId = await playerAttest.tokenId()
                    await playerAttest.requestAttestation(player2, tokenId)
                    expect(await player2Attest.approveAttestation(player, tokenId)).to.emit("AttestationFulfilled")
                })
            })

            describe("deleteRequest function tests", async () => {
                it("Deletes tokenToAttester", async () => {
                    const leaf = keccak256(player).toString("hex")
					const proof = tree.getHexProof(leaf)
					await playerAttest.mint(proof)
                    tokenId = await playerAttest.tokenId()
                    await playerAttest.requestAttestation(player2, tokenId)
                    await playerAttest.deleteRequest(tokenId)
                    const attester = await playerAttest.getTokenToAttester(player, tokenId)
                    assert.equal("0x0000000000000000000000000000000000000000", attester)
                })
                it("Emits RequestDeleted", async () => {
                    const leaf = keccak256(player).toString("hex")
					const proof = tree.getHexProof(leaf)
					await playerAttest.mint(proof)
                    tokenId = await playerAttest.tokenId()
                    await playerAttest.requestAttestation(player2, tokenId)
                    expect(await playerAttest.deleteRequest(tokenId)).to.emit("RequestDeleted")
                })
            })
        })