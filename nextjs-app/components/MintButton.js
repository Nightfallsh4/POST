import { Button, Link, position } from "@chakra-ui/react"
import {
	useContractWrite,
	usePrepareContractWrite,
	useWaitForTransaction,
} from "wagmi"
import addressJson from "../deployedAddress/address.json"

export default function MintButton(props) {
	const { config } = usePrepareContractWrite({
		addressOrName: props.contractAddress,
		contractInterface: addressJson.soulbound.abi,
		functionName: "mint",
		args: [props.proof],
		// enabled:false,
		// overrides: { value: parseEther("0.0001") },
	})

	const { data, isLoading, isSuccess, write, error, isError } =
		useContractWrite({
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
			console.log(data);
		},
	})

	async function mintSbt() {
		console.log("Starting mint.....")
		console.log(props.proof)
		console.log(error)
		console.log(isError)
		console.log(config)
		await write()

		console.log("Minted SBT!!!!!!!!")
		// console.log(data?.hash)
	}
	return (
		<Button
			disabled={!write && !props.disable}
			onClick={mintSbt}
			bg="#7d769b"
			color="#f7efe8"
			_hover={{ opacity: 0.77 }}
			className="my-10"
		>
			Claim SBT!
		</Button>
	)
}
