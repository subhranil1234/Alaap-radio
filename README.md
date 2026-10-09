# AALAP — Radio for Mahalaya

A realistic vintage web radio designed for listening to Mahalaya broadcasts on an autumn dawn.

## Features
- Custom HTML5 Audio engine handling live streams and fallback links.
- Interactive vintage UI with tuning dial and volume slider.
- Sleep timer and wake-up alarm.
- Configurable station presets.

## Setup and Running locally on Windows

1. Ensure Node.js is installed.
2. Open PowerShell or Command Prompt.
3. Navigate to the project directory.
4. Install dependencies:
   ```powershell
   npm install
   ```
5. Start the development server:
   ```powershell
   npm run dev
   ```
6. Open the local URL provided in the terminal (usually `http://localhost:5173`) in your web browser.

## Technical Notes
- The audio engine uses the browser's native `HTMLAudioElement` and reacts to events for accurate UI state synchronization.
- Volume, last played station, and alarm configuration are persisted in `localStorage`.
- Direct streams from certain official broadcasters may be blocked by CORS or mixed-content policies. A direct link to the official external player is provided as a fallback in such cases.
