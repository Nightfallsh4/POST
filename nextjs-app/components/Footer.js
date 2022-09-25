import { Image, Link } from "@chakra-ui/react"

export default function Footer() {
	return (
		<div className="bg-[#d08290] bottom-0 min-h-10">
			<div className="flex p-4 items-center">
				<Image src="/Logo.png" boxSize="100px" borderRadius="full"></Image>
				<div className="ml-20 text-[#f7efe8]">
					<div className="mt-5">
						<Link href="/" className="hover:text-[#3d485b]">Home</Link>
					</div>
                    <div className="mt-5">
						<Link href="/issue" className="hover:text-[#3d485b]">Issue</Link>
					</div>
                    <div className="mt-5">
						<Link href="/mySbts" className="hover:text-[#3d485b]">My SBT</Link>
					</div>
				</div>
                <div className="ml-40 text-[#f7efe8]">
					<div className="mt-5">
						<Link href="/issue" className="hover:text-[#3d485b]">Soulbound Tokens</Link>
					</div>
                    <div className="mt-5">
						<Link href="/issueRep" className="hover:text-[#3d485b]">Reputation SBTs</Link>
					</div>
                    <div className="mt-5">
						<Link href="/issueAttest" className="hover:text-[#3d485b]">Attestation SBTs</Link>
					</div>
				</div>
                <div className="ml-40 text-[#f7efe8]">
					<div className="mt-5">
						<Link href="/" className="hover:text-[#3d485b]">About Us</Link>
					</div>
					<div className="mt-5">
						<Link href="/find" className="hover:text-[#3d485b]">View</Link>
					</div>
                    <div className="mt-5">
						<Link href="/" className="hover:text-[#3d485b]">Github</Link>
					</div>
				</div>
                
			</div>
		</div>
	)
}
