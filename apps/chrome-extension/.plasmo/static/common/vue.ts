/**
 * Vue Configuration Flags
 * These global flags configure Vue's behavior at runtime.
 * They must be set before Vue is imported to take effect.
 */

/**
 * Enable Vue Options API
 * Allows using the traditional Vue 2 style options API (data, methods, computed, etc.)
 * alongside the Composition API in Vue 3.
 * Set to true to support both API styles.
 */
globalThis.__VUE_OPTIONS_API__ = true

/**
 * Enable DevTools in Production
 * Allows Vue DevTools browser extension to work in production builds.
 * Automatically disabled in production builds for security and performance.
 * Set based on NODE_ENV to enable DevTools only during development.
 */
globalThis.__VUE_PROD_DEVTOOLS__ = process.env.NODE_ENV !== "production"

/**
 * Disable Detailed Hydration Mismatch Information
 * When true, Vue provides detailed information about server-side rendering (SSR)
 * hydration mismatches for debugging purposes.
 * Set to false to disable verbose hydration mismatch warnings in production.
 */
globalThis.__VUE_PROD_HYDRATION_MISMATCH_DETAILS__ = false
