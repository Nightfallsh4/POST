import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address } from "@graphprotocol/graph-ts"
import { DropCreated } from "../generated/schema"
import { DropCreated as DropCreatedEvent } from "../generated/Token/Token"
import { handleDropCreated } from "../src/token"
import { createDropCreatedEvent } from "./token-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let dropType = "Example string value"
    let dropAddress = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let newDropCreatedEvent = createDropCreatedEvent(dropType, dropAddress)
    handleDropCreated(newDropCreatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("DropCreated created and stored", () => {
    assert.entityCount("DropCreated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "DropCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "dropType",
      "Example string value"
    )
    assert.fieldEquals(
      "DropCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "dropAddress",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
