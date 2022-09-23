import {
	Box,
	Button,
	Center,
	FormControl,
	FormLabel,
	Input,
} from "@chakra-ui/react"
import { useState } from "react"
import Header from "./Header"
import addressJson from "../deployedAddress/address.json"
import keccak256 from "keccak256"
import MerkleTree from "merkletreejs"
import {
	useContractWrite,
	usePrepareContractWrite,
	useWaitForTransaction,
} from "wagmi"
import { parseEther } from "ethers/lib/utils"

export default function RepForm(props) {
	const [name, setName] = useState("")
	const [symbol, setSymbol] = useState("")
	const [uri, setUri] = useState("")
	const [mintLimit, setMintLimit] = useState()
	const [allowList, setAllowList] = useState("")
	const [root, setRoot] = useState("")
    const [addIncrement, setAddIncrement] = useState()
    const [reduceIncrement, setReduceIncrement] = useState()

	const changeName = (event) => setName(event.target.value)
	const changeSymbol = (event) => setSymbol(event.target.value)
	const changeUri = (event) => setUri(event.target.value)
	const changeMintLimit = (event) => setMintLimit(event.target.value)
    const changeAddIncrement = (event) => setAddIncrement(event.target.value)
    const changeReduceIncrement = (event) => setReduceIncrement(event.target.value)
	function changeAllowList(event) {
		const value = event.target.value
		const list = value.split(",")
		setAllowList(list)
	}
	const { config } = usePrepareContractWrite({
		addressOrName: "0x3e646aCfDaa901239A72f86a79bf1aE93B2596ee",
		contractInterface: addressJson.postFactory.abi,
		functionName: "createSoulboundReputationToken",
		args: [name, symbol, "1", uri, root, mintLimit, 0, addIncrement, reduceIncrement],
		overrides: { value: parseEther("0.001") },
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
		await write?.()
	}

	return (
		<div>
			<Center>
				<h1 className="text-3xl">Issue {props.name} Token</h1>
			</Center>

			<div className="py-10">
				<FormControl>
					<Center>
						<Box w={props.size} margin="">
							<div className="my-5">
								<FormLabel>Name of {props.abb}</FormLabel>
								<Input
									variant="filled"
									placeholder="Name"
									size="lg"
									value={name}
									onChange={changeName}
									bgColor="rgba(208, 130, 144,0.77)"
									_placeholder={{ color: "#f7efe8", opacity:0.5 }}
									_hover={{ bg: "#f7efe8" }}
									focusBorderColor="#d08290"
									className="drop-shadow-xl font-['ALEGREYA'] font-bold"
								/>
							</div>
							<div className="my-5">
								<FormLabel>Symbol</FormLabel>
								<Input
									variant="filled"
									placeholder="Symbol"
									size="lg"
									value={symbol}
									onChange={changeSymbol}
									bgColor="rgba(208, 130, 144,0.77)"
									_placeholder={{ color: "#f7efe8", opacity:0.5 }}
									_hover={{ bg: "#f7efe8" }}
									focusBorderColor="#d08290"
									className="drop-shadow-xl font-['ALEGREYA'] font-bold"
								/>
							</div>
							<div className="my-5">
								<FormLabel>URI</FormLabel>
								<Input
									variant="filled"
									placeholder="URI"
									size="lg"
									value={uri}
									onChange={changeUri}
									bgColor="rgba(208, 130, 144,0.77)"
									_placeholder={{ color: "#f7efe8", opacity:0.5 }}
									focusBorderColor="#d08290"
									className="drop-shadow-xl font-['ALEGREYA'] font-bold"
								/>
							</div>
							<div className="my-5">
								<FormLabel>Mint Limit per Address</FormLabel>
								<Input
									variant="filled"
									placeholder="Mint Limit"
									size="lg"
									value={mintLimit}
									onChange={changeMintLimit}
									bgColor="rgba(208, 130, 144,0.77)"
									_placeholder={{ color: "#f7efe8", opacity:0.5 }}
									focusBorderColor="#d08290"
									className="drop-shadow-xl font-['ALEGREYA'] font-bold"
								/>
							</div>
                            <div className="my-5">
								<FormLabel>Add Increment</FormLabel>
								<Input
									variant="filled"
									placeholder="Mint Limit"
									size="lg"
									value={addIncrement}
									onChange={changeAddIncrement}
									bgColor="rgba(208, 130, 144,0.77)"
									_placeholder={{ color: "#f7efe8", opacity:0.5 }}
									focusBorderColor="#d08290"
									className="drop-shadow-xl font-['ALEGREYA'] font-bold"
								/>
							</div>
                            <div className="my-5">
								<FormLabel>Reduce Increment</FormLabel>
								<Input
									variant="filled"
									placeholder="Mint Limit"
									size="lg"
									value={reduceIncrement}
									onChange={changeReduceIncrement}
									bgColor="rgba(208, 130, 144,0.77)"
									_placeholder={{ color: "#f7efe8", opacity:0.5 }}
									focusBorderColor="#d08290"
									className="drop-shadow-xl font-['ALEGREYA'] font-bold"
								/>
							</div>
							<div className="my-5">
								<FormLabel>Allow List</FormLabel>
								<div className="flex items-center">
									<Input
										variant="filled"
										placeholder="Allow List"
										size="lg"
										value={allowList}
										onChange={changeAllowList}
										bgColor="rgba(208, 130, 144,0.77)"
										_placeholder={{ color: "#f7efe8", opacity:0.5}}
										focusBorderColor="#d08290"
										className="drop-shadow-xl font-['ALEGREYA'] font-bold"
									/>
									<Button
										onClick={makeRoot}
										bg="#7d769b"
										color="#f7efe8"
										_hover={{ opacity: 0.77 }}
										className="ml-7"
										px="1.5rem"
									>
										Make Root
									</Button>
								</div>
							</div>
							<Center>
								<Button
									disabled={!root}
									onClick={issueToken}
									bg="#7d769b"
									color="#f7efe8"
									_hover={{ opacity: 0.77 }}
									className="mt-10"
								>
									Issue {props.name} Token
								</Button>
							</Center>
						</Box>
					</Center>
				</FormControl>
				<h4>{JSON.stringify(data)}</h4>
			</div>
		</div>
	)
}