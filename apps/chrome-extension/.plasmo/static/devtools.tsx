import React from "react"
import { createRoot } from "react-dom/client"

import { getLayout } from "@plasmo-static-common/react"
import type { RawImport } from "@plasmo-static-common/react"

import * as Component from "~devtools"

/**
 * Initialize the DevTools UI when DOM is ready
 * Uses IIFE pattern to encapsulate state and avoid global variables
 */
(() => {
  let isInitialized = false

  document.addEventListener("DOMContentLoaded", () => {
    if (isInitialized) {
      return
    }

    const plasmoRoot = document.getElementById("__plasmo")

    if (!plasmoRoot) {
      console.error("Failed to find __plasmo root element")
      return
    }

    const root = createRoot(plasmoRoot)

    const Layout = getLayout(Component as unknown as RawImport)

    root.render(
      <Layout>
        <Component.default />
      </Layout>
    )

    isInitialized = true
  })
})()
