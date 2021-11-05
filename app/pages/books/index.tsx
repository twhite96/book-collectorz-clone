import { Suspense } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getBooks from "app/books/queries/getBooks"

const ITEMS_PER_PAGE = 100

export const BooksList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ books, hasMore }] = usePaginatedQuery(getBooks, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <div>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            <Link href={Routes.ShowBookPage({ bookId: book.id })}>
              <a>{book.name}</a>
            </Link>
          </li>
        ))}
      </ul>

      <button disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </button>
    </div>
  )
}

const BooksPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Books</title>
      </Head>

      <div>
        <p>
          <Link href={Routes.NewBookPage()}>
            <a>Create Book</a>
          </Link>
        </p>

        <Suspense fallback={<div>Loading...</div>}>
          <BooksList />
        </Suspense>
      </div>
    </>
  )
}

BooksPage.authenticate = true
BooksPage.getLayout = (page) => <Layout>{page}</Layout>

export default BooksPage
