/**
 * src/content.js
 * ─────────────────────────────────────────────────────────────────
 * Single source of truth for ALL copy, links and data.
 * Components NEVER hardcode copy — they import from here.
 * Facts are sourced exclusively from GEMINI.md / public/resume.pdf.
 * ─────────────────────────────────────────────────────────────────
 */

// ── Identity ──────────────────────────────────────────────────────
export const IDENTITY = {
  name:     'Wolf',
  github:   'Ish-code1',
  tagline:  'AI/ML · GenAI · MLOps · Software · Communicator',
  concept:  'Neural Control Room',
  photo:    '/photo.jpeg',
  resume:   '/resume.pdf',
  githubUrl:'https://github.com/Ish-code1',
  linkedin: 'https://linkedin.com/in/placeholder',   // placeholder
  email:    'hello@placeholder.dev',                  // placeholder
}

// ── Domain accent palette (mirrors tailwind.config.js) ───────────
export const DOMAIN_COLORS = {
  aiml:     '#00e5ff',
  genai:    '#a855f7',
  mlops:    '#10b981',
  software: '#f97316',
  comms:    '#f59e0b',
}

// ── Nav links ─────────────────────────────────────────────────────
export const NAV_LINKS = [
  { label: 'AI & ML',       href: '/ai-ml',         color: DOMAIN_COLORS.aiml     },
  { label: 'GenAI',         href: '/genai',          color: DOMAIN_COLORS.genai    },
  { label: 'MLOps',         href: '/mlops',          color: DOMAIN_COLORS.mlops    },
  { label: 'Software',      href: '/software',       color: DOMAIN_COLORS.software },
  { label: 'Communication', href: '/communication',  color: DOMAIN_COLORS.comms    },
  { label: 'Projects',      href: '/projects',       color: '#e2e8f0'              },
  { label: 'Contact',       href: '/contact',        color: '#e2e8f0'              },
]

// ── Projects ──────────────────────────────────────────────────────
export const PROJECTS = [
  {
    id:    'finsight',
    title: 'FinSight',
    subtitle: 'AI financial advisor that remembers you',
    event:    'HackCBS 9.0',
    tags:  ['GenAI', 'Software', 'MLOps'],
    accent: DOMAIN_COLORS.genai,
    description:
      "Tool-calling Gemini agent with 8 tools. Recalls the user's rules and past decisions via Meko memory over MCP, then runs deterministic engines (stress tests, breaking-point search, investment checks) so the LLM never invents a number. Earnings-call quotes verified word-for-word against the transcript. Voice in English, Hindi, Hinglish; model fallbacks; 86 backend tests + 13 Playwright tests.",
    stack:   ['Gemini API', 'MCP', 'Meko memory', 'FastAPI', 'Playwright'],
    role:    'Full-stack AI engineer — agent design, tool orchestration, voice pipeline, testing',
    metrics: [
      { label: 'Backend tests',  value: 86 },
      { label: 'Playwright tests', value: 13 },
    ],
    links: {
      github:   'https://github.com/aviralMadhvan24/The-Hacktivists-HackCBS',
      demo:     'https://drive.google.com/file/d/1ap9Bzbdc12UOxQm4x0YBr_k3RUwkigfo/view?usp=drive_link',
      linkedin: 'https://lnkd.in/p/gF_m2nHy',
    },
  },
  {
    id:    'lablens',
    title: 'LabLens',
    subtitle: 'Gesture-controlled virtual chemistry lab',
    event:    null,
    tags:  ['AI/ML', 'GenAI', 'Software'],
    accent: DOMAIN_COLORS.aiml,
    description:
      'Hands-free chemistry lab for Class 11–12 students using OpenCV + MediaPipe, FastAPI, SQL and a graph DB. Explanations grounded in an NCERT + previous-year-paper knowledge base to cut hallucinations.',
    stack:   ['OpenCV', 'MediaPipe', 'FastAPI', 'SQL', 'Graph DB', 'RAG'],
    role:    'End-to-end builder — gesture pipeline, knowledge-base RAG, backend API',
    metrics: [],
    links: {
      github: 'https://github.com/Ish-code1/LabLens_V2',
      demo:   'https://drive.google.com/file/d/1Hpek2lFzPvBEQKeTP1VeXVGOEabiih9y/view?usp=sharing',
    },
  },
  {
    id:    'malhaar',
    title: 'Malhaar',
    subtitle: 'Multilingual AI Farmer Assistant',
    event:    null,
    tags:  ['GenAI', 'AI/ML', 'Software'],
    accent: DOMAIN_COLORS.genai,
    description:
      'Voice-first Telegram bot (English + Malayalam) for crop disease diagnosis from voice and image. FastAPI, Gemini API, Google Cloud STT/TTS, graph-native conversation memory in Neo4j (UserProfile → Session → Message) feeding Gemini for personalised recommendations.',
    stack:   ['Gemini API', 'Google Cloud STT/TTS', 'FastAPI', 'Neo4j', 'Telegram Bot API'],
    role:    'Architecture, multilingual voice pipeline, Neo4j memory graph, Gemini integration',
    metrics: [],
    links: {
      github:   'https://github.com/Ish-code1/Malhaar---Multilingual-AI-Farmer-Assistant-',
      linkedin: 'https://lnkd.in/p/ebZ2hSE2',
    },
  },
  {
    id:    'gesture-games',
    title: 'Real-time Gesture Control for Games',
    subtitle: 'Touchless controller with zero game modifications',
    event:    null,
    tags:  ['AI/ML'],
    accent: DOMAIN_COLORS.aiml,
    description:
      'Touchless controller that plugs into an existing game with zero game changes. Webcam → MediaPipe (21 hand landmarks) → custom gesture-intent logic → keyboard/mouse events via PyDirectInput + AutoPy. Deployed on Hill Climb Racing (open palm = accelerate, fist = brake, index finger = cursor, thumbs up = click). ~30–40 ms end-to-end latency; robust to hand size, angle, lighting.',
    stack:   ['Python', 'OpenCV', 'MediaPipe', 'PyDirectInput', 'AutoPy', 'NumPy'],
    role:    'Solo build — gesture model, intent logic, event injection, latency optimisation',
    metrics: [
      { label: 'End-to-end latency', value: '30–40 ms' },
      { label: 'Hand landmarks', value: 21 },
    ],
    links: {
      github: 'https://github.com/Ish-code1/AI-Driven-Gesture-Control-for-Games',
      demo:   'https://lnkd.in/p/eJxibfBN',
    },
  },
]

