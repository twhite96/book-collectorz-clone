import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useMutation, useParam, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getBook from "app/books/queries/getBook"
import updateBook from "app/books/mutations/updateBook"
import { BookForm, FORM_ERROR } from "app/books/components/BookForm"

export const EditBook = () => {
  const router = useRouter()
  const bookId = useParam("bookId", "number")
  const [book, { setQueryData }] = useQuery(
    getBook,
    { id: bookId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updateBookMutation] = useMutation(updateBook)

  return (
    <>
      <Head>
        <title>Edit Book {book.id}</title>
      </Head>

      <div>
        <h1>Edit Book {book.id}</h1>
        <pre>{JSON.stringify(book, null, 2)}</pre>

        <BookForm
          submitText="Update Book"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateBook}
          initialValues={book}
          onSubmit={async (values) => {
            try {
              const updated = await updateBookMutation({
                id: book.id,
                ...values,
              })
              await setQueryData(updated)
              router.push(Routes.ShowBookPage({ bookId: updated.id }))
            } catch (error: any) {
              console.error(error)
              return {
                [FORM_ERROR]: error.toString(),
              }
            }
          }}
        />
      </div>
    </>
  )
}

const EditBookPage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditBook />
      </Suspense>

      <p>
        <Link href={Routes.BooksPage()}>
          <a>Books</a>
        </Link>
      </p>
    </div>
  )
}

EditBookPage.authenticate = true
EditBookPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditBookPage
