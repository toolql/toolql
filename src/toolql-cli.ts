import "dotenv/config"
import { createInterface } from "node:readline"
import { exit, stdin, stdout } from "node:process"
import { getLlm } from "./llm/get-llm"
import { HumanMessage } from "@langchain/core/messages"
import { readFileSync } from "fs"
import { QLTool, toolkit } from "./toolql"
import { Api } from "./graphql/graphqlex"
import { langchainAgent } from "./langchain/langchain-agent"

export const main = () => {
  // Initialise GraphQL tools
  const toolsGql = readFileSync("./tools.graphql", "utf8")
  const url = process.env.GRAPHQL_API
  const headers: any = {}
  if (process.env.GRAPHQL_BEARER) {
    headers.Authorization = `Bearer ${process.env.GRAPHQL_BEARER}`
  }
  const api = new Api(url, { headers })
  const qlTools: QLTool[] = toolkit(toolsGql, api)

  // Initialise Agent
  const llm = getLlm()
  const agent = langchainAgent(qlTools, llm)
  const thread_id = crypto.randomUUID()

  const rl = createInterface({
    input: stdin,
    output: stdout,
    prompt: "- "
  })

  const message =
    process.env.TOOLQL_AGENT_MESSAGE || "Hi there, how can I help?"
  console.log(message)
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
