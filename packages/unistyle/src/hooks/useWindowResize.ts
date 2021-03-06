import { useState, useEffect } from 'react'
import { throttle } from '@vitus-labs/core'

export type UseWindowResize = (
  throttleDelay?: number,
  defaultValues?: Partial<{
    width: number
    height: number
  }>
) => {
  width: number
  height: number
}

const useWindowResize: UseWindowResize = (
  throttleDelay = 200,
  { width = 0, height = 0 } = {}
) => {
  const getSize = () => ({
    width: __CLIENT__ ? window.innerWidth : width,
    height: __CLIENT__ ? window.innerHeight : height,
  })

  const [windowSize, setWindowSize] = useState(getSize)

  useEffect(() => {
    if (__SERVER__) return undefined

    const handleResize = throttle(() => {
      setWindowSize(getSize())
    }, throttleDelay)

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, []) // Empty array ensures that effect is only run on mount and unmount

  return windowSize
}

export default useWindowResize
