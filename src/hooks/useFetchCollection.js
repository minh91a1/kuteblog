import { useQuery } from "react-query"
import { fetchNow } from "../utils/fetcher"

const useFetchCollection = (api) => {
  const { isLoading, error, data } = useQuery(
    process.env.REACT_APP_API_URL + api,
    (url) => {
      return fetchNow(url.queryKey[0])
    }
  )

  return { isLoading, data, error }
}

export default useFetchCollection
