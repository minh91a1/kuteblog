import { useState, useEffect } from "react"

export const SCROLL_DIRECTION_DOWN = "SCROLL_DIRECTION_DOWN"
export const SCROLL_DIRECTION_UP = "SCROLL_DIRECTION_UP"
export const SCROLL_DIRECTION_NONE = "SCROLL_DIRECTION_NONE"

export const useScrollDirection = (callback) => {
  const [lastYPosition, setLastYPosition] = useState(window.pageYOffset)
  const [timer, setTimer] = useState(null)

  const handleScroll = () => {
    if (timer !== null) {
      clearTimeout(timer)
    }
    setTimer(
      setTimeout(function () {
        callback(SCROLL_DIRECTION_NONE)
      }, 150)
    )
    if (window.pageYOffset === lastYPosition) return SCROLL_DIRECTION_NONE

    const direction = (() => {
      return lastYPosition < window.pageYOffset
        ? SCROLL_DIRECTION_DOWN
        : SCROLL_DIRECTION_UP
    })()

    callback(direction)
    setLastYPosition(window.pageYOffset)
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, true)
    return () => window.removeEventListener("scroll", handleScroll, true)
  })
}

export const useScrollPosition = (callback) => {
  const handleScroll = (ev) => {
    callback(
      ev.target.scrollTop,
      ev.target.scrollTop + ev.target.offsetHeight,
      ev.target.scrollHeight
    )
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, true)
    return () => window.removeEventListener("scroll", handleScroll, true)
  })
}
