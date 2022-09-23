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
import MintButton from "./MintButton"

export default function Panel(props) {
	const { isOpen, onOpen, onClose } = useDisclosure()
	let url
	if (props.uri.startsWith("ipfs://")) {
		url = props.uri.replace("ipfs://", "https://cloudflare-ipfs.com/ipfs/")
	}

	function openModal() {}
	return (
		<div className="w-64 h-96 mx-14 mb-44 bg-[white] drop-shadow-xl rounded-lg py-7">
			<Center>
				<h2 className="mb-14">{props.name}</h2>
			</Center>
			<Center>
				<Image src={url} boxSize="150px" borderRadius="full" />
			</Center>
			<Center>
				<Button
					onClick={onOpen}
					bg="#f7efe8"
					color="#7d769b"
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
						<h3>Type- {props.type}</h3>
						<Center>
							<Image src={url} boxSize="150px" borderRadius="full" className="my-10"/>
						</Center>
                        <h3>Issuer- {props.issuer}</h3>
                        <MintButton contractAddress={props.id}/>
					</ModalBody>
				</ModalContent>
			</Modal>
		</div>
	)
}
