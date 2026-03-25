import type { PlasmoCSUI, PlasmoCSUIAnchor, PlasmoCSUIMountState } from "~type"

const DEFAULT_MOUNT_INTERVAL = 142
const MOUNT_DEBOUNCE_DELAY = 50 // Debounce delay in milliseconds

async function createShadowDOM<T>(mount: PlasmoCSUI<T>) {
  const shadowHost = document.createElement("plasmo-csui")

  const shadowRoot =
    typeof mount.createShadowRoot === "function"
      ? await mount.createShadowRoot(shadowHost)
      : shadowHost.attachShadow({ mode: "open" })

  const shadowContainer = document.createElement("div")

  shadowContainer.id = "plasmo-shadow-container"
  shadowContainer.style.zIndex = "2147483647"
  shadowContainer.style.position = "relative"

  shadowRoot.appendChild(shadowContainer)

  return {
    shadowHost,
    shadowRoot,
    shadowContainer
  }
}

export type PlasmoCSUIShadowDOM = Awaited<ReturnType<typeof createShadowDOM>>

async function injectAnchor<T>(
  mount: PlasmoCSUI<T>,
  anchor: PlasmoCSUIAnchor,
  { shadowHost, shadowRoot }: PlasmoCSUIShadowDOM,
  mountState?: PlasmoCSUIMountState
) {
  if (typeof mount.getStyle === "function") {
    const sfcStyleContent =
      typeof mount.getSfcStyleContent === "function"
        ? await mount.getSfcStyleContent()
        : ""
    shadowRoot.prepend(await mount.getStyle({ ...anchor, sfcStyleContent }))
  }

  if (typeof mount.getShadowHostId === "function") {
    shadowHost.id = await mount.getShadowHostId(anchor)
  }

  if (typeof mount.mountShadowHost === "function") {
    await mount.mountShadowHost({
      shadowHost,
      anchor,
      mountState
    })
  } else if (anchor.type === "inline") {
    anchor.element.insertAdjacentElement(
      anchor.insertPosition || "afterend",
      shadowHost
    )
  } else {
    document.documentElement.prepend(shadowHost)
  }
}

export async function createShadowContainer<T>(
  mount: PlasmoCSUI<T>,
  anchor: PlasmoCSUIAnchor,
  mountState?: PlasmoCSUIMountState
) {
  const shadowDom = await createShadowDOM(mount)

  mountState?.hostSet.add(shadowDom.shadowHost)
  mountState?.hostMap.set(shadowDom.shadowHost, anchor)

  await injectAnchor(mount, anchor, shadowDom, mountState)

  return shadowDom.shadowContainer
}

/**
 * Check if an element is visible in the viewport
 * @param el - The element to check (must be a valid DOM Element)
 * @returns true if the element is visible, false otherwise
 */
const isVisible = (el: Element | null | undefined): el is Element => {
  // Guard clause: ensure el is a valid Element
  if (!el || !(el instanceof Element)) {
    return false
  }

  try {
    const elementRect = el.getBoundingClientRect()
    const elementStyle = globalThis.getComputedStyle(el)

    // Check display property
    if (elementStyle.display === "none") {
      return false
    }

    // Check visibility property
    if (elementStyle.visibility === "hidden") {
      return false
    }

    // Check opacity
    if (elementStyle.opacity === "0") {
      return false
    }

    // Check if element has zero dimensions and is not hidden by overflow
    if (
      elementRect.width === 0 &&
      elementRect.height === 0 &&
      elementStyle.overflow !== "hidden"
    ) {
      return false
    }

    // Check if the element is irrevocably off-screen
    if (
      elementRect.x + elementRect.width < 0 ||
      elementRect.y + elementRect.height < 0
    ) {
      return false
    }

    return true
  } catch (error) {
    // Handle any errors that might occur during visibility check
    console.warn("Error checking element visibility:", error)
    return false
  }
}

