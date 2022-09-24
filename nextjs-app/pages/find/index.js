import Header from "../../components/Header"
import Footer from "../../components/Footer"
import { Button, Center, Image, Input } from "@chakra-ui/react"
import { useState } from "react"
import { useRouter } from "next/router"

export default function find() {
	const [address, setAddress] = useState("")
	const router = useRouter()
	const handleClick = (e) => {router.push(`/find/${address}`)}
	return (
		<div className="bg-[url('/find.png')]">
			<Header />
			<Center>
				<div className="my-24">
					<div className="mx-20">
						<Image src="/Logo.png" boxSize="400px" borderRadius="full" />
					</div>
					<Input
						className="my-12 drop-shadow-2xl w-1/2"
						value={address}
						onChange={(event) => setAddress(event.target.value)}
						variant="filled"
						placeholder="Enter Address"
						size="lg"
						bgColor="rgba(247, 239, 232, 0.77)"
						_placeholder={{ color: "#d08290", opacity: 0.5 }}
						focusBorderColor="#d08290"
					/>
					<Center>
						<Button
							onClick={handleClick}
							bg="#7d769b"
							color="#f7efe8"
							_hover={{ opacity: 0.77 }}
							className="ml-7"
							px="1.5rem"
						>
							Search
						</Button>
					</Center>
				</div>
			</Center>
			<Footer />
		</div>
	)
}
