import express from "express"
import cors from "cors"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js"

export const serve = (mcpServer: McpServer) => {
  const transports: Record<string, SSEServerTransport> = {}

  const app = express()
  app.use(cors())

  app.get("/", (req, res) => {
    res.status(200).send("ToolQL MCP Server running")
  })

  app.get("/sse", async (req, res) => {
    const transport = new SSEServerTransport("/messages", res)
    transports[transport.sessionId] = transport

    res.on("close", () => {
      delete transports[transport.sessionId]
    })

    await mcpServer.connect(transport)
  })

  app.post("/messages", async (req, res) => {
    const sessionId = req.query.sessionId as string
    if (!sessionId) {
      res.status(400).json({ error: "Missing sessionId" })
      return
    }
    const transport = transports[sessionId]
    if (!transport) {
      res.status(400).json({
        error: `Missing transport for sessionId ${sessionId}`
      })
    } else {
      await transport.handlePostMessage(req, res)
    }
  })

  app.listen(3002)
}
