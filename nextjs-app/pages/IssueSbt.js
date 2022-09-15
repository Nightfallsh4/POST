import {
	Box,
	Button,
	Center,
	FormControl,
	FormLabel,
	Input,
} from "@chakra-ui/react"
import { useState } from "react"
import Header from "../components/Header"
import addressJson from "../deployedAddress/address.json"
import keccak256 from "keccak256"
import MerkleTree from "merkletreejs"
import {
	useContract,
	useContractWrite,
	usePrepareContractWrite,
	useProvider,
	useWaitForTransaction,
} from "wagmi"
import { parseEther } from "ethers/lib/utils"
import { getDefaultProvider } from "ethers"

export default function IssueSbt() {
	const [name, setName] = useState("")
	const [symbol, setSymbol] = useState("")
	const [uri, setUri] = useState("")
	const [mintLimit, setMintLimit] = useState(0)
	const [allowList, setAllowList] = useState("")
	const [root, setRoot] = useState("")

	const changeName = (event) => setName(event.target.value)
	const changeSymbol = (event) => setSymbol(event.target.value)
	const changeUri = (event) => setUri(event.target.value)
	const changeMintLimit = (event) => setMintLimit(event.target.value)
	function changeAllowList(event) {
		const value = event.target.value
		const list = value.split(",")
		setAllowList(list)
	}
	const { config } = usePrepareContractWrite({
		addressOrName: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
		// contractInterface: addressJson.abi,
		contractInterface: addressJson.abi,
		functionName: "createSoulboundToken",
		args: [name, symbol, "1", uri, root, mintLimit, 0],
		overrides: { value: parseEther("1") },
	})
	const { data, isLoading, isSuccess, write } = useContractWrite(config)

	const waitTransaction = useWaitForTransaction(data?.hash)
	function makeRoot() {
		const leaves = allowList.map((x) => keccak256(x))
		const tree = new MerkleTree(leaves, keccak256, { sortPairs: true })
		const _root = tree.getHexRoot()
		setRoot(_root)
		console.log(_root)
	}
	async function issueToken() {
		console.log("Name- " + name)
		console.log("Symbol-" + symbol)
		console.log("Uri- " + uri)
		console.log("Mint limit- " + mintLimit)
		console.log("Root- " + root)
		await write?.()
		console.log(waitTransaction)
	}

	return (
		<div>
			<Header />
			<h1>Issue Soulbound Token</h1>
			<div className="p-10">
				<FormControl>
					<Center>
						<Box w="40%" margin="20" m="5">
							<div className="my-10">
								<FormLabel>Name of SBT</FormLabel>
								<Input
									variant="flushed"
									placeholder="Enter Name"
									size="lg"
									value={name}
									onChange={changeName}
								/>
							</div>
							<div className="my-10">
								<FormLabel>Symbol</FormLabel>
								<Input
									variant="flushed"
									placeholder="Symbol"
									size="lg"
									value={symbol}
									onChange={changeSymbol}
								/>
							</div>
							<div className="my-10">
								<FormLabel>URI</FormLabel>
								<Input
									variant="flushed"
									placeholder="URI"
									size="lg"
									value={uri}
									onChange={changeUri}
								/>
							</div>
							<div className="my-10">
								<FormLabel>Mint Limit per Address</FormLabel>
								<Input
									variant="flushed"
									placeholder="Mint Limit"
									size="lg"
									value={mintLimit}
									onChange={changeMintLimit}
								/>
							</div>
							<div className="my-10">
								<FormLabel>Allow List</FormLabel>
								<Input
									variant="flushed"
									placeholder="Allow List"
									size="lg"
									value={allowList}
									onChange={changeAllowList}
								/>
								<Button onClick={makeRoot}>Make Root</Button>
							</div>
							<Button onClick={issueToken}>Issue Soulbound Token</Button>
						</Box>
					</Center>
				</FormControl>
				<h4>{JSON.stringify(data)}</h4>
				{waitTransaction.isSuccess ? (
					<div>
						<h4>{JSON.stringify(waitTransaction.data)}</h4>
						<h3>{waitTransaction.isSuccess}</h3>
					</div>
				) : (
					<h4></h4>
				)}
			</div>
		</div>
	)
}
