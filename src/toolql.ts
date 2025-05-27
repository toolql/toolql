import {
  type DocumentNode,
  type OperationDefinitionNode,
  parse,
  Token,
  Location
} from "graphql/language"
import z from "zod"
import { DynamicStructuredTool } from "@langchain/core/tools"
import { Api } from "./graphqlex"

/**
 * ToolQL's tool data structure, convertible to structures for various
 * A.I. agent environments such as LangChain, MCP, etc.
 */
export type QLTool = {
  name: string
  description: string
  params: QLToolParam[]
  graphql: string
  fragmentNames: string[]
  fn?: (...args: any[]) => any
}

export type QLFragment = {
  name: string
  graphql: string
  fragmentNames: string[]
}

export type QLToolParam = {
  name: string
  description: string
  // TODO: Establish type structure
  type: any
}

// Inspired by prettier approach:
// https://github.com/prettier/prettier/blob/4e46f92b8648c7f25de62bfaf4368aa3f2e588d9/src/language-graphql/parser-graphql.js#L6
const parseComments = (ast: DocumentNode) => {
  const comments: Token[] = []
  const startToken = ast.loc?.startToken
  let next = startToken?.next
  while (next?.kind !== "<EOF>") {
    if (next?.kind === "Comment") {
      Object.assign(next, {
        // The Comment token's column starts _after_ the `#`,
        // but we need to make sure the node captures the `#`
        column: next.column - 1
      })
      comments.push(next)
    }
    next = next?.next
  }

  return comments
}

export const toolkit = (graphql: string, api: Api): QLTool[] => {
  const doc: DocumentNode = parse(graphql)

  // The resulting tool kit
  const tools: QLTool[] = []

  const comments = parseComments(doc)
  // Obtain the comment for the definition at the given location
  const getComment = (loc: Location) =>
    comments.find((c) => c.next === loc.startToken)?.value || ""

  // A name-keyed map of fragments
  const fragments: Record<string, QLFragment> = {}

  // Given a list of depended-upon fragment names, return it along with all nested dependencies
  const allFragmentNames = (names: string[]) =>
    Array.from(
      new Set(
        names.concat(
          names.map((n) => allFragmentNames(fragments[n].fragmentNames))
        )
      )
    )

  const fragmentsGraphQL = (names: string[]) =>
    allFragmentNames(names)
      .map((n) => fragments[n].graphql)
      .join("\n\n")

  for (const def of doc.definitions) {
    const { start, end } = def.loc
    const graphql = def.loc.source.body.slice(start, end)
    console.log(graphql)
    if (def.kind === "FragmentDefinition") {
      const name = def.name.value
      fragments[name] = {
        name,
        graphql,
        // TODO: Parse nested fragment names
        fragmentNames: []
      }
    } else if (def.kind === "OperationDefinition") {
      // Find and store the related comment
      const op = def as OperationDefinitionNode
      const description = getComment(op.loc)

      const tool: QLTool = {
        name: def.name.value,
        description,
        params: [],
        // TODO: Parse fragment names
        fragmentNames: [],
        graphql
      }

      for (const varDef of def.variableDefinitions) {
        const name = varDef.variable.name.value
        const description = getComment(varDef.loc)
        tool.params.push({
          name,
          description,
          // TODO: Get type and assign appropriately
          type: z.string()
        })
      }

      tools.push(tool)
    }
  }

  for (const tool of tools) {
    tool.graphql = [fragmentsGraphQL(tool.fragmentNames), tool.graphql].join(
      "\n\n"
    )
    tool.fn = async (vars: any) => {
      const response = await api.run(tool.graphql, vars)
      return response.data
    }
  }

  return tools
}

export const langChainTool = (tool: QLTool): DynamicStructuredTool => {
  return new DynamicStructuredTool({
    name: tool.name,
    description: tool.description,
    schema: z.object(
      tool.params.reduce((o, i) => ({ ...o, [i.name]: i.type }), {})
    ),
    func: tool.fn
  })
}

export const mcpTool = (qlTool: QLTool) => {
  console.log(qlTool)
  return {}
}
