import React from "react"
import { createRoot } from "react-dom/client"

import { getLayout } from "@plasmo-static-common/react"
import type { RawImport } from "@plasmo-static-common/react"

import * as Component from "~devtools"

let __plasmoRoot: HTMLElement | null = null

document.addEventListener("DOMContentLoaded", () => {
  if (!!__plasmoRoot) {
    return
  }

  __plasmoRoot = document.getElementById("__plasmo")

  if (!__plasmoRoot) {
    console.error("Failed to find __plasmo root element")
    return
  }

  const root = createRoot(__plasmoRoot)

  const Layout = getLayout(Component as unknown as RawImport)

  root.render(
    <Layout>
      <Component.default />
    </Layout>
  )
})
