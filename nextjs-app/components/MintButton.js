import { Button } from "@chakra-ui/react"
import { useContractWrite, usePrepareContractWrite } from "wagmi"
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
		useContractWrite(config)

	function mintSbt() {
		console.log("Starting mint.....")
		console.log(props.proof)
		console.log(error)
		console.log(isError)
		console.log(config)
		write()
		console.log("Minted SBT!!!!!!!!")
		console.log(data?.hash)
	}
	return (
		<Button
			disabled={!write}
			onClick={mintSbt}
			bg="#7d769b"
			color="#f7efe8"
			_hover={{ opacity: 0.77 }}
		>
			Claim SBT!
		</Button>
	)
}
