import "dotenv/config"
import { createInterface } from "node:readline"
import { exit, stdin, stdout } from "node:process"
import { getLlm } from "./llm/get-llm"
import { HumanMessage } from "@langchain/core/messages"
import { readFileSync, existsSync } from "fs"
import { QLTool, toolkit } from "./toolql"
import { Api } from "./graphql/graphqlex"
import { langchainAgent } from "./langchain/langchain-agent"
import { mcpServer } from "./mcp/mcp-server"
import { serve } from "./mcp/sse-server"
import { configDotenv } from "dotenv"
import { resolve, join } from "node:path"
import { copyFileSync } from "node:fs"
import { dedent } from "ts-dedent"

export const main = () => {
  const cwd = process.cwd()

  // If running an example, change the working directory and load nested environment vars
  const exIndex = process.argv.indexOf("-ex")
  if (exIndex >= 0) {
    const thisDir = import.meta.dirname
    const example = process.argv[exIndex + 1]
    const exampleDir = resolve(thisDir, "../examples", example)

    // Check for a valid example name
    if (!existsSync(exampleDir)) {
      return console.error(dedent`
        Invalid toolql example: "${example}".
        Please choose a valid example directory in the toolql repository. 
      `)
    }

    const exampleEnvFile = resolve(exampleDir, ".env.template")

    // Find environment variables that need to be configured for the example
    const templateEnv = readFileSync(exampleEnvFile, "utf8")
    const templateEnvDecs = templateEnv.match(/^# (\w+)=/gm)
    const templateEnvVars = templateEnvDecs?.map((s) => s.slice(2, -1)) || []

    // Load environment variables
    configDotenv({
      path: [
        exampleEnvFile, // Load the default configuration for the example
        resolve(exampleDir, ".env"), // Facilitate toolql development with example level overrides
        resolve(cwd, ".env") // Working dir overrides everything
      ]
    })

    // Check whether all necessary variables configured
    const missingVars = templateEnvVars.filter((envVar) => !process.env[envVar])
    if (missingVars.length) {
      if (!existsSync(join(cwd, ".env"))) {
        // Create a local .env file and exit with a prompt to configure
        copyFileSync(resolve(exampleDir, ".env.template"), ".env")
        console.log(dedent`
          Initialised .env file in ${resolve(cwd)}
          Please read and configure values.
          file://${resolve(".env")}
        `)
        return
      } else {
        return console.log(dedent`
          Missing required environment variables.
          Try again in an empty directory to generate a sample .env file.
        `)
      }
    }
  }

  // Initialise GraphQL tools
  const toolsGql = readFileSync(resolve(cwd, "tools.graphql"), "utf8")
  const url = process.env.GRAPHQL_API
  const headers: any = {}
  if (process.env.GRAPHQL_BEARER) {
    headers.Authorization = `Bearer ${process.env.GRAPHQL_BEARER}`
  }
  const api = new Api(url, { headers })
  const qlTools: QLTool[] = toolkit(toolsGql, api)
  const port = parseInt(process.env.MCP_PORT || "0")

  if (port) {
    // Initialise MCP Server
    const server = mcpServer("ToolQL MCP Server", qlTools)
    serve(server, port)
  } else {
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
        "For all your GraphQL / AI integration needs visit https://toolql.com"
      )
      exit(0)
    })
  }
}

main()
