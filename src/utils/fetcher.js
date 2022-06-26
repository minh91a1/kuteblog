export const fetchNow = (url) => {
  return fetch(url).then((res) => res.json())
}

export const fetch2 = async (url) => {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error("Network response was not ok")
  }

  return response.json()
}

export const METHOD = {
  POST: "POST",
  DELETE: "DELETE",
  GET: "GET",
  PUT: "PUT",
}

function buildFormData(formData, data, parentKey) {
  if (
    data &&
    typeof data === "object" &&
    !(data instanceof Date) &&
    !(data instanceof File)
  ) {
    Object.keys(data).forEach((key) => {
      buildFormData(
        formData,
        data[key],
        parentKey ? `${parentKey}[${key}]` : key
      )
    })
  } else {
    const value = data == null ? "" : data
    formData.append(parentKey, value)
  }
}

export const jsonToFormData = (data) => {
  const formData = new FormData()

  buildFormData(formData, data)

  return formData
}

// export const fetchMutation = async (method, url, data) => {
//   const response = await fetch(url, {
//     method: method, // GET, POST, PUT, DELETE, etc.
//     //mode: "no-cors", // cors, no-cors, *cors, same-origin
//     //cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
//     // credentials: "same-origin", // include, *same-origin, omit, same-origin
//     headers: {
//       "Content-Type": "application/json",
//       // 'Content-Type': 'application/x-www-form-urlencoded',
//     },
//     //redirect: "follow", // manual, *follow, error
//     //referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
//     body: JSON.stringify(data), // body data type must match "Content-Type" header
//   })

//   console.log(response)

//   if (!response.ok) {
//     throw new Error("minikun: Network response was not ok")
//   }

//   return response.json()
// }

export const fetchMutation2 = async (method, url, data) => {
  const response = await fetch(url, {
    method: method, // GET, POST, PUT, DELETE, etc.
    //mode: "no-cors", // cors, no-cors, *cors, same-origin
    //cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    // credentials: "same-origin", // include, *same-origin, omit, same-origin
    headers: {
      //"Content-Type": "application/json",
      //"Content-Type": "application/x-www-form-urlencoded",
    },
    //redirect: "follow", // manual, *follow, error
    //referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: jsonToFormData(data), // body data type must match "Content-Type" header
  })

  if (!response.ok) {
    throw new Error("Network response was not ok")
  }

  return response.json()
}
