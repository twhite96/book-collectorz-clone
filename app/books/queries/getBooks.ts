import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetBooksInput
  extends Pick<Prisma.BookFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetBooksInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: books,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.book.count({ where }),
      query: (paginateArgs) => db.book.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      books,
      nextPage,
      hasMore,
      count,
    }
  }
)
