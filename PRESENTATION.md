# Articulate — Smart Speech Articulation Training System
## Comprehensive Presentation Deck & Slide Notes

---

## Slide Index & Overview

| Slide # | Slide Title | Core Focus |
|---|---|---|
| **Slide 1** | Title & Introduction | Vision, Tagline, Project Overview |
| **Slide 2** | Problem Statement | Speech Challenges & Gaps in Current Tools |
| **Slide 3** | The Solution: Articulate | AI-Powered Real-Time Speech Articulation Trainer |
| **Slide 4** | Accessibility-First Design | Accessible Pastel Palette, Colorblind Icons, Motor Control |
| **Slide 5** | System Architecture | End-to-End Frontend, API & AI Microservice Flow |
| **Slide 6** | Frontend Engineering | React 19, Tailwind v4, Web Audio API, PCM-to-WAV |
| **Slide 7** | AI Backend & 9-Stage Pipeline | FastAPI, Whisper STT, Forced Alignment, GOP Scoring |
| **Slide 8** | Core Demo Loop | Practice Screen: Text → Record → Viseme SVG → Results |
| **Slide 9** | Progress & Analytics | Recharts Data Visualization & Streak Heatmap |
| **Slide 10** | Clinical & Social Impact | Inclusivity, ESL Learning & Speech Therapy Access |
| **Slide 11** | Future Roadmap | 3D Viseme Avatars, Multi-lingual Alignment, EMR Integration |
| **Slide 12** | Conclusion & Q&A | Summary of Achievements & Live Demo Invite |

---

## Slide 1: Title & Introduction

### Slide Layout
- **Header**: ARTICULATE
- **Subtitle**: Smart AI-Powered Speech Articulation & Pronunciation Trainer
- **Tagline**: *"Democratizing Speech Therapy & Articulation Practice for Everyone"*
- **Presenter Info**: Hackathon Team Project | Frontend + AI Microservice Architecture
- **Visuals**: Centered pastel icon badge with soft lavender accent (`#E8E5F8`)

### Slide Content
> **Articulate** is an accessible, AI-powered speech articulation system designed to help users practice pronunciation, receive instant word-by-word feedback, and track acoustic speech metrics over time.

- **Frontend Stack**: React 19, Vite, Tailwind CSS v4, Recharts, Web Audio API
- **AI Service Stack**: Python 3.12, FastAPI, PyTorch, OpenAI Whisper, Librosa, Praat Parselmouth

### Speaker Notes
> "Good morning everyone. Today we are excited to present **Articulate** — an intelligent, accessible speech articulation training system. Whether you are an ESL learner, a public speaker preparing for a keynote, or an individual undergoing speech therapy, getting precise, real-time feedback on your speech is historically expensive or unavailable. Articulate bridges this gap with an intuitive, accessible frontend and a 9-stage AI analysis pipeline."

---

## Slide 2: Problem Statement

### Slide Layout
- **Title**: The Problem: Barriers in Speech & Articulation Training
- **Three Core Columns**:
  1. **Accessibility & Usability Gaps**
  2. **High Cost & Limited Access**
  3. **Lack of Granular Feedback**

### Slide Content
- **1. Accessibility Exclusions**:
  - Existing speech apps rely heavily on harsh colors (red/green alone), excluding colorblind users.
  - High eye-strain dark modes or crowded, non-linear UIs create barriers for neurodivergent and motor-challenged users.
- **2. High Cost & Therapy Access**:
  - In-person speech therapy costs $100–$250/hour with long waitlists.
  - General language apps give simple "Right/Wrong" binary scores without telling users *how* or *where* their tongue or lips misplaced.
- **3. Superficial Audio Analysis**:
  - Standard speech recognition only transcribes words; it ignores pitch (F0), WPM tempo, pause durations, and Goodness of Pronunciation (GOP) phoneme errors.

### Speaker Notes
> "When looking at existing speech tools, we noticed three critical issues. First, almost every tool fails accessibility standards — using color alone for feedback, tiny tap targets, and high contrast glare. Second, speech therapy is expensive and inaccessible to millions. Third, current consumer apps only tell you IF a word was wrong, but never WHY — ignoring acoustic parameters like pitch drift, forced alignment, and phoneme substitution."

---

