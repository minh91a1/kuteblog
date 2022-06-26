import { useQuery } from "react-query"
import { fetch2 } from "../utils/fetcher"

const useFetchOne = (api, id) => {
  const { isLoading, error, data } = useQuery(
    process.env.REACT_APP_API_URL + api + "/" + id,
    (q) => {
      if (id === undefined || id === null) {
        return "id not found"
      }
      const url = q.queryKey[0]
      return fetch2(url)
    }
  )

  return { isLoading, data, error }
}

export default useFetchOne
