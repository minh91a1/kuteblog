export const fetchNow = (url) => {
  return fetch(url).then((res) => res.json())
}
