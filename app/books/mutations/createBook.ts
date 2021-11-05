import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateBook = z.object({
  name: z.string(),
})

export default resolver.pipe(resolver.zod(CreateBook), resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const book = await db.book.create({ data: input })

  return book
})
