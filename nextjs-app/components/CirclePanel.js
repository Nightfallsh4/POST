import {
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
import { useEffect, useState } from "react"
import { useAccount } from "wagmi"
import { Web3Storage } from "web3.storage"

export default function CirclePanel(props) {
	const { isOpen, onOpen, onClose } = useDisclosure()
	const { isConnected } = useAccount()
	const [image, setImage] = useState()
	async function getImage() {
		const token = process.env.NEXT_PUBLIC_WEB3_STORAGE
		const web3Client = new Web3Storage({ token: token })
		const res = await web3Client
			.get(props.uri.replace("ipfs://", ""))
			.catch((e) => {
				console.log(e)
			})
		if (!res.ok) {
			console.log("cant find the specified res")
		} else {
			console.log(res)
			const files = await res.files()
			console.log(files[1])
			setImage(URL.createObjectURL(files[1]))
		}
	}
	useEffect(() => {
		getImage()
	}, [isConnected])
	return (
		<div className="w-64 my-20">
			<div onClick={onOpen}>
				<Link>
					<Center>
						{image ? (
							<Image src={image} boxSize="150px" borderRadius="full" />
						) : (
							<Image src="/Logo.png" boxSize="150px" borderRadius="full" />
						)}
					</Center>
					<Center>
						<h2 className="my-7">{props.name}</h2>
					</Center>
				</Link>
			</div>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>{props.name}</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<div className="flex w-3/5">
							<h3 className="mx-2 rounded-lg bg-[#e88775] opacity-75 p-2">
								{props.type}
							</h3>
						</div>
						<Center>
							{image ? (
								<Image src={image} boxSize="150px" borderRadius="full" />
							) : (
								<Image src="/Logo.png" boxSize="150px" borderRadius="full" />
							)}
						</Center>
						<h3>Token Id:- {props.tokenId}</h3>
						<h3>Address:- {props.address}</h3>
						<h3>Issuer:- {props.issuer}</h3>
						<h3>Uri:- {props.uri}</h3>
					</ModalBody>
				</ModalContent>
			</Modal>
		</div>
	)
}
