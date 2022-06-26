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

export const fetchMutation = async (method, url, data) => {
  console.log("json data:", url)
  const response = await fetch(url, {
    method: method, // GET, POST, PUT, DELETE, etc.
    //mode: "no-cors", // cors, no-cors, *cors, same-origin
    //cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    // credentials: "same-origin", // include, *same-origin, omit, same-origin
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    //redirect: "follow", // manual, *follow, error
    //referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  })

  if (!response.ok) {
    throw new Error("Network response was not ok")
  }

  return response.json()
}
