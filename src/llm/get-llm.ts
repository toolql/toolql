import {
  BaseChatModel,
  BaseChatModelParams
} from "@langchain/core/dist/language_models/chat_models"
import { ChatOpenAI } from "@langchain/openai"

export type LlmParams = BaseChatModelParams

export const MISSING_API_KEY_ERROR =
  "OpenAI API key missing, please set OPENAI_API_KEY"

/**
 * Obtain an LLM for sample agents.
 * When using the LangChain API this can be replaced with any LangChain supported LLM.
 * When using MCP, LLM is specified by the MCP consuming agent.
 *
 * TODO: Extend to support other providers and models.
 */
export const getLlm = (): BaseChatModel => {
  const openAiApiKey = process.env.OPENAI_API_KEY
  if (!openAiApiKey) throw new Error(MISSING_API_KEY_ERROR)

  const model = new ChatOpenAI({
    model: "gpt-4o",
    temperature: 0.6
  })

  return model
}
