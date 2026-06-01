/**
 * Deep Ocean is flat by design — no decorative background glow or gradient.
 * This is intentionally a no-op (kept so existing screens can keep importing
 * it without change); depth is carried by solid surfaces and real elevation.
 */
function ScreenGlow() {
  return null
}

export { ScreenGlow }
