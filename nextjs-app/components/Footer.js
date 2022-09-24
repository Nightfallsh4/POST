import { Image, Link } from "@chakra-ui/react"

export default function Footer() {
	return (
		<div className="bg-[#d08290] bottom-0 min-h-10">
			<div className="flex p-4 items-center">
				<Image src="/Logo.png" boxSize="100px" borderRadius="full"></Image>
				<div className="ml-20 text-[#f7efe8]">
					<div className="mt-5">
						<Link src="/">Home</Link>
					</div>
                    <div className="mt-5">
						<Link src="/issue">Issue</Link>
					</div>
                    <div className="mt-5">
						<Link src="/">My SBT</Link>
					</div>
				</div>
                <div className="ml-40 text-[#f7efe8]">
					<div className="mt-5">
						<Link src="/">Soulbound Tokens</Link>
					</div>
                    <div className="mt-5">
						<Link src="/issue">Reputation SBTs</Link>
					</div>
                    <div className="mt-5">
						<Link src="/">Attestation SBTs</Link>
					</div>
				</div>
                <div className="ml-40 text-[#f7efe8]">
					<div className="mt-5">
						<Link src="/">About Us</Link>
					</div>
                    <div className="mt-5">
						<Link src="/">Github</Link>
					</div>
				</div>
                
			</div>
		</div>
	)
}
