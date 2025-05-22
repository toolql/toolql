import "dotenv/config"
import { createInterface } from "node:readline"
import { exit, stdin, stdout } from "node:process"
import { StructuredTool } from "@langchain/core/tools"
import { getLlm } from "./get-llm"
import { MemorySaver } from "@langchain/langgraph"
import { createReactAgent } from "@langchain/langgraph/prebuilt"
import { HumanMessage } from "@langchain/core/messages"

export const main = () => {
  const openAiApiKey = process.env.OPENAI_API_KEY
  if (!openAiApiKey)
    throw new Error("OpenAI API key missing, please set OPENAI_API_KEY")

  // TODO: Initialise GraphQL tools
  const tools: StructuredTool[] = []
  const llm = getLlm()
  const checkpointSaver = new MemorySaver()
  const agent = createReactAgent({ llm, tools, checkpointSaver })
  const thread_id = crypto.randomUUID()

  const rl = createInterface({
    input: stdin,
    output: stdout,
    prompt: "- "
  })

  console.log("Hi there, how can I help?")
  rl.prompt()

  rl.on("line", async (line) => {
    const result = await agent.invoke(
      { messages: [new HumanMessage(line)] },
      { configurable: { thread_id } }
    )
    const answer = result.messages[result.messages.length - 1].content
    console.log(answer)

    rl.prompt()
  }).on("close", () => {
    console.log("")
    console.log("Thanks, see you soon!")
    console.log(
      "For all your GraphQL / A.I. integration needs visit https://toolql.com"
    )
    exit(0)
  })
}

main()
