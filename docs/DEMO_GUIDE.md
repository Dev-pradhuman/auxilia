# Demo Guide

## Environment Setup

The Auxilia prototype executes in the browser, requesting local camera and microphone permissions natively. Network-bound AI processing is currently mocked via the service layer (`src/services/ai.ts`) to provide deterministic responses for demonstration purposes without requiring external API keys.

## Demonstration Flows

### Flow 1: Text Extraction and Simplification
1. Navigate to the **Read** tab.
2. Select **Scan Document**.
3. Select **Read Aloud** after text extraction completes.
4. Select **Understand**.
5. Select **Turn into step-by-step** to observe the text simplification process.

### Flow 2: Captioning and Sound Detection
1. Navigate to the **Hear** tab.
2. Select **Start Captions**.
3. Speak into the microphone to observe Web Speech API transcription.
4. Wait approximately 5 seconds for the mock environmental sound detection ("Fire Alarm") to trigger the alert UI.

### Flow 3: Accessibility Profile
1. Navigate to the **Profile** tab.
2. Toggle the **High Contrast**, **Large Text**, and **Reduced Motion** settings.
3. Return to the Home screen to verify the global application of the CSS variable modifications.
