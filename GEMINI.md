# Portfolio: Ishita Saxena (GitHub: Ish-code1)

ROLE: Senior creative frontend engineer + WebGL designer. Build an award-style, multipage, interactive portfolio.

## Rules
- Facts come ONLY from this file, public/resume.pdf and public/photo.jpg. Never invent anything, including metrics.
- My name on the site must be exactly as written on resume.pdf, not any nickname.
- Photo: keep my face exactly as is. No AI alteration. Style around it only (duotone/glitch hover, 3D tilt, particle halo, masked reveal).
- ALL copy, links and project data live in src/content.js. Components never hardcode copy.
- Work on ONE step at a time when told. Output full files. After each step, stop and give a 5-line summary.
- If a command is needed, tell me the exact command to run.

## Stack
Vite + React + React Router, Three.js via @react-three/fiber and drei, GSAP (ScrollTrigger), Lenis smooth scroll, Tailwind. GSAP page transitions. No backend.

## Concept
Cohesive futuristic "neural control room". Each domain has its own accent color, 3D scene and motion language, on a shared design system (type scale, grid, cursor, nav).

## Routes
- / Home: WebGL hero (neural mesh reacting to cursor), photo, name, tagline, 4 domain portals + communication portal, featured projects, hackathons, CTA
- /ai-ml AI & ML Engineering: ML workflows, model development, preprocessing, computer vision, deep learning, predictive modelling
- /genai GenAI & LLM Apps: LLM APIs, RAG, LangChain, knowledge-graph retrieval (Neo4j), multilingual/conversational AI
- /mlops MLOps & Deployment: experiment tracking, model management, API model serving, Docker, CI/CD. Animated pipeline visual
- /software Software & Backend: Python, C++, SQL, FastAPI, MySQL, Neo4j, Firestore, REST APIs. Animated architecture map
- /communication Communication & Leadership: visually distinct (warm palette, stage/spotlight/soundwave). Public speaking, event anchoring (International Education Awareness Week: anchored + managed logistics), technical presentations, mentoring, PR Head @ Kriva ML Society, E-Booster Mentor, Campus Ambassador @ KIET, Dept of PR & International Relations. Also AI Generalist (model evaluation: response quality, factual accuracy, reasoning, code outputs). Includes hackathons section.
- /projects Filterable grid by domain tag; each opens a detail view (route or animated modal): problem, stack, my role, approach, results, links
- /contact Resume download, GitHub https://github.com/Ish-code1, LinkedIn (placeholder), email (placeholder)

Each domain page lists its project names as clickable chips that open that project's detail view.

## Projects (use ONLY these)
1. FinSight: AI financial advisor that remembers you (HackCBS 9.0). Tags: GenAI, Software, MLOps.
   Tool-calling Gemini agent with 8 tools. Recalls user's rules and past decisions via Meko memory over MCP, then runs deterministic engines (stress tests, breaking-point search, investment checks) so the LLM never invents a number. Earnings-call quotes verified word-for-word against the transcript. Voice in English, Hindi, Hinglish; model fallbacks; 86 backend tests + 13 Playwright tests.
   GitHub https://github.com/aviralMadhvan24/The-Hacktivists-HackCBS | Demo https://drive.google.com/file/d/1ap9Bzbdc12UOxQm4x0YBr_k3RUwkigfo/view?usp=drive_link | LinkedIn https://lnkd.in/p/gF_m2nHy

2. LabLens: gesture-controlled virtual chemistry lab. Tags: AI/ML, GenAI, Software.
   Hands-free chemistry lab for Class 11-12 students using OpenCV + MediaPipe, FastAPI, SQL and a graph DB. Explanations grounded in an NCERT + previous-year-paper knowledge base to cut hallucinations.
   GitHub https://github.com/Ish-code1/LabLens_V2 | Demo https://drive.google.com/file/d/1Hpek2lFzPvBEQKeTP1VeXVGOEabiih9y/view?usp=sharing

3. Malhaar: Multilingual AI Farmer Assistant. Tags: GenAI, AI/ML, Software.
   Voice-first Telegram bot (English + Malayalam) for crop disease diagnosis from voice and image. FastAPI, Gemini API, Google Cloud STT/TTS, graph-native conversation memory in Neo4j (UserProfile > Session > Message) feeding Gemini for personalised recommendations.
   GitHub https://github.com/Ish-code1/Malhaar---Multilingual-AI-Farmer-Assistant- | LinkedIn & Demo https://lnkd.in/p/ebZ2hSE2

4. Real-time Gesture Control for Games. Tags: AI/ML.
   Touchless controller that plugs into an existing game with zero game changes. Webcam > MediaPipe (21 hand landmarks) > custom gesture-intent logic > keyboard/mouse events via PyDirectInput + AutoPy. Deployed on Hill Climb Racing (open palm = accelerate, fist = brake, index finger = cursor, thumbs up = click). ~30-40 ms end-to-end latency; robust to hand size, angle, lighting. Python, OpenCV, NumPy.
   GitHub https://github.com/Ish-code1/AI-Driven-Gesture-Control-for-Games | Demo https://lnkd.in/p/eJxibfBN

## Hackathons
- Top 6, HackCBS 9.0
- Top 15 finalist, India AI Impact Festival (national, individual)
- Top 50 worldwide, Namespace Hackhazards '26 (team of 4)
- 3rd Runner Up, AI Arena Gotham Edition (national, team of 4)

## Interaction
Custom cursor, scroll-scrubbed GSAP timelines, magnetic buttons, 3D card hover, split-text reveals, animated counters (86 + 13 tests, 30-40 ms), sticky nav shifting to active domain color, one easter egg (gesture/hand-landmark theme).

## Constraints
60fps, lazy-load 3D per route, dispose on unmount, DPR cap, mobile fallback (lighter scenes/CSS), prefers-reduced-motion, semantic HTML, keyboard accessible, strong Lighthouse, responsive to 360px.
