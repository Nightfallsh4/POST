import { DropCreated as DropCreatedEvent } from "../generated/Token/Token"
import { Transfer as TransferEvent } from "../generated/templates/Soulbound/Soulbound"
import { Collection, Token, User } from "../generated/schema"
import { Soulbound as SoulboundContract } from "../generated/templates"

export function handleDropCreated(event: DropCreatedEvent): void {
	let entity = new Collection(
		event.transaction.hash.toHex() + "-" + event.logIndex.toString(),
	)
	entity.type = event.params.dropType
	entity.address = event.params.dropAddress
	entity.save()
	SoulboundContract.create(event.params.dropAddress)
}

export function handleTransfer(event: TransferEvent): void {
	let entity = new Token(event.params.tokenId.toString())
	entity.address = event.address
	entity.tokenId = event.params.tokenId
	entity.owner = event.params.to.toString()
	entity.save()

	let user = User.load(event.params.to.toString())
	if (!user) {
		user = new User(event.params.to.toString())
		user.save() //j
	}
}
