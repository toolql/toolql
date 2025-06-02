import { expect } from "chai"
import { getLlm, MISSING_API_KEY_ERROR } from "./llm/get-llm"
import { configDotenv } from "dotenv"

describe("ToolQL Test", () => {
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
})
