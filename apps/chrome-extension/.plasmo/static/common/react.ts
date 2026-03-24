import { Fragment, type FC, type ReactNode } from "react"

/**
 * Interface for raw imported modules that may contain layout or provider components
 */
interface RawImport {
  /**
   * Optional Layout component - a React functional component that wraps children
   */
  Layout?: FC<{ children: ReactNode }>

  /**
   * Optional function that returns a global provider component
   */
  getGlobalProvider?: () => FC<{ children: ReactNode }>
}

/**
 * Extracts and returns a layout component from a raw import
 * Attempts to get the Layout component, falls back to getGlobalProvider(), then Fragment
 *
 * @param RawImport - The imported module that may contain Layout or getGlobalProvider
 * @returns A React functional component that can wrap children
 */
export const getLayout = (RawImport: RawImport): FC<{ children: ReactNode }> =>
  typeof RawImport.Layout === "function"
    ? RawImport.Layout
    : typeof RawImport.getGlobalProvider === "function"
    ? RawImport.getGlobalProvider()
    : Fragment