// ── Hackathons ────────────────────────────────────────────────────
export const HACKATHONS = [
  {
    placement: 'Top 6',
    name:      'HackCBS 9.0',
    scope:     null,
    team:      null,
    project:   'finsight',
  },
  {
    placement: 'Top 15 Finalist',
    name:      'India AI Impact Festival',
    scope:     'National',
    team:      'Individual',
    project:   null,
  },
  {
    placement: 'Top 50 Worldwide',
    name:      "Namespace Hackhazards '26",
    scope:     'Global',
    team:      'Team of 4',
    project:   null,
  },
  {
    placement: '3rd Runner Up',
    name:      'AI Arena Gotham Edition',
    scope:     'National',
    team:      'Team of 4',
    project:   null,
  },
]

// ── Domain pages ──────────────────────────────────────────────────
export const DOMAINS = {
  aiml: {
    slug:    'ai-ml',
    label:   'AI & ML Engineering',
    color:   DOMAIN_COLORS.aiml,
    tagline: 'From raw data to deployable intelligence.',
    skills:  [
      'ML Workflows',
      'Model Development',
      'Data Preprocessing',
      'Computer Vision',
      'Deep Learning',
      'Predictive Modelling',
    ],
    projects: ['lablens', 'gesture-games'],
  },
  genai: {
    slug:    'genai',
    label:   'GenAI & LLM Apps',
    color:   DOMAIN_COLORS.genai,
    tagline: 'Grounded, agentic, multilingual LLM systems.',
    skills:  [
      'LLM APIs',
      'RAG',
      'LangChain',
      'Knowledge-Graph Retrieval (Neo4j)',
      'Multilingual AI',
      'Conversational AI',
    ],
    projects: ['finsight', 'lablens', 'malhaar'],
  },
  mlops: {
    slug:    'mlops',
    label:   'MLOps & Deployment',
    color:   DOMAIN_COLORS.mlops,
    tagline: 'Ship models, not notebooks.',
    skills:  [
      'Experiment Tracking',
      'Model Management',
      'API Model Serving',
      'Docker',
      'CI/CD',
    ],
    projects: ['finsight'],
  },
  software: {
    slug:    'software',
    label:   'Software & Backend',
    color:   DOMAIN_COLORS.software,
    tagline: 'Robust APIs and data layers powering every project.',
    skills:  [
      'Python',
      'C++',
      'SQL',
      'FastAPI',
      'MySQL',
      'Neo4j',
      'Firestore',
      'REST APIs',
    ],
    projects: ['finsight', 'lablens', 'malhaar'],
  },
  comms: {
    slug:    'communication',
    label:   'Communication & Leadership',
    color:   DOMAIN_COLORS.comms,
    tagline: 'Where technical depth meets human impact.',
    highlights: [
      'Public speaking & event anchoring',
      'International Education Awareness Week — anchored + managed logistics',
      'Technical presentations',
      'Mentoring',
      'PR Head, Kriva ML Society',
      'E-Booster Mentor',
      'Campus Ambassador, KIET',
      'Dept of PR & International Relations',
    ],
    aiGeneralist: {
      title:  'AI Generalist — Model Evaluation',
      areas:  [
        'Response quality',
        'Factual accuracy',
        'Reasoning',
        'Code outputs',
      ],
    },
    projects: [],
  },
}

// ── Interaction / counters ────────────────────────────────────────
export const COUNTERS = [
  { label: 'Backend tests (FinSight)',    value: 86,  suffix: '' },
  { label: 'Playwright tests (FinSight)', value: 13,  suffix: '' },
  { label: 'Gesture latency',            value: 40,  suffix: 'ms', prefix: '~' },
  { label: 'Hand landmarks',             value: 21,  suffix: '' },
  { label: 'Hackathons',                 value: 4,   suffix: '' },
]

// ── Home page copy ────────────────────────────────────────────────
export const HOME = {
  heroHeading:  'Neural Control Room',
  heroSubhead:  'AI/ML · GenAI · MLOps · Software · Communication',
  heroCta:      'Enter the Grid',
  featuredLabel:'Featured Projects',
  hackathonsLabel: 'Competition Record',
  ctaHeading:   "Let's build something that thinks.",
  ctaButton:    'Get in touch',
}

// ── Contact page ──────────────────────────────────────────────────
export const CONTACT = {
  heading:     'Open a channel.',
  subheading:  'Reach out for collaborations, opportunities or a good AI debate.',
  githubUrl:   IDENTITY.githubUrl,
  linkedin:    IDENTITY.linkedin,
  email:       IDENTITY.email,
  resume:      IDENTITY.resume,
  resumeLabel: 'Download Résumé',
}