## Slide 3: The Solution — Articulate

### Slide Layout
- **Title**: The Solution: Accessible, AI-Driven Speech Training
- **Visual**: 4 Key Pillars Diagram
- **Pillars**:
  - **Accessible Pastel Design**: Soft lavender, sage, blush pink & warm cream palette.
  - **Browser Audio Capture**: Zero third-party audio libs — Web Audio API with PCM-to-WAV conversion.
  - **9-Stage AI Engine**: Real-time Whisper STT + forced alignment + acoustic feature extraction.
  - **Colorblind-Safe Feedback**: Dual feedback pairing colors with distinct icons (✓ Accurate, ⚠️ Warning, ✖ Mispronounced).

### Slide Content
- **End-to-End Seamless Workflow**:
  1. Select tongue twister or assessment passage.
  2. Record audio with live visual waveform and timer.
  3. AI pipeline analyzes acoustic features & forced alignment.
  4. Instant word-by-word color + icon results with actionable tongue/lip guidance.

### Speaker Notes
> "Articulate delivers a full-circle solution. We combined an accessible, low eye-strain pastel UI with an independent, production-ready Python AI microservice. Users get instant visual feedback that doesn't just color-code words, but pairs every word with an icon so colorblind users get 100% equal utility."

---

## Slide 4: Accessibility-First Design System

### Slide Layout
- **Title**: Designed for Accessibility & Inclusivity
- **Grid Layout**:
  - **Pastel Palette**: Soft Lavender (`#E8E5F8`), Sage Green (`#D4ECD5`), Blush Pink (`#FCE4EC`), Warm Cream (`#FAF7F2`).
  - **Colorblind Safe**: Green Check (✓), Orange Alert (⚠️), Red Cross (✖).
  - **Motor Control**: 70px+ record button, minimum 48px tap targets.
  - **Accessibility Controls**: Visible focus rings (`focus-visible:ring-3`), High Contrast toggle, `prefers-reduced-motion` compliance.

### Slide Content
```
Accessibility Feature Matrix:
┌───────────────────────────┬──────────────────────────────────────────────┐
│ Requirement               │ Articulate Implementation                    │
├───────────────────────────┼──────────────────────────────────────────────┤
│ Colorblind Friendliness   │ Dual Indicator System (Color + Icon Badges)  │
│ Low Eye Strain            │ Calming Pastel Palette on Warm Cream Base    │
│ Motor Impairments         │ 70px+ Record Target & Generous Spacing       │
│ Visual Focus              │ Visible 3px Lavender Focus Rings             │
│ Motion Sensitivity        │ Reduced-Motion CSS Media Query Overrides     │
└───────────────────────────┴──────────────────────────────────────────────┘
```

### Speaker Notes
> "Accessibility was our core design driver, not an afterthought. We crafted a pastel color system paired with warm cream backgrounds to prevent glare. For colorblind accessibility, every word evaluation includes explicit icons alongside color fills. Buttons feature large target areas (70px+ for recording), and full keyboard navigation is supported with high-visibility focus indicators."

---

## Slide 5: System Architecture

### Slide Layout
- **Title**: End-to-End System Architecture
- **Architecture Diagram**:

```
[ User Microphone ]
        │
        ▼ (Web Audio API PCM)
[ React 19 Frontend ]
        │
        ▼ (WAV Blob & Target Text)
[ FastAPI AI Microservice ]
        │
  ├── 1. Preprocessing & VAD
  ├── 2. Whisper STT Transcription
  ├── 3. Forced Alignment (DTW / Levenshtein)
  ├── 4. Phoneme Analysis (G2P)
  ├── 5. GOP Pronunciation Scoring
  ├── 6. Acoustic Metrics (Praat & Librosa)
  ├── 7. Feedback & Guidance Engine
  ├── 8. Exercise Recommendation Engine
  └── 9. Response Formatter
        │
        ▼ (Structured JSON Response)
[ React 19 Frontend ]
```

### Speaker Notes
> "Architecturally, the application is divided into two decoupled layers. On the client side, React 19 captures raw 16kHz PCM audio via the Web Audio API and packages it into a RIFF WAV blob. This is sent to our independent Python 3.12 FastAPI microservice. The AI service runs a 9-stage analytical pipeline and responds with a rich JSON payload containing clarity, accuracy, acoustic metrics, and word-level phoneme feedback."

