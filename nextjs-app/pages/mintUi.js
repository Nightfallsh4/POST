import {
	Box,
	Button,
	Center,
	FormControl,
	FormLabel,
	Input,
} from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi"
import Header from "../components/Header"
import allowList from "../deployedAddress/allowList.json"
import { MerkleTree } from "merkletreejs"
import keccak256 from "keccak256"
import addressJson from "../deployedAddress/address.json"

export default function mintUi() {
	const allowed = allowList.allowed
	const leaves = allowed.map((x) => keccak256(x))
	const tree = new MerkleTree(leaves, keccak256, { sortPairs: true })
	let proof
	const { address, isConnected } = useAccount()
	if (isConnected) {
		proof = tree.getHexProof(keccak256(address))
	}

	const [contractAddress, setContractAddress] = useState("")

	const changeAddress = (event) => setContractAddress(event.target.value)

	const { config } = usePrepareContractWrite({
		addressOrName: address,
		contractInterface: addressJson.soulbound.abi,
		functionName: "mint",
		args: [proof],
		// overrides: { value: parseEther("1") },
	})

	const { data, isLoading, isSuccess, write } = useContractWrite(config)

	function mintSbt() {
		console.log("Starting mint.....")
		write()
		console.log("Minted SBT!!!!!!!!")
	}

	return (
		<div>
			<Header />
			<h1 className="">Mint UI</h1>
			{isConnected ? (
				<div>
					<FormControl>
						<Center>
							<Box w="40%" margin="20" m="5">
								<div className="my-10">
									<FormLabel>Address of SBT</FormLabel>
									<Input
										variant="flushed"
										placeholder="Enter Name"
										size="lg"
										value={contractAddress}
										onChange={changeAddress}
									/>
								</div>
								<Center>
									<Button onClick={mintSbt}>Claim SBT!</Button>
								</Center>
							</Box>
						</Center>
					</FormControl>
				</div>
			) : (
				<div>
					<h1>Click "Connect Wallet"</h1>
				</div>
			)}
		</div>
	)
}
