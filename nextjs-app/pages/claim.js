import {
	Box,
	Center,
	FormControl,
	FormLabel,
	Input,
} from "@chakra-ui/react"
import { useState } from "react"
import { useAccount} from "wagmi"
import Header from "../components/Header"
import allowList from "../deployedAddress/allowList.json"
import { MerkleTree } from "merkletreejs"
import keccak256 from "keccak256"
import MintButton from "../components/MintButton"
import Footer from "../components/Footer"

export default function claim() {
	const allowed = allowList.allowed
	const leaves = allowed.map((x) => keccak256(x))
	const tree = new MerkleTree(leaves, keccak256, { sortPairs: true })
	let proof
	const { address, isConnected } = useAccount()
	if (isConnected) {
		proof = tree.getHexProof(keccak256(address))
		console.log(proof)
	}

	const [contractAddress, setContractAddress] = useState("")

	const changeAddress = (event) => setContractAddress(event.target.value)

	return (
		<div>
			<Header />
			<Center><h1 className="text-2xl">Mint UI</h1></Center>
				<div>
					<FormControl>
						<Center>
							<Box w="40%" margin="20" m="5">
								<div className="my-10">
									<FormLabel>Address of SBT</FormLabel>
									<Input
									variant="filled"
									placeholder="Contract Address"
									size="lg"
									value={contractAddress}
									onChange={changeAddress}
									bgColor="rgba(208, 130, 144,0.77)"
									_placeholder={{ color: "#f7efe8" }}
									_hover={{ bg: "#f7efe8" }}
									focusBorderColor="#d08290"
									className="drop-shadow-xl font-['ALEGREYA'] font-bold"
								/>
								</div>
								<Center>
									<MintButton contractAddress={contractAddress} proof={proof}/>
								</Center>
							</Box>
						</Center>
					</FormControl>
				</div>
			<Footer/>
		</div>
	)
}