---

## Slide 6: Frontend Technical Deep Dive

### Slide Layout
- **Title**: Frontend Engineering & Audio Pipeline
- **Key Modules**:
  - **`useAudioRecorder.js`**: Web Audio API integration using `AudioContext`, `AnalyserNode`, and `ScriptProcessorNode`.
  - **`wavEncoder.js`**: Pure JavaScript PCM-to-WAV encoder producing RIFF 16-bit PCM WAV blobs.
  - **`Waveform.jsx`**: Real-time `<canvas>` visualizer rendering live audio amplitude.
  - **`client.js`**: Resilient API client with seamless `VITE_USE_MOCK_API` toggle for standalone hackathon demos.

### Technical Highlights
- **Zero Heavy Audio Libraries**: Built directly on native browser Web Audio APIs.
- **Context API State**: Global authentication and high-contrast accessibility context.
- **Tailwind v4 Integration**: Custom utility classes and theme token system.

### Speaker Notes
> "On the frontend, we avoided heavy third-party audio plugins. We implemented a custom PCM-to-WAV encoder directly in JavaScript that formats audio buffers into RIFF-compliant 16-bit WAV files at 16kHz. Furthermore, to ensure presentation resilience, our API client includes an environment toggle (`VITE_USE_MOCK_API`) that allows the frontend to run fully offline with realistic mock data if backend connectivity drops."

---

## Slide 7: AI Backend & 9-Stage Pipeline

### Slide Layout
- **Title**: AI Microservice: 9-Stage Analysis Engine
- **9 Stages Breakdown**:
  1. **Preprocessing**: 16kHz mono resampling, peak normalization, VAD silence trimming.
  2. **Speech-to-Text**: OpenAI Whisper model for accurate transcription & timestamps.
  3. **Forced Alignment**: Dynamic Time Warping (DTW) & Levenshtein distance alignment.
  4. **Phoneme Analysis**: Grapheme-to-Phoneme (G2P) conversion & error detection.
  5. **Goodness of Pronunciation (GOP)**: Posterior probability scoring per phoneme.
  6. **Speech Metrics**: Praat Parselmouth pitch (F0) tracking, WPM tempo, pause frequency.
  7. **Feedback Generator**: Rule-based acoustic guidance engine.
  8. **Exercise Recommender**: Targeted tongue twister & drill suggestions.
  9. **Response Formatter**: Structured Pydantic JSON contract output.

### Speaker Notes
> "The backend microservice is a 9-stage analysis engine built with PyTorch, Whisper, Librosa, and Praat Parselmouth. It goes far beyond standard speech recognition: it calculates Goodness of Pronunciation (GOP) scores, measures fundamental frequency (F0) pitch contour, tracks speaking tempo in WPM, and identifies specific mispronounced phonemes like /R/ or /TH/."

---

## Slide 8: The Core Demo Loop (Exercise Screen)

### Slide Layout
- **Title**: The Core Practice Experience
- **4-State Interactive Flow**:

```
 [1. READY STATE]         [2. RECORDING STATE]        [3. ANALYZING STATE]        [4. RESULTS STATE]
┌──────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐
│ Target Phrase    │     │ Live Canvas         │     │ Hand-Rolled SVG     │     │ Score Cards (90%)   │
│ "She sells..."   │ ──> │ Waveform Animation  │ ──> │ Viseme Mouth        │ ──> │ Color + Icon Badges │
│ Record Button    │     │ Running Timer 00:04 │     │ Analyzing Speech    │     │ (✓ / ⚠️ / ✖)        │
└──────────────────┘     └─────────────────────┘     └─────────────────────┘     └─────────────────────┘
```

### Key UI Features
- **Reference Playback**: Browser SpeechSynthesis TTS audio reference button.
- **Hand-Rolled Viseme SVG**: Pure SVG mouth position visualizer during analysis.
- **Word Pills**: Interactive score tooltips per word.

### Speaker Notes
> "Here is our core demo loop in action. The user sees a target phrase such as 'She sells seashells by the seashore'. Tapping the record button launches a live canvas waveform and timer. Upon stopping, the UI transitions to an analyzing state with a hand-rolled SVG mouth animation. Within seconds, the user receives their Clarity and Accuracy scores, target sound focus badges, and word-by-word color and icon indicators."

