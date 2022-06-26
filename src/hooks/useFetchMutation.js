import { useState } from "react"
import { useMutation } from "react-query"
import { fetchMutation2 } from "../utils/fetcher"

const useFetchMutation = (method, api, onSuccessCallback, onCompleted) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasError, setHasError] = useState(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const mutation = useMutation(
    (payload) => {
      return fetchMutation2(
        method,
        process.env.REACT_APP_API_URL + api,
        payload
      )
    },
    {
      onMutate: (variables) => {
        // A mutation is about to happen!
        // Optionally return a context containing data to use when for example rolling back
        setIsSubmitting(true)
        return { id: 1 }
      },

      onError: (error, variables, context) => {
        // An error happened!
        console.log(`rolling back optimistic update with id ${context.id}`)
        setHasError(error)
      },

      onSuccess: (data, variables, context) => {
        // Boom baby!
        setIsSuccess(true)
        if (onSuccessCallback) {
          onSuccessCallback()
        }
      },

      onSettled: (data, error, variables, context) => {
        // Error or success... doesn't matter!
        setIsSubmitting(false)
        if (onCompleted) {
          onCompleted()
        }
      },
    }
  )

  const submit = (payload) => {
    mutation.mutate(payload)
  }

  return { isSubmitting, submit, hasError, isSuccess }
}

export default useFetchMutation
