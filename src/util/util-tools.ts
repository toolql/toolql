import { QLTool } from "../toolql"

export const currentDateTime: QLTool = {
  name: "currentDateTime",
  description: "Get the current date and time",
  fn: () => new Date().toDateString()
}
