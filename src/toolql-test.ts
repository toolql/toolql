import { expect } from "chai"
import { getLlm, MISSING_API_KEY_ERROR } from "./llm/get-llm"
import { configDotenv } from "dotenv"
import { readFile } from "node:fs/promises"
import { Api } from "./graphql/graphqlex"
import { toolkit } from "./toolql"

describe("ToolQL Test", async () => {
  const myApi = new Api("https://example.com/graphql")
  const githubGql = await readFile("examples/github/tools.graphql", {
    encoding: "utf8"
  })

  it("should perform a basic test", () => {
    expect(1 + 1).to.equal(2)
  })

  describe("LLM provisioning", () => {
    it("should fail without an API key", () => {
      expect(process.env.OPENAI_API_KEY).to.equal(undefined)
      expect(() => getLlm()).to.throw(MISSING_API_KEY_ERROR)
    })

    it("should obtain an LLM when an API key is present", () => {
      configDotenv()
      expect(process.env.OPENAI_API_KEY).to.not.equal(undefined)
      expect(() => getLlm()).to.not.throw()
    })
  })

  describe("Toolkits", () => {
    const tools = toolkit(githubGql, myApi)

    it("should have 5 tools", async () => {
      expect(tools.length).to.equal(5)
    })

    describe("Tool instructions", () => {
      it("should match the associated graphql comment", () => {
        const tool = tools.find((t) => t.name === "repoSearch")
        expect(tool.description).to.equal(
          "Find repositories that match a given search term"
        )
      })

      it("should capture multi-line-comments", () => {
        const tool = tools.find((t) => t.name === "weeklyCommits")
        const lines = tool.description.split("\n")
        expect(lines.length).to.equal(2)
        expect(lines[0]).to.match(/^Get information/)
        expect(lines[1]).to.match(/^The resulting commit/)
      })
    })
  })
})
