import { BaseChatModelParams } from "@langchain/core/dist/language_models/chat_models"
import { ChatOpenAI } from "@langchain/openai"

export type LlmParams = BaseChatModelParams

export const MISSING_API_KEY_ERROR =
  "OpenAI API key missing, please set OPENAI_API_KEY"

// TODO: Extends to support other parameterised models
export const getLlm = () => {
  const openAiApiKey = process.env.OPENAI_API_KEY
  if (!openAiApiKey) throw new Error(MISSING_API_KEY_ERROR)

  const model = new ChatOpenAI({
    model: "gpt-4o",
    temperature: 0.6
  })

  return model
}
