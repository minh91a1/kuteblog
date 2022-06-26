import { useInfiniteQuery } from "react-query"
import { fetch2 } from "../utils/fetcher"

const useFetchInfinite = (api, searchKey) => {
  const full_api = process.env.REACT_APP_API_URL + api
  // common fetch
  const fetchProjects = async ({ pageParam = 0 }) => {
    return fetch2(full_api + "?offset=" + pageParam + "&searchKey=" + searchKey)
  }

  // query
  const {
    data,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery(full_api, fetchProjects, {
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage || lastPage.length === 0) {
        // return undefined to signal hasNextPage = false
        return
      }
      let total = 0
      pages.forEach((page) => {
        total += page.length
      })
      return total
    },
  })

  return {
    data,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  }
}

export default useFetchInfinite
