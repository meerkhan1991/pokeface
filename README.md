# PokéLook – Which Pokémon Do You Look Like?

PokéLook is a mobile-first entertainment application that suggests a fun Pokémon lookalike based on observable styling cues such as expression, hairstyle, dominant colors, accessories, and overall visual presence.

> **Note:** This is an unofficial, lighthearted educational fan project and is not affiliated with or endorsed by Nintendo, Game Freak, or The Pokémon Company.

---

## Features

- **Home Screen**: Engaging intro with subtitle *"Upload a selfie and discover your Pokémon lookalike!"*, clear How It Works guide, and comprehensive privacy assurances.
- **Photo Upload & Live Camera**: Support for JPG, PNG, and WebP images up to 5 MB with instant preview, remove/replace options, live webcam capture with camera-flip support, and mobile native camera integration.
- **AI Visual Analysis (`/api/match`)**: Uses Google Gemini vision models (`gemini-3.8-flash`) server-side to analyze *only* non-sensitive visual elements (expression, hairstyle, dominant colors, accessories, and aesthetic styling).
- **Curated Pokémon Matching**: Grounded in a curated allowlist of 36 iconic Pokémon across generations. Returns the best match, two alternative matches, three visual reasons, and a friendly explanation.
- **PokéAPI Integration (`/api/pokemon`)**: Directly fetches verified Pokédex data, types, and official artwork from [PokéAPI](https://pokeapi.co/) with an 8-second timeout and 24-hour response caching.
- **Results Experience**: Displays the matched Pokémon's official artwork, Pokédex details, 3 visual reasons, 2 interactive alternatives, an optional side-by-side comparison with your photo, and a downloadable result card generator.
- **Privacy & Ethical Guardrails**:
  - No permanent image storage.
  - No database or localStorage image retention.
  - Zero facial recognition, biometric templates, or identity matching.
  - No inference of sensitive attributes (race, gender identity, age, health, body weight, or attractiveness).
  - Explicit user action required before sending the image to the external AI provider.
- **Sharing**: Copy result text, native Web Share API support, and a client-side Canvas-generated PNG result card download.
- **Attribution**: PokéAPI data attribution and legal disclaimer.

---

## Architecture & File Structure

```
├── api/
│   ├── match.js             # Vercel serverless / Express handler for Gemini visual analysis
│   ├── pokemon.js           # Vercel serverless / Express handler for PokéAPI caching & retrieval
│   └── pokemonCatalog.js    # Curated allowlist of 36 Pokémon with visual style profiles
├── src/
│   ├── components/
│   │   ├── Attribution.tsx      # PokéAPI & legal disclaimer footer
│   │   ├── CameraModal.tsx      # Live camera capture with front/back camera switching
│   │   ├── ErrorModal.tsx       # User-friendly error dialogs (API key, file size, timeout)
│   │   ├── Header.tsx           # 3-zone top navigation bar
│   │   ├── Hero.tsx             # Home hero with title & subtitle
│   │   ├── HowItWorks.tsx       # 3-step visual workflow explanation
│   │   ├── LoadingState.tsx     # Reassuring step-by-step loading animation
│   │   ├── PhotoUploader.tsx    # Upload, preview, validation, and consent trigger
│   │   ├── PrivacySection.tsx   # Detailed transparent data protection terms
│   │   └── ResultsView.tsx      # Result showcase, alternatives, and sharing
│   ├── services/
│   │   ├── api.ts               # Frontend service client for /api/match and /api/pokemon
│   │   └── cardGenerator.ts     # Canvas-based downloadable share card generator
│   ├── App.tsx                  # Main application orchestrator
│   ├── index.css                # Tailwind CSS styling and theme
│   └── main.tsx                 # React entry point
├── server.ts                    # Full-stack dev server combining Express & Vite middleware
├── .env.example                 # Example environment variables (GEMINI_API_KEY)
├── .gitignore                   # Ignore rules protecting .env* files
├── metadata.json                # AI Studio application metadata
├── package.json                 # Project dependencies & scripts
└── tsconfig.json                # TypeScript configuration
```

---

## Setup & Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment Variables:**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Add your Google Gemini API key:
   ```env
   GEMINI_API_KEY="your-gemini-api-key"
   ```

3. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. **Building for Production:**
   ```bash
   npm run build
   ```

---

## Attributions

- Pokémon data: [PokéAPI](https://pokeapi.co/)
- AI Visual Analysis: Google Gemini API via `@google/genai`
