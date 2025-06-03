import { QLToolParam } from "../toolql"
import z from "zod"

export const zodParams = (params: QLToolParam[]) =>
  z.object(
    (params || []).reduce(
      (o, p) => ({
        ...o,
        [p.name]: p.type.describe(p.description)
      }),
      {}
    )
  )
