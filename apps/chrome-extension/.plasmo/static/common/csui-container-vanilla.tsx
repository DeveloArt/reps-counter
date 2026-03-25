import type { PlasmoCSUIContainerProps } from "~type"

export const createOverlayCSUIContainer = (props: PlasmoCSUIContainerProps) => {
  const container = document.createElement("div")
  container.className = "plasmo-csui-container"
  container.id = props.id

  container.style.cssText = `
    display: flex;
    position: relative;
    top: 0px;
    left: 0px;
  `

  if (props.anchor.type === "overlay") {
    // Guard clause: check if anchor element exists
    if (!props.anchor.element) {
      return container
    }

    const updatePosition = async () => {
      if (!props.anchor.element) {
        return
      }

      const rect = props.anchor.element.getBoundingClientRect()

      if (!rect) {
        return
      }

      const pos = {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY
      }

      container.style.top = `${pos.top}px`
      container.style.left = `${pos.left}px`
    }

    updatePosition()

    props.watchOverlayAnchor?.(updatePosition)
    window.addEventListener("scroll", updatePosition)
    window.addEventListener("resize", updatePosition)

    // Return cleanup function to remove event listeners when container is removed
    const cleanup = () => {
      window.removeEventListener("scroll", updatePosition)
      window.removeEventListener("resize", updatePosition)
    }

    // Store cleanup function on container for later use
    ;(container as any).__cleanup = cleanup

    // Observe container removal and cleanup
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.removedNodes) {
          if (node === container) {
            cleanup()
            observer.disconnect()
          }
        }
      }
    })

    observer.observe(container.parentNode || document.body, {
      childList: true,
      subtree: true
    })
  }

  return container
}

export const createInlineCSUIContainer = (props: PlasmoCSUIContainerProps) => {
  const container = document.createElement("div")
  container.className = "plasmo-csui-container"
  container.id = "plasmo-inline"

  container.style.cssText = `
    display: flex;
    position: relative;
    top: 0px;
    left: 0px;
  `

  return container
}
