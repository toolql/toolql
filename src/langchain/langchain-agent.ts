import { DynamicStructuredTool } from "@langchain/core/tools"
import z from "zod"
import { QLTool } from "../toolql"
import { BaseChatModel } from "@langchain/core/dist/language_models/chat_models"
import { MemorySaver } from "@langchain/langgraph"
import { dedent } from "ts-dedent"
import { createReactAgent } from "@langchain/langgraph/prebuilt"

export const langChainTool = (tool: QLTool): DynamicStructuredTool => {
  return new DynamicStructuredTool({
    name: tool.name,
    description: tool.description,
    schema: z.object(
      (tool.params || []).reduce(
        (o, p) => ({
          ...o,
          [p.name]: p.type.describe(p.description)
        }),
        {}
      )
    ),
    func: tool.fn
  })
}

export const langchainAgent = (tools: QLTool[], llm: BaseChatModel) => {
  const checkpointSaver = new MemorySaver()
  // prettier-ignore
  const prompt = dedent(process.env.TOOLQL_AGENT_PROMPT || `
    You are an agent provided with tools for working with data and operations.
    Answer questions using your provided tools wherever appropriate, rather than your general knowledge.
    Politely avoid answering questions that are not related to your provided tools.
  `)
  const agent = createReactAgent({
    llm,
    tools: tools.map(langChainTool),
    checkpointSaver,
    prompt
  })
  return agent
}
