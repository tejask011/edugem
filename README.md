# EduGemini - AI-Powered Personal Tutor

<img width="1908" height="915" alt="image" src="https://github.com/user-attachments/assets/e2e243d3-b00e-4d3b-b277-f1f5d42a3716" />


EduGemini is an advanced AI agent designed to help students study smarter by transforming handwritten notes into organized knowledge and providing a real-time conversational tutor interface.

## 🚀 Hackathon Criteria Checklist
- **Gemini Model**: Uses `gemini-1.5-flash` for multimodal reasoning and `gemini-2.5-flash-preview-tts` for audio.
- **Google GenAI SDK/ADK**: Built exclusively with **Google Genkit**.
- **Google Cloud Usage**: Directly calls Google Cloud Gemini API endpoints (verified in `src/ai/genkit.ts`).

## ✨ Features
- **Multimodal Note Scanner**: Capture handwritten notes via camera; AI transcribes and summarizes them instantly.
- **AI Workspace**: Real-time chat with a context-aware tutor that understands your specific study materials.
- **Voice Mode**: Integrated Text-to-Speech (TTS) for an interactive, hands-free learning experience.
- **Study Vault**: A library to manage all scanned notes and summaries.

## 🛠️ Tech Stack
- **Framework**: Next.js 15 (React 19)
- **AI Orchestration**: Google Genkit
- **LLM**: Google Gemini 1.5 Flash
- **Audio**: Google Gemini TTS
- **Styling**: Tailwind CSS & ShadCN UI
- **Deployment**: Vercel (Front-end) & Google Cloud (AI Services)

## 🏗️ Architecture

<img width="3613" height="3480" alt="React Dashboard Integration-2026-03-16-174447" src="https://github.com/user-attachments/assets/a09d2c5c-151e-417c-be27-fede9f602f92" />

1. **Frontend**: React Dashboard handles camera/microphone access.
2. **Backend**: Next.js Server Actions call Genkit Flows.
3. **AI Layer**: Genkit orchestrates prompts and calls the Google Gemini API.
4. **Cloud**: All AI inference is performed on Google Cloud infrastructure via the Gemini API.

## 🏃‍♂️ Spin-up Instructions (Local Development)
1. **Prerequisites**: Install [Node.js](https://nodejs.org/) (v18+).
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Environment Variables**: Create a `.env` file in the root directory and add your API key:
   ```env
   GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
   ```
4. **Run the App**:
   ```bash
   npm run dev
   ```


## 📂 Proof of Google Cloud Usage (Option 2)
This project calls Google Cloud AI services directly. See the following files for proof:
- `src/ai/genkit.ts`: Initialization of the Google AI plugin.
- `src/ai/flows/scan-and-summarize-notes.ts`: Vision-based API calls to Gemini.
- `src/ai/flows/text-to-speech.ts`: Audio-based API calls to Gemini TTS.




---
*Created for the Google Gemini AI Hackathon.*

https://1drv.ms/v/c/4ff61588883eb20c/IQCclbIcqxrOTqgagDjzOcc7ARZMrFELVUaXc5Xuzt8MBDY?e=APwCeM
