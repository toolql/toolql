import { QLToolParam } from "../toolql"

export const paramTypes = (params: QLToolParam[]) =>
  (params || []).reduce(
    (o, p) => ({
      ...o,
      [p.name]: p.type.describe(p.description)
    }),
    {}
  )
