import { useToast } from "@chakra-ui/react"
import Footer from "../components/Footer"
import Header from "../components/Header"
import RepForm from "../components/RepForm"

export default function IssueRep() {
	const toast = useToast()
	return (
		<div className="">
			<Header />
			<div className="bg-[url('/post_common.png')] pt-10">
				<div className="ml-20 left-7 w-1/2 ">
					<RepForm size={"100%"} name={"Reputation"} abb={"Reputation"} toast={toast} />
				</div>
			</div>
			<Footer />
		</div>
	)
}
