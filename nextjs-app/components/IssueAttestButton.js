import { Button, Link } from "@chakra-ui/react"
import { parseEther } from "ethers/lib/utils"
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi"
import addressJson from "../deployedAddress/address.json"
import { Web3Storage } from "web3.storage"
import { useState } from "react"

export default function IssueAttestButton(props) {
	const [uri, setUri] = useState("")

	const { config } = usePrepareContractWrite({
		addressOrName: "0x3e646aCfDaa901239A72f86a79bf1aE93B2596ee",
		contractInterface: addressJson.postFactory.abi,
		functionName: "createSoulboundAttestationToken",
		args: [props.name, props.symbol, "1", uri, props.root, props.mintLimit, 0],
		overrides: { value: parseEther("0.001") },
	})
	const { data, write } = useContractWrite({
		...config,
		onSuccess(data) {
			props.toast({
				title: "Transaction Sent!",
				description: (
					<Link href={`https://goerli.etherscan.io/tx/${data?.hash}`}>
						View Transaction
					</Link>
				),
				status: "info",
				duration: 10000,
				isClosable: true,
				position: "top-right",
			})
		},
	})

	const waitFortransaction = useWaitForTransaction({
		hash: data?.hash,
		onSuccess(data) {
			props.toast({
				title: "Transaction Successful!",
				description: (
					<Link href={`https://goerli.etherscan.io/tx/${data.transactionHash}`}>
						View Transaction
					</Link>
				),
				status: "success",
				duration: 10000,
				isClosable: true,
				position: "top-right",
			})
			console.log(data)
		},
	})
	async function uploadToIpfs() {
		const token = process.env.NEXT_PUBLIC_WEB3_STORAGE
		const web3Client = new Web3Storage({ token: token })
		const obj = { allowed: props.leaves }
		const leafBlob = new Blob([JSON.stringify(obj)], {
			type: "application/json",
		})
		const cid = await web3Client.put([
			new File([props.selectedFile], "image.jpg"),
			new File([leafBlob], "allowed.json"),
		])
		setUri("ipfs://" + cid)
		console.log(cid);
	}
	async function issueToken() {
		console.log(typeof props.selectedFile)
		uploadToIpfs()
		await write?.()
	}
	return (
		<div>
			<Button
				disabled={!(props.root && props.selectedFile)}
				onClick={issueToken}
				bg="#7d769b"
				color="#f7efe8"
				_hover={{ opacity: 0.77 }}
				className="mt-10"
			>
				Issue {props.formName} Token
			</Button>
		</div>
	)
}
