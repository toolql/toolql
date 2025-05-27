import { QLTool } from "./toolql"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"

export const mcpServer = (name: string, tools: QLTool[]): McpServer => {
  // Create an MCP server
  const server = new McpServer({
    name,
    // TODO: Handle MCP versioning in the broader context of tool and API versioning
    version: "1.0.0"
  })

  for (const tool of tools) {
    server.tool(tool.name, tool.description, tool.fn)
  }

  return server
}
