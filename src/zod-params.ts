import { boolean, number, string } from "zod"

export const strZodTypes = {
  string: string(),
  number: number(),
  boolean: boolean()
  // TODO: Handle other param types
}

// export const zodParams = (
//   params: Record<string, keyof typeof strZodTypes>[]
// ): ZodRawShape => {
//   const result: ZodRawShape = {}
//   for (const [type, value] of params.entries()) {
//     const zodType = strZodTypes[type]
//     result[key] = zodType[type]
//   }
//   return result
// }
