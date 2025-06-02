import { currentDateTime } from "./util-tools"
import { expect } from "chai"
import { langChainTool } from "../langchain/langchain-agent"

describe("Basic tools", () => {
  it("Should be able to determine the current time", async () => {
    const result = await langChainTool(currentDateTime).invoke({})
    expect(result).to.be.a("string")
  })
})
