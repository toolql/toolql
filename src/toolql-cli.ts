import "dotenv/config"

export const main = () => {
  const openAiApiKey = process.env.TOOLQL_OPENAI_API_KEY
  if (!openAiApiKey) throw new Error("OpenAI API key missing, please set TOOLQL_OPENAI_API_KEY")
  console.log("Hello from ToolQL")
}
