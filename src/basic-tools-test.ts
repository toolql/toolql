import { currentDateTime } from "./basic-tools"
import { langChainTool } from "./toolql"
import { expect } from "chai"

describe("Basic tools", () => {
  it("Should be able to determine the current time", async () => {
    const result = await langChainTool(currentDateTime).invoke({})
    expect(result).to.be.a("string")
  })
})
