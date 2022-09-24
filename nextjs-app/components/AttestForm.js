import {
	Box,
	Button,
	Center,
	FormControl,
	FormLabel,
	Image,
	Input,
} from "@chakra-ui/react"
import { useState } from "react"
import keccak256 from "keccak256"
import MerkleTree from "merkletreejs"
import { AddIcon } from "@chakra-ui/icons"
import IssueAttestButton from "./IssueAttestButton"

export default function AttestForm(props) {
	const [name, setName] = useState("")
	const [symbol, setSymbol] = useState("")
	const [preImage, setPreImage] = useState()
	const [mintLimit, setMintLimit] = useState("")
	const [allowList, setAllowList] = useState("")
	const [root, setRoot] = useState("")
	const [selectedFile, setSelectedFile] = useState()
	const [leaves, setLeaves] = useState()

	const changeName = (event) => setName(event.target.value)
	const changeSymbol = (event) => setSymbol(event.target.value)
	const changeMintLimit = (event) => setMintLimit(event.target.value)
	function changeAllowList(event) {
		const value = event.target.value
		const list = value.split(",")
		setAllowList(list)
	}

	function makeRoot() {
		const _leaves = allowList.map((x) => keccak256(x))
		const tree = new MerkleTree(_leaves, keccak256, { sortPairs: true })
		const _root = tree.getHexRoot()
		setRoot(_root)
		setLeaves(_leaves)
		console.log(_root)
	}

	function preview(event) {
		setSelectedFile(event.target.files[0])
		setPreImage(URL.createObjectURL(event.target.files[0]))
		console.log(selectedFile)
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
									_placeholder={{ color: "#f7efe8", opacity: 0.5 }}
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
									_placeholder={{ color: "#f7efe8", opacity: 0.5 }}
									_hover={{ bg: "#f7efe8" }}
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
									_placeholder={{ color: "#f7efe8", opacity: 0.5 }}
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
										_placeholder={{ color: "#f7efe8", opacity: 0.5 }}
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
								<div className="flex mt-10">
									<Button
										bg="#7d769b"
										color="#f7efe8"
										_hover={{ opacity: 0.77 }}
										className=""
									>
										<AddIcon />
										<label htmlFor="image" className="mx-3">
											Upload Image
										</label>
									</Button>
									<input
										className="hidden"
										type="file"
										id="image"
										onChange={preview}
									/>
									<Image
										src={preImage}
										boxSize="50px"
										className="mx-10 rounded-lg"
									/>
								</div>
							</Center>
							<Center>
								<IssueAttestButton
									formName={props.name}
									name={name}
									symbol={symbol}
									root={root}
									mintLimit={mintLimit}
									selectedFile={selectedFile}
									leaves={leaves}
									toast={props.toast}
								/>
							</Center>
						</Box>
					</Center>
				</FormControl>
				{/* <h4>{JSON.stringify(data)}</h4> */}
			</div>
		</div>
	)
}
