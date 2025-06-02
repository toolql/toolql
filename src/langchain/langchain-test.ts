import { DynamicStructuredTool } from "@langchain/core/tools"
import { z } from "zod"
import { expect } from "chai"

describe("LangChain Tool Definition", () => {
  const toolFn = async ({ a, b }: { a: number; b: number }) =>
    (a + b).toString()
  const toolDesc = "Add two numbers together"

  it("Can be a DST defined with a Zod schema", async () => {
    const dstTool = new DynamicStructuredTool({
      name: "DST tool with Zod schema",
      description: toolDesc,
      schema: z.object({
        a: z.number().describe("the first number to add"),
        b: z.number().describe("the second number to add")
      }),
      func: toolFn
    })
    const result = await dstTool.invoke({ a: 4, b: 7 })
    expect(result).to.equal("11")
  })
})
