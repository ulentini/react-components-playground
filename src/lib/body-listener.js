import React, { useEffect } from "react"

const listenerList = {}

function dispatchBodyEvent(eventType, event) {
  if (listenerList[eventType] && Array.isArray(listenerList[eventType])) {
    for (let listener of listenerList[eventType]) {
      listener(event)
    }
  }
}

export function useBodyListener(eventType, callback) {
  if (!listenerList[eventType]) {
    listenerList[eventType] = []
    document.body.addEventListener(eventType, event =>
      dispatchBodyEvent(eventType, event),
    )
  }

  useEffect(() => {
    document.body.addEventListener(eventType, callback)

    return () => {
      document.body.removeEventListener(eventType, callback)
    }
  }, [eventType, callback])
}