---

## Slide 9: Progress & Analytics Dashboard

### Slide Layout
- **Title**: Long-Term Progress Analytics
- **4 Custom Recharts Visualizations**:
  1. **Daily Articulation Score**: Line Chart tracking score improvement over time.
  2. **Phonetic Accuracy Trend**: Area Chart visualizing precision stability.
  3. **Practice Duration**: Bar Chart showing daily practice minutes.
  4. **Streak Heatmap**: CSS Grid activity heatmap highlighting active daily streaks.

### Key Metrics Tracked
- **Total Sessions**: 38 logged sessions
- **Average Score**: 84% overall clarity
- **Best Score**: 98% peak accuracy
- **Practice Volume**: 6+ hours total training

### Speaker Notes
> "To drive long-term habit formation, Articulate includes a rich analytics dashboard powered by Recharts. Users can track their daily score trends on a line chart, monitor phonetic accuracy on an area chart, view practice minutes on a bar chart, and stay motivated with an accessible activity streak heatmap."

---

## Slide 10: Clinical & Social Impact

### Slide Layout
- **Title**: Real-World Impact & Applications
- **Four Key Target Segments**:
  - 🗣️ **Speech Therapy Patients**: Affordable daily practice between therapy sessions.
  - 🌍 **ESL & Language Learners**: Targeted drill practice for foreign sound patterns (e.g. /TH/, /R/, /L/).
  - 🎙️ **Public Speakers & Broadcasters**: Pace, clarity, and articulation refining.
  - ♿ **Physically Challenged Users**: Accessible UI ensuring equitable access to voice technology.

### Key Impact Value Props
- **Democratizing Access**: Free/low-cost daily voice feedback.
- **Objective Metrics**: Data-backed phonetic clarity measurements vs subjective self-assessment.

### Speaker Notes
> "The impact of Articulate spans multiple domains. For speech therapy patients, it provides structured daily practice between clinical visits. For ESL learners, it pinpoint-identifies difficult phoneme substitutions. And for physically challenged individuals, its accessible UI design ensures that advanced speech tools are usable by everyone."

---

## Slide 11: Future Technical Roadmap

### Slide Layout
- **Title**: Future Technical Roadmap
- **3 Development Horizons**:

```
  Phase 1 (Current)              Phase 2 (Near-Term)             Phase 3 (Long-Term)
┌──────────────────────┐       ┌──────────────────────┐        ┌──────────────────────┐
│ • Full React 19 UI   │       │ • Real-Time WebSockets│        │ • Clinical EMR Synch │
│ • 9-Stage AI Engine  │  ──>  │ • 3D Viseme Lip-Sync │   ──>  │ • Multi-Language G2P │
│ • Accessible Pastel  │       │ • Wav2Vec2 Alignment │        │ • Therapist Portal   │
│ • Mock & Real API    │       │ • Custom Phoneme Sets│        │ • Mobile Native Apps │
└──────────────────────┘       └──────────────────────┘        └──────────────────────┘
```

### Speaker Notes
> "Looking forward, our roadmap includes integrating WebSockets for real-time streaming feedback, upgrading to 3D avatar lip-sync visemes, adding multi-lingual G2P support for languages like Spanish and Mandarin, and building a clinical portal where speech therapists can review patient session history."

---

## Slide 12: Conclusion & Q&A

### Slide Layout
- **Title**: Conclusion & Summary
- **Key Takeaways**:
  - ✅ **Complete End-to-End System**: React 19 Frontend + 9-Stage FastAPI AI Microservice.
  - ✅ **Accessibility Standard**: Pastel palette, colorblind icon pairing, motor-friendly tap targets.
  - ✅ **Production Engineering**: Resilient architecture, Web Audio API PCM-to-WAV, Recharts analytics.
- **Call to Action**: "Experience the live demo at `http://localhost:5173/`"
- **Contact / GitHub**: `github.com/venkatengineer/skill_build_articulation`

### Speaker Notes
> "In summary, Articulate combines thoughtful, accessible design with advanced speech AI processing. We invite you to try our live demo and experience the future of accessible speech articulation training. Thank you, and we are now open for any questions!"
