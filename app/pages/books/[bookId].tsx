import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage, useMutation, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getBook from "app/books/queries/getBook"
import deleteBook from "app/books/mutations/deleteBook"

export const Book = () => {
  const router = useRouter()
  const bookId = useParam("bookId", "number")
  const [deleteBookMutation] = useMutation(deleteBook)
  const [book] = useQuery(getBook, { id: bookId })

  return (
    <>
      <Head>
        <title>Book {book.id}</title>
      </Head>

      <div>
        <h1>Book {book.id}</h1>
        <pre>{JSON.stringify(book, null, 2)}</pre>

        <Link href={Routes.EditBookPage({ bookId: book.id })}>
          <a>Edit</a>
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteBookMutation({ id: book.id })
              router.push(Routes.BooksPage())
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </button>
      </div>
    </>
  )
}

const ShowBookPage: BlitzPage = () => {
  return (
    <div>
      <p>
        <Link href={Routes.BooksPage()}>
          <a>Books</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Book />
      </Suspense>
    </div>
  )
}

ShowBookPage.authenticate = true
ShowBookPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowBookPage
