# Auxilia

Auxilia is an accessibility companion application developed for the AppX accessibility competition. It combines several assistive tools into a single, context-aware interface.

## Overview

Accessibility currently depends on having the right tool at the right time. Auxilia combines essential capabilities—vision assistance, reading, captioning, communication, and simplification—into one application to reduce the need to switch between separate tools.

## Features

- **Adaptive Home:** Surafces immediate, actionable tools based on past usage and settings.
- **See Mode:** Camera-first visual assistance for describing environments and recognizing objects.
- **Read Mode:** OCR combined with Text-to-Speech (TTS) for reading text.
- **Understand Mode:** Uses AI to simplify complex instructions into step-by-step guides or key points.
- **Hear Mode:** Real-time captioning and environmental sound awareness.
- **Speak Mode:** Augmentative and Alternative Communication (AAC) with quick phrases and typing.
- **Help Mode:** Emergency assistance with explicit user confirmation requirements.

## Architecture

- **Framework:** Next.js (App Router) with React
- **Styling:** Tailwind CSS with CSS Variables for high-contrast theming
- **State Management:** Zustand for persistent accessibility preferences
- **Icons:** Lucide React
- **AI Abstraction:** Replaceable AI service layers located in `src/services/ai.ts`

## Privacy

- Clear indicators for camera and microphone usage
- No background recording of conversations or location data
- Explicit user controls for saved information

## Installation

```bash
npm install
npm run dev
```

Open `http://localhost:3000` to view the application in the browser.

## Limitations

- **Mock AI:** The application currently uses simulated AI delays (Demo Mode) to demonstrate the architecture without requiring external API keys during hackathon judging.
- **Future Integration:** The `ai.ts` adapters are designed to be connected to production providers (e.g., OpenAI, Google Cloud Vision, or on-device WebNN models).

Additional documentation is available in the `/docs` directory.
