import clsx from 'clsx'
import React from 'react'
import {
  Form,
  Link,
  LoaderFunctionArgs,
  useLoaderData,
  useSearchParams,
} from 'react-router-dom'
import { isEmpty, orderBy, range } from 'lodash-es'

type ApiResponse<T> = {
  data: T
  page: number
  per_page: number
  total: number
  total_pages: number
}

type Movie = {
  Title: string
  Year: string
}

type LoaderData = {
  movies: Movie[]
  totalPages: number
}

const SearchParams = {
  Title: 'title',
  Page: 'page',
  Sort: 'sort',
  Order: 'order',
} as const

const Order = {
  Asc: 'asc',
  Desc: 'desc',
} as const

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)

  const title = url.searchParams.get(SearchParams.Title)
  const page = url.searchParams.get(SearchParams.Page)
  const sort = url.searchParams.get(SearchParams.Sort)
  const order = url.searchParams.get(SearchParams.Order)

  const endpoint = new URL('https://jsonmock.hackerrank.com/api/movies/search')

  if (title) {
    endpoint.searchParams.set('Title', title)
  }

  if (page) {
    endpoint.searchParams.set('page', page)
  }

  const res = await fetch(endpoint)

  /**
   * Unfortunately there is not way to define the type of the response
   * so we are forced to cast it to the type that we expect it to be.
   */
  const json = (await res.json()) as ApiResponse<Movie[]>

  let movies: Movie[] = json.data

  if (sort && order) {
    /**
     * This is obviously a contrived example,
     * in the real world we need to sort all of the data,
     * and not just the current page.
     */
    movies = orderBy(json.data, sort, order === Order.Desc ? order : Order.Asc)
  }

  return {
    movies,
    totalPages: json.total_pages,
  }
}

export default function Root() {
  const loaderData = useLoaderData() as LoaderData
  const [searchParams] = useSearchParams()

  const title = searchParams.get(SearchParams.Title) || ''

  return (
    <div className="max-w-4xl mx-auto p-8 h-full flex flex-col">
      <header className="border-b border-gray-300 pb-8">
        <h1 className="text-2xl font-bold">Movies search</h1>
        <p className="mt-2">Search for any movie you like</p>
        <Form className="mt-6 flex gap-x-4">
          <input
            className="border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            type="text"
            placeholder="Type movie name"
            name="title"
            defaultValue={title}
          />
          <button className="bg-blue-500 px-6 py-2 text-white hover:bg-blue-600 transition">
            Search
          </button>
        </Form>
      </header>
      <main className="py-8">
        <table className="border-collapse table-auto border border-gray-300 w-full">
          <thead>
            <tr className="divide-x divide-gray-300">
              <TableHeader column="Title">Movie name</TableHeader>
              <TableHeader column="Year">Year</TableHeader>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {!isEmpty(loaderData.movies) ? (
              loaderData.movies.map((movie, i) => (
                <tr key={i} className="divide-x divide-gray-300">
                  <td className="px-6 py-2">{movie.Title}</td>
                  <td className="px-6 py-2">{movie.Year}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="text-center px-6 py-4 text-gray-700">
                  No movies found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </main>
      {loaderData.totalPages > 1 && (
        <footer className="flex flex-col items-center border-t border-gray-300 py-8">
          <nav className="flex gap-2 min-w-0 flex-wrap justify-center w-full">
            {range(loaderData.totalPages).map((i) => (
              <PaginationLink key={i} page={i + 1} />
            ))}
          </nav>
          <p className="mt-4 font-semibold">
            {loaderData.totalPages} total pages
          </p>
        </footer>
      )}
    </div>
  )
}

function TableHeader({
  children,
  column,
}: {
  children: React.ReactNode
  column: string
}) {
  const [searchParams] = useSearchParams()

  const sort = searchParams.get(SearchParams.Sort)
  const order = searchParams.get(SearchParams.Order)
  const isSorted = sort === column

  const search = React.useMemo(() => {
    const params = new URLSearchParams(searchParams)
    const currentOrder = params.get(SearchParams.Order)

    params.set(SearchParams.Sort, column)
    params.set(
      SearchParams.Order,
      currentOrder === Order.Asc ? Order.Desc : Order.Asc
    )

    return params.toString()
  }, [column, searchParams])

  return (
    <th className="text-left border-b border-gray-300">
      <Link
        to={{ search }}
        className="flex justify-between items-center w-full px-6 py-2 gap-x-4"
      >
        {children}
        <div
          className={clsx(
            'px-1.5 rounded transition',
            isSorted && 'bg-gray-100'
          )}
        >
          <div
            className={clsx(
              'transition',
              isSorted && order === Order.Asc && 'rotate-180'
            )}
          >
            &#x25BC;
          </div>
        </div>
      </Link>
    </th>
  )
}

function PaginationLink({ page }: { page: number }) {
  const [searchParams] = useSearchParams()

  const currentPage = searchParams.has(SearchParams.Page)
    ? Number(searchParams.get(SearchParams.Page))
    : 1

  const search = React.useMemo(() => {
    const params = new URLSearchParams(searchParams)

    params.set(SearchParams.Page, String(page))

    return params.toString()
  }, [page, searchParams])

  return (
    <Link
      to={{ search }}
      className={clsx(
        'px-4 py-2 border border-gray-300 hover:bg-gray-50 transition',
        currentPage === page && 'bg-gray-100'
      )}
    >
      {page}
    </Link>
  )
}
