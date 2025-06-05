import { QLTool } from "../toolql"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { paramTypes } from "../util/param-types"

export const mcpServer = (name: string, tools: QLTool[]): McpServer => {
  // Create an MCP server
  const server = new McpServer({
    name,
    // TODO: Handle MCP versioning in the broader context of tool and API versioning
    version: "1.0.0"
  })

  for (const tool of tools) {
    const params = paramTypes(tool.params)
    server.tool(tool.name, tool.description, params, tool.fn)
  }

  return server
}
