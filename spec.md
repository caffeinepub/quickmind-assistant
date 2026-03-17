# QuickMind Assistant

## Current State
A chat-based AI assistant app with text input, message history, suggestion chips, and a local AI engine (processMessage). No image support, no calculator.

## Requested Changes (Diff)

### Add
- Image upload button in the chat footer so users can attach an image (e.g. a photo of a math problem) to be "solved". The image should display in the chat bubble and the AI should respond with a simulated solve message.
- A Calculator panel accessible via a button/tab in the UI (floating or sidebar). Full numeric keypad with standard ops (+, -, *, /, =, C, ±, %).
- A "CODE" button on the calculator. When pressed, it opens a 4-digit PIN entry overlay. If the user enters "0000", it navigates to (opens) poxel.io embedded in an iframe that fills the screen. The iframe should be rendered with `will-change: transform` and smooth 60fps optimizations. A close/back button lets users exit the iframe and return to the app.
- If wrong PIN is entered, show an error shake animation.

### Modify
- Chat input area: add an image upload icon button next to the text input.
- Navigation/layout: add a calculator toggle button in the header or as a floating action button.

### Remove
- Nothing removed.

## Implementation Plan
1. Create `Calculator.tsx` component with full keypad, CODE button, PIN overlay, and poxel.io iframe embed.
2. Create `ImageUpload` hook/utility for reading image files as data URLs.
3. Update `App.tsx`:
   - Add calculator toggle button in header.
   - Conditionally render `<Calculator />` as a modal/overlay.
   - Add image upload button in footer next to input.
   - When image is attached, display it in the user bubble and trigger a simulated AI response.
4. Optimize iframe with CSS: `will-change: transform`, `image-rendering: auto`, smooth transitions.
