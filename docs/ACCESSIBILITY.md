# Accessibility Implementation

This document outlines the accessibility standards and features implemented in Auxilia.

## Implementation Details

- **Visual Indicators:** State changes are conveyed through text and iconography rather than relying exclusively on color.
- **Keyboard Navigation:** Interactive elements utilize semantic HTML (`<button>`, `<a>`, `<input>`). Custom interactive elements implement `tabIndex={0}` and corresponding keyboard event listeners (e.g., `Enter` and `Space`).
- **Screen Readers:** ARIA attributes (`aria-label`, `aria-hidden`) are applied to manage the screen reader parsing flow and hide decorative elements.
- **Touch Targets:** The `AccessibleButton` component specifies a minimum height of 48px (`h-12` in Tailwind) to comply with mobile touch target guidelines.

## Accessibility Profile Settings

The user profile allows configuration of global application behavior:

- **Large Text:** Increases baseline typography scale.
- **High Contrast:** Applies a strict black-and-white color palette by modifying global CSS variables.
- **Reduced Motion:** Disables CSS transitions and animations using `* { transition: none !important }`.
- **Voice Feedback:** Invokes the Text-to-Speech service (`ttsService`) for critical state changes.
- **Haptic Feedback:** Calls `navigator.vibrate()` during button interactions on supported devices.
