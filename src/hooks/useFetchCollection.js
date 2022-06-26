import { useQuery, useQueryClient } from "react-query"
import { fetch2 } from "../utils/fetcher"

const useFetchCollection = (api) => {
  const full_api = process.env.REACT_APP_API_URL + api
  const queryClient = useQueryClient()

  // use query
  const { isLoading, error, data } = useQuery(full_api, (url) => {
    return fetch2(url.queryKey[0])
  })

  // fetch function
  const refetch = () => {
    queryClient.invalidateQueries(full_api)
  }

  return { isLoading, data, error, refetch }
}

export default useFetchCollection
