import {
	Button,
	Center,
	Image,
	Link,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	useDisclosure,
} from "@chakra-ui/react"
import keccak256 from "keccak256"
import MerkleTree from "merkletreejs"
import { useEffect, useState } from "react"
import { useAccount } from "wagmi"
import { Web3Storage } from "web3.storage"

import MintButton from "./MintButton"

export default function Panel(props) {
	const { isOpen, onOpen, onClose } = useDisclosure()
	const [image, setImage] = useState()
	const [proof, setProof] = useState()
	const [eligiblity, setEligibility] = useState(false)
	const { isConnected, address } = useAccount()
	let imageUrl, url, allowedUrl
	if (props.uri.startsWith("ipfs://")) {
		url = props.uri.replace("ipfs://", "https://cloudflare-ipfs.com/ipfs/")
		allowedUrl = props.uri.replace("ipfs://", "")
		imageUrl = url + "/image.jpg"
	}
	async function getAllowed() {
		const token = process.env.NEXT_PUBLIC_WEB3_STORAGE
		const web3Client = new Web3Storage({ token: token })
		const res = await web3Client.get(allowedUrl).catch((e) => {
			console.log(e)
		})
		if (!res.ok) {
			console.log("cant find the specified res")
		} else {
			console.log(res)
			const files = await res.files()
			console.log(files[0])
			const fileReader = new FileReader()
			fileReader.onload = (event) => {
				getProof(JSON.parse(event.target.result).allowed)
			}
			fileReader.readAsText(files[0])
			const allowed = fileReader.result
			setImage(URL.createObjectURL(files[1]))
		}
	}
	function getProof(leaves) {
		const leafsUint8 = leaves.map((e) => {
			return Buffer.from(e.data)
		})
		console.log(leafsUint8)
		const tree = new MerkleTree(leafsUint8, keccak256, { sortPairs: true })
		const root = tree.getHexRoot()
		console.log("Root- " + root)
		if (isConnected) {
			const addressHash = keccak256(address)
			const proof = tree.getHexProof(addressHash)
			const eligible = tree.verify(proof, addressHash, props.root)
			console.log(proof)
			console.log(eligible)
			setProof(proof)
			setEligibility(eligible)
		}
	}
	useEffect(() => {
		getAllowed()
	}, [isConnected])
	return (
		<div className="w-64 h-96 mx-28 mt-44 mb-14 bg-[white] drop-shadow-xl rounded-lg py-7">
			<Center>
				<h2 className="mb-14">{props.name}</h2>
			</Center>
			<Center>
				{image ? (
					<Image src={image} boxSize="150px" borderRadius="full" />
				) : (
					<Image src="/Logo.png" boxSize="150px" borderRadius="full" />
				)}
			</Center>
			<Center>
				<Button
					onClick={onOpen}
					bg="#d08290"
					color="#f7efe8"
					_hover={{ opacity: 0.77 }}
					className="my-10"
					px="1.5rem"
				>
					Claim
				</Button>
			</Center>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>{props.name}</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<div className="flex w-4/5">
							<h3 className="mx-2 rounded-lg bg-[#e88775] opacity-75 p-2">
								{props.type}
							</h3>
							{eligiblity ? (
								<h3 className="mx-2 rounded-lg bg-[green] text-[white] opacity-75 p-2">
									Eligible
								</h3>
							) : (
								<h3 className="mx-2 rounded-lg bg-[#b92025] text-[white] opacity-75 p-2">
									Not Eligible
								</h3>
							)}
						</div>
						<Center>
						{image ? (
								<Image src={image} boxSize="150px" borderRadius="full"  className="my-10"/>
							) : (
								<Image src="/Logo.png" boxSize="150px" borderRadius="full" className="my-10"/>
							)}
						</Center>
						<h3 className="my-5">Issuer- {props.issuer}</h3>
						<Center>
							<MintButton
								contractAddress={props.id}
								proof={proof}
								disable={eligiblity}
								toast={props.toast}
							/>
						</Center>
					</ModalBody>
				</ModalContent>
			</Modal>
		</div>
	)
}
