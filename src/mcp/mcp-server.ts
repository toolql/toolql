import { QLTool } from "../toolql"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { paramTypes } from "../util/param-types"

export const mcpServer = (name: string, tools: QLTool[]): McpServer => {
  // Create an MCP server
  const server = new McpServer({
    name,
    // TODO: Handle MCP versioning in the broader context of tool versioning
    version: "1.0.0"
  })

  for (const tool of tools) {
    const params = paramTypes(tool.params)
    const fn: (args: any) => any = async (vars: any) => {
      const response = await tool.fn(vars)
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response)
          }
        ]
      }
    }
    server.tool(tool.name, tool.description, params, fn)
  }

  return server
}
