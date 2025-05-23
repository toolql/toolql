import "dotenv/config"
import { createInterface } from "node:readline"
import { exit, stdin, stdout } from "node:process"
import { StructuredTool } from "@langchain/core/tools"
import { getLlm } from "./get-llm"
import { MemorySaver } from "@langchain/langgraph"
import { createReactAgent } from "@langchain/langgraph/prebuilt"
import { HumanMessage } from "@langchain/core/messages"
import dedent from "ts-dedent"

export const main = () => {
  // TODO: Initialise GraphQL tools
  const tools: StructuredTool[] = []
  const llm = getLlm()
  const checkpointSaver = new MemorySaver()
  // prettier-ignore
  const prompt = dedent(process.env.TOOLQL_AGENT_PROMPT || `
    You are an agent provided with tools for working with data and operations.
    Answer questions using your provided tools wherever appropriate, rather than your general knowledge.
    Politely avoid answering questions that are not related to your provided tools.
  `)
  const agent = createReactAgent({ llm, tools, checkpointSaver, prompt })
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
    // Tried the following for streaming without success
    // for await (const chunk of result) {
    //   process.stdout.write(chunk.toString())
    // }
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