export function createAnchorObserver<T>(mount: PlasmoCSUI<T>) {
  const mountState: PlasmoCSUIMountState = {
    document: document || window.document,
    observer: null,

    mountInterval: null,

    isMounting: false,
    isMutated: false,

    hostSet: new Set(),
    hostMap: new WeakMap(),

    overlayTargetList: []
  }

  const isMounted = (el: Element | null) =>
    el?.id
      ? !!document.getElementById(el.id)
      : el?.getRootNode({ composed: true }) === mountState.document

  const hasInlineAnchor = typeof mount.getInlineAnchor === "function"
  const hasOverlayAnchor = typeof mount.getOverlayAnchor === "function"

  const hasInlineAnchorList = typeof mount.getInlineAnchorList === "function"
  const hasOverlayAnchorList = typeof mount.getOverlayAnchorList === "function"

  const shouldObserve =
    hasInlineAnchor ||
    hasOverlayAnchor ||
    hasInlineAnchorList ||
    hasOverlayAnchorList

  if (!shouldObserve) {
    return null
  }

  // Debounce timer for mountAnchors calls
  let debounceTimer: NodeJS.Timeout | null = null

  async function mountAnchors(renderFn: (anchor?: PlasmoCSUIAnchor) => void) {
    mountState.isMounting = true

    const mountedInlineAnchorSet = new WeakSet()

    // There should only be 1 overlay mount
    let overlayHost: Element = null

    // Go through mounted sets and check if they are still mounted
    for (const el of mountState.hostSet) {
      if (isMounted(el)) {
        const anchor = mountState.hostMap.get(el)
        if (!!anchor) {
          if (anchor.type === "inline") {
            mountedInlineAnchorSet.add(anchor.element)
          } else if (anchor.type === "overlay") {
            overlayHost = el
          }
        }
      } else {
        const anchor = mountState.hostMap.get(el)
        anchor.root?.unmount()
        mountState.hostSet.delete(el)
      }
    }

    const [inlineAnchor, inlineAnchorList, overlayAnchor, overlayAnchorList] =
      await Promise.all([
        hasInlineAnchor ? mount.getInlineAnchor() : null,
        hasInlineAnchorList ? mount.getInlineAnchorList() : null,
        hasOverlayAnchor ? mount.getOverlayAnchor() : null,
        hasOverlayAnchorList ? mount.getOverlayAnchorList() : null
      ])

    const renderList: PlasmoCSUIAnchor[] = []

    if (!!inlineAnchor) {
      if (inlineAnchor instanceof Element) {
        if (!mountedInlineAnchorSet.has(inlineAnchor)) {
          renderList.push({
            element: inlineAnchor,
            type: "inline"
          })
        }
      } else if (
        inlineAnchor.element instanceof Element &&
        !mountedInlineAnchorSet.has(inlineAnchor.element)
      ) {
        renderList.push({
          element: inlineAnchor.element,
          type: "inline",
          insertPosition: inlineAnchor.insertPosition
        })
      }
    }

    if ((inlineAnchorList?.length || 0) > 0) {
      inlineAnchorList.forEach((inlineAnchor) => {
        if (
          inlineAnchor instanceof Element &&
          !mountedInlineAnchorSet.has(inlineAnchor)
        ) {
          renderList.push({
            element: inlineAnchor,
            type: "inline"
          })
        } else if (
          inlineAnchor.element instanceof Element &&
          !mountedInlineAnchorSet.has(inlineAnchor.element)
        ) {
          renderList.push({
            element: inlineAnchor.element,
            type: "inline",
            insertPosition: inlineAnchor.insertPosition
          })
        }
      })
    }

    const overlayTargetList = []

    if (isVisible(overlayAnchor)) {
      overlayTargetList.push(overlayAnchor)
    }

    if ((overlayAnchorList?.length || 0) > 0) {
      overlayAnchorList.forEach((el) => {
        if (isVisible(el)) {
          overlayTargetList.push(el)
        }
      })
    }

    if (overlayTargetList.length > 0) {
      mountState.overlayTargetList = overlayTargetList
      if (!overlayHost) {
        renderList.push({
          element: document.documentElement,
          type: "overlay"
        })
      } else {
        // force re-render
      }
    } else {
      overlayHost?.remove()
      mountState.hostSet.delete(overlayHost)
    }

    await Promise.all(renderList.map(renderFn))

    if (mountState.isMutated) {
      mountState.isMutated = false
      await mountAnchors(renderFn)
    }

    mountState.isMounting = false
  }

  // Debounced version of mountAnchors
  const debouncedMountAnchors = (renderFn: (anchor?: PlasmoCSUIAnchor) => void) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    debounceTimer = setTimeout(() => {
      if (mountState.isMounting) {
        mountState.isMutated = true
        return
      }
      mountAnchors(renderFn)
      debounceTimer = null
    }, MOUNT_DEBOUNCE_DELAY)
  }

  const start = (renderFn: (anchor?: PlasmoCSUIAnchor) => void) => {
    mountState.observer = new MutationObserver(() => {
      debouncedMountAnchors(renderFn)
    })

    // Need to watch the subtree for shadowDOM
    mountState.observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    })

    mountState.mountInterval = setInterval(() => {
      debouncedMountAnchors(renderFn)
    }, DEFAULT_MOUNT_INTERVAL)
  }

  const stop = () => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
      debounceTimer = null
    }

    if (mountState.observer) {
      mountState.observer.disconnect()
      mountState.observer = null
    }

    if (mountState.mountInterval) {
      clearInterval(mountState.mountInterval)
      mountState.mountInterval = null
    }
  }

  return {
    start,
    stop,
    mountState
  }
}

/**
 * Create a render function for mounting UI components
 * @template T - The type of containers being used
 * @param mount - The Plasmo CSU configuration
 * @param containers - A tuple of two containers for rendering
 * @param mountState - Optional mount state for tracking mounted components
 * @param renderFx - Optional custom render function
 * @returns A function that renders the component for a given anchor
 */
export const createRender = <T extends unknown>(
  mount: PlasmoCSUI<T>,
  containers: readonly [T, T],
  mountState?: PlasmoCSUIMountState,
  renderFx?: (anchor: PlasmoCSUIAnchor, rootContainer: Element) => Promise<void>
) => {
  const createRootContainer = (anchor: PlasmoCSUIAnchor) =>
    typeof mount.getRootContainer === "function"
      ? mount.getRootContainer({
          anchor,
          mountState
        })
      : createShadowContainer(mount, anchor, mountState)

  if (typeof mount.render === "function") {
    return (anchor: PlasmoCSUIAnchor) =>
      mount.render(
        {
          anchor,
          createRootContainer
        },
        ...containers
      )
  }

  return async (anchor: PlasmoCSUIAnchor) => {
    const rootContainer = await createRootContainer(anchor)
    return renderFx(anchor, rootContainer)
  }
}
