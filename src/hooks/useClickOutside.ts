import { useEffect, type RefObject } from 'react'

/**
 * Hook that alerts clicks outside of the passed ref
 * @param ref - Reference to the element to watch
 * @param handler - Function to call on outside click
 * @param excludeRef - Optional reference to another element to exclude (e.g., trigger button)
 */
export function useClickOutside(
  ref: RefObject<HTMLElement | null>,
  handler: () => void,
  excludeRef?: RefObject<HTMLElement | null>
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return
      }

      // Do nothing if clicking excluded element (like the toggle button)
      if (excludeRef?.current && excludeRef.current.contains(event.target as Node)) {
        return
      }

      handler()
    }

    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)

    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, handler, excludeRef])
}
