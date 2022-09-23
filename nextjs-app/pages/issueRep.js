import Footer from "../components/Footer"
import Header from "../components/Header"
import RepForm from "../components/RepForm"

export default function IssueSbt() {
	return (
		<div className="">
			<Header />
			<div className="bg-[url('/post_common.png')] pt-10">
				<div className="ml-20 left-7 w-1/2 ">
					<RepForm size={"100%"} name={"Reputation"} abb={"Reputation"} />
				</div>
			</div>
			<Footer />
		</div>
	)
}
