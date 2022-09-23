import Footer from "../components/Footer"
import Header from "../components/Header"
import SbtForm from "../components/SbtForm"

export default function IssueSbt() {
	return (
		<div className="">
			<Header />
			<div className="ml-20 bg-[#f7efe8] left-7 w-1/2">
				<SbtForm size={"100%"} name={"Soulbound"} abb={"SBT"} />
			</div>
			<Footer/>
		</div>
	)
}
