# Architecture

## Overview

Auxilia is a web application built using the Next.js App Router. The UI is designed to be responsive, with an emphasis on mobile touch targets and screen reader compatibility.

## Directory Structure

- `src/app/`: Next.js pages and layouts.
  - `/see`: Vision assistance page
  - `/read`: OCR capabilities page
  - `/hear`: Live captions and sound detection page
  - `/speak`: AAC and quick phrases page
  - `/understand`: AI text simplification page
  - `/help`: Emergency and assistance page
  - `/profile`: Accessibility settings page
- `src/components/ui/`: Reusable UI components (e.g., `AccessibleButton`, `CameraOverlay`).
- `src/components/layout/`: Global layout components (`BottomNavigation`, `AppProvider`).
- `src/store/`: Zustand stores for client-side state management (`useProfileStore`).
- `src/services/`: Abstraction layer for AI and hardware APIs.

## AI Service Layer

AI interactions are abstracted within `src/services/ai.ts`. This design decouples the frontend components from specific AI providers (such as OpenAI, Google, Anthropic, or on-device models).

For the AppX competition demo, the service layer is currently populated with deterministic mock responses to guarantee reliability during the presentation.

## Theming and Styling

Theming is implemented using Tailwind CSS and CSS variables defined in `src/app/globals.css`. 

The `AppProvider` component reads the user's preferences from the Zustand store and injects corresponding modifier classes (such as `.high-contrast` or `.large-text`) into the `<body>` element. This approach updates the CSS variables globally without requiring full page reloads.
