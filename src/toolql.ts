import {
  type DocumentNode,
  Location,
  NameNode,
  type OperationDefinitionNode,
  parse,
  Token,
  TypeNode
} from "graphql/language"
import z from "zod"
import { Api, GraphQLResponseCondition } from "./graphql/graphqlex"
import { dedent } from "ts-dedent"

/**
 * Structure for GraphQL-based tools,
 * convertible for use within various A.I. agent environments,
 * such as LangChain, MCP, etc.
 */
export type QLTool = {
  /**
   * Tool name, matching GraphQL operation source name.
   */
  name: string

  /**
   * Tool usage description, parsed from GraphQL source comment.
   */
  description: string

  /**
   * Tool call parameters.
   */
  params?: QLToolParam[]

  /**
   * GraphQL operation source.
   */
  graphql?: string

  /**
   * Names of referenced fragments.
   */
  fragmentNames?: string[]

  /**
   * Tool action function.
   */
  fn?: (args: any, context?: any) => any

  /**
   * Tool version for MCP. Defaults to 1.0.0.
   */
  version?: string
}

export type QLFragment = {
  /**
   * Name of fragment in GraphQL source.
   */
  name: string

  /**
   * GraphQL fragment source.
   */
  graphql: string

  /**
   * Names of other fragments referenced from this one.
   */
  fragmentNames: string[]
}

export type QLToolParam = {
  /**
   * Name of the parameter, defined in GraphQL source.
   */
  name: string

  /**
   * Description, parsed from comment in GraphQL source.
   */
  description: string

  /**
   * GraphQL type name.
   */
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

// Get the Zod type of the underlying primitive type
// Initially supports only vars of type string, number or boolean - see TODOs
const getZodType = (node: { type?: TypeNode; name?: NameNode }) => {
  // TODO: Handle list types and nullability
  while (node.type) {
    node = node.type
  }
  const name = node.name.value
  if (name.match(/(string|id)/i)) {
    return z.string()
  } else if (name.match(/(float|int)/i)) {
    return z.number()
  } else if (name.match(/(boolean)/i)) {
    return z.boolean()
  } else if (name.match(/datetime/i)) {
    // TODO: Should be changed to z.iso.datetime() once we can properly import Zod V4
    return z.string()
  } else {
    // TODO: Support object types
    throw new Error(dedent`
      Unsupported type "${name}".
      Please refactor tools with parameters of type String, ID, Float, Int or Boolean.
    `)
  }
}

/**
 * Obtain a collection of tools for the given GraphQL source,
 * connected to the given API.
 */
export const toolkit = (graphql: string, api: Api): QLTool[] => {
  const doc: DocumentNode = parse(graphql)

  // The resulting tool kit
  const tools: QLTool[] = []

  const comments = parseComments(doc)
  // Obtain the comment for the definition at the given location
  const getComment = (loc: Location) => {
    const result: Token[] = []
    let comment = comments.find((c) => c.next === loc.startToken)
    while (comment) {
      result.unshift(comment)
      comment = comments.find((c) => c.next === comment) || null
    }
    return result.map((c) => c.value.trim()).join("\n")
  }

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
        const type = getZodType(varDef)
        tool.params.push({
          name,
          description,
          type
        })
      }

      tools.push(tool)
    }
  }

  for (const tool of tools) {
    tool.graphql = [fragmentsGraphQL(tool.fragmentNames), tool.graphql].join(
      "\n\n"
    )
    tool.fn = async (vars: any, context?: any) => {
      const response = await api.run(tool.graphql, vars, context?.headers)
      if (response.condition !== GraphQLResponseCondition.OK) {
        return response
      }
      return response.data
    }
  }

  return tools
}
