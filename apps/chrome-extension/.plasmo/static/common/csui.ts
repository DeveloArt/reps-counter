import type { PlasmoCSUI, PlasmoCSUIAnchor, PlasmoCSUIMountState } from "~type"

const DEFAULT_MOUNT_INTERVAL = 142

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

const isVisible = (el: Element) => {
  if (!el) {
    return false
  }
  const elementRect = el.getBoundingClientRect()
  const elementStyle = globalThis.getComputedStyle(el)

  // console.log(elementRect, elementStyle)

  if (elementStyle.display === "none") {
    return false
  }

  if (elementStyle.visibility === "hidden") {
    return false
  }

  if (elementStyle.opacity === "0") {
    return false
  }

  if (
    elementRect.width === 0 &&
    elementRect.height === 0 &&
    elementStyle.overflow !== "hidden"
  ) {
    return false
  }

  // Check if the element is irrevocably off-screen:
  if (
    elementRect.x + elementRect.width < 0 ||
    elementRect.y + elementRect.height < 0
  ) {
    return false
  }

  return true
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

    if (!!overlayAnchor && isVisible(overlayAnchor)) {
      overlayTargetList.push(overlayAnchor)
    }

    if ((overlayAnchorList?.length || 0) > 0) {
      overlayAnchorList.forEach((el) => {
        if (el instanceof Element && isVisible(el)) {
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
      await mountAnchors(render)
    }

    mountState.isMounting = false
  }

  const start = (renderFn: (anchor?: PlasmoCSUIAnchor) => void) => {
    mountState.observer = new MutationObserver(() => {
      if (mountState.isMounting) {
        mountState.isMutated = true
        return
      }
      mountAnchors(renderFn)
    })

    // Need to watch the subtree for shadowDOM
    mountState.observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    })

    mountState.mountInterval = setInterval(() => {
      if (mountState.isMounting) {
        mountState.isMutated = true
        return
      }
      mountAnchors(renderFn)
    }, DEFAULT_MOUNT_INTERVAL)
  }

  const stop = () => {
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

export const createRender = <T>(
  mount: PlasmoCSUI<T>,
  containers: [T, T],
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
