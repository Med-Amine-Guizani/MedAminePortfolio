// A small, deterministic agent that runs entirely in the browser.
// Retrieval is a weighted keyword score over a hand-written knowledge base
// built only from verified facts; no network, no model, no API key.

export type Doc = {
  id: string;
  title: string;
  intent: string;
  keywords: string[];
  text: string;
  answer: string;
  tool: { name: string; arg: string; result: Record<string, unknown> };
  target: string;
  gated?: boolean; // employer work: run an access check first
};

export const KB: Doc[] = [
  {
    id: 'production',
    title: 'Shipped to production at AVOCarbon',
    intent: 'production work',
    keywords: ['production', 'shipped', 'ship', 'live', 'deployed', 'deploy', 'avocarbon', 'derogation', 'approval', 'workflow', 'plant', 'plants', 'current', 'job', 'now', 'work', 'fastapi', 'real', 'users', 'impact', 'value'],
    text: 'derogation management platform in production across plants four roles two level approval notifications responsibility matrices python fastapi sqlalchemy alembic react',
    answer:
      "Amine is a Full-Stack & AI Engineer at AVOCarbon Group (since August 2026). His Derogation Management Platform is in production and supports people across AVOCarbon's plants worldwide. It has four roles, a two-level approval workflow, configurable notifications, and responsibility matrices you can configure per plant. Built with Python, FastAPI, SQLAlchemy, Alembic and React.",
    tool: { name: 'get_project', arg: 'derogation-platform', result: { status: 'production', roles: 4, approval_levels: 2, stack: 'FastAPI · SQLAlchemy · Alembic · React' } },
    target: 'project-derogation',
    gated: true,
  },
  {
    id: 'agent',
    title: 'Role-based intelligence agent (LangGraph)',
    intent: 'agent engineering',
    keywords: ['langgraph', 'agent', 'agents', 'agentic', 'orchestration', 'newsletter', 'memo', 'rbac', 'access', 'role', 'roles', 'reason', 'reasoning', 'building', 'development', 'python', 'ai'],
    text: 'langgraph agent correlates weekly operational data from several internal systems reasons about what changed stagnating blocked risk opportunity role specific memo access control in development',
    answer:
      "He's building a LangGraph agent in Python that correlates weekly operational data from several internal systems. It reasons about what changed, what's stagnating, what's blocked, and which risk or opportunity is emerging. It then writes a memo for each role, and role-based access control decides what each reader may see. It's in active development, and you can try the role switcher on the page.",
    tool: { name: 'get_project', arg: 'intelligence-agent', result: { status: 'in development', framework: 'LangGraph', access: 'role-based' } },
    target: 'project-agent',
    gated: true,
  },
  {
    id: 'rag',
    title: 'RAG and tool calling',
    intent: 'retrieval & tool use',
    keywords: ['rag', 'retrieval', 'tool', 'tools', 'calling', 'function', 'vector', 'semantic', 'search', 'llm', 'llms', 'chatbot', 'conversational', 'grounded', 'ai', 'genai', 'generative'],
    text: 'conversational agent rag tool calling nestjs live configuration json patch sync redis human in the loop semantic vector search duplicates llm resume scoring structured json',
    answer:
      'At Cognira he integrated a conversational agent with RAG and tool calling into a NestJS backend. The agent works on live configuration JSON through structured tool calls and patch synchronization with the UI, uses Redis sessions, and keeps a human in the loop. At Capgemini he built LLM-based resume scoring with structured JSON output, plus semantic vector search to catch duplicate projects.',
    tool: { name: 'get_skill', arg: 'rag+tool-calling', result: { verified_at: ['Cognira', 'Capgemini'], pattern: 'retrieve → ground → act' } },
    target: 'retrieval',
  },
  {
    id: 'cognira',
    title: 'Cognira · Configuration Studio (final-year project)',
    intent: 'experience lookup',
    keywords: ['cognira', 'promoai', 'configuration', 'studio', 'low-code', 'lowcode', 'redux', 'pfe', 'final', 'internship', 'metric', 'metrics', 'numbers', 'results', 'percent', 'retail', 'startup', 'atlanta'],
    text: 'configuration studio four click ui replaced gitops 60 percent faster client enhancement delivery 20 percent fewer re-renders propagation engine deviation detection',
    answer:
      'For his final-year project at Cognira (an Atlanta-based AI retail startup, Tunis R&D), Amine built Configuration Studio for PromoAI. It replaced GitOps file editing with a four-click UI, delivering client enhancement requests 60% faster, and cut re-renders by 20%. He also added a propagation engine with deviation detection and the RAG + tool-calling agent.',
    tool: { name: 'get_experience', arg: 'cognira', result: { when: 'Feb–Jun 2026', metrics: ['-60% delivery time', '-20% re-renders'] } },
    target: 'stint-cognira',
  },
  {
    id: 'capgemini',
    title: 'Capgemini Engineering internship',
    intent: 'experience lookup',
    keywords: ['capgemini', 'hr', 'spring', 'boot', 'security', 'jwt', 'java', 'kanban', 'resume', 'scoring', 'angular', 'internship'],
    text: 'internship lifecycle platform email intake kanban llm resume analysis scoring json semantic search spring boot spring security jwt rbac angular',
    answer:
      "At Capgemini Engineering (Jun–Aug 2025) he built a platform covering the whole internship lifecycle: email intake, a Kanban board, LLM-based scoring of each application as structured JSON, interview scheduling, onboarding, supervision and archiving. The backend is Spring Boot + Spring Security (JWT, RBAC) and the front end is Angular.",
    tool: { name: 'get_experience', arg: 'capgemini', result: { when: 'Jun–Aug 2025', stack: 'Spring Boot · Angular' } },
    target: 'stint-capgemini',
  },
  {
    id: 'bs',
    title: 'BS Automation internship',
    intent: 'experience lookup',
    keywords: ['bs', 'automation', 'robot', 'robots', 'cobot', 'cobots', 'c++', 'cpp', 'factory', 'german', 'industrial', 'scrum'],
    text: 'collaborative robots setup low-code multi-step workflows c++ angular german client scrum',
    answer:
      'At BS Automation (summer 2024) he wrote C++ features and Angular interfaces for a low-code platform that makes collaborative robots easier to install and set up in factories. He also worked with a German client on specifications and acceptance criteria.',
    tool: { name: 'get_experience', arg: 'bs-automation', result: { when: 'Jul–Aug 2024', stack: 'C++ · Angular' } },
    target: 'stint-bs-automation',
  },
  {
    id: 'auveillese',
    title: 'Auveillese freelance',
    intent: 'experience lookup',
    keywords: ['auveillese', 'freelance', 'hotel', 'hotels', 'energy', 'portugal', 'remote', 'nestjs'],
    text: 'freelance full-stack javascript nestjs react hotel platforms reservations energy consumption monitoring remote portugal',
    answer:
      'As a remote freelancer for Auveillese, a Portugal-based company (Jun–Jul 2026), he built NestJS backend features and React interfaces for hotel platforms, from reservations to energy consumption monitoring.',
    tool: { name: 'get_experience', arg: 'auveillese', result: { when: 'Jun–Jul 2026', mode: 'remote' } },
    target: 'stint-auveillese',
  },
  {
    id: 'education',
    title: 'Education',
    intent: 'education',
    keywords: ['education', 'graduate', 'graduated', 'graduation', 'degree', 'school', 'university', 'enicarthage', 'engineering', 'study', 'studied', 'ipein', 'diploma', 'student'],
    text: 'national school of engineering of carthage software engineering 2023 2026 national engineering degree preparatory institute nabeul physics',
    answer:
      'He graduated in July 2026 from ENICarthage (National School of Engineering of Carthage) with a national engineering degree in Software Engineering. Before that he spent two years at the Nabeul Preparatory Engineering Institute studying Physics & Technology.',
    tool: { name: 'get_education', arg: 'all', result: { degree: 'Software Engineering', school: 'ENICarthage', graduated: 'July 2026' } },
    target: 'origin',
  },
  {
    id: 'stack',
    title: 'Technical stack',
    intent: 'skills',
    keywords: ['stack', 'skills', 'skill', 'technologies', 'technology', 'tools', 'tech', 'python', 'typescript', 'javascript', 'react', 'fastapi', 'nestjs', 'docker', 'kubernetes', 'postgresql', 'sql', 'frontend', 'backend', 'fullstack', 'full-stack'],
    text: 'langgraph rag tool calling python typescript java react redux angular fastapi nestjs spring boot postgresql redis mongodb docker kubernetes ci cd github actions',
    answer:
      'AI: LangGraph, agent orchestration, RAG, tool calling, LLM scoring, vector search. Languages: Python, TypeScript, JavaScript, Java, C/C++. Front end: React, Redux Toolkit, Angular. Back end: FastAPI, NestJS, Node/Express, Spring Boot. Data: PostgreSQL, SQLAlchemy, Alembic, Oracle, MySQL, MongoDB, Redis. Ops: Docker, Kubernetes, CI/CD, GitHub Actions.',
    tool: { name: 'list_skills', arg: 'all', result: { groups: 6, top: 'LangGraph · FastAPI · React' } },
    target: 'stack',
  },
  {
    id: 'lab',
    title: 'Side projects',
    intent: 'projects',
    keywords: ['project', 'projects', 'side', 'personal', 'watchwise', 'movie', 'recommendation', 'smart', 'city', 'microservices', 'grpc', 'graphql', 'soap', 'github', 'portfolio', 'mern'],
    text: 'watchwise mern movie platform recombee recommendations smart city shield microservices spring cloud rest graphql soap grpc docker',
    answer:
      'Two side projects stand out. WatchWise is a MERN movie platform with JWT auth, TMDB caching and a customized Recombee recommendation engine (live demo available). Smart City Shield is a Spring Cloud microservices system that talks REST, GraphQL, SOAP and gRPC behind an API gateway.',
    tool: { name: 'list_projects', arg: 'lab', result: { count: 2, links: ['watch-wise-pink.vercel.app'] } },
    target: 'lab',
  },
  {
    id: 'contact',
    title: 'Contact',
    intent: 'contact',
    keywords: ['contact', 'email', 'mail', 'hire', 'hiring', 'reach', 'phone', 'call', 'linkedin', 'talk', 'interview', 'available', 'availability', 'message', 'recruit', 'recruiter', 'cv', 'resume'],
    text: 'email amineguizani33@gmail.com linkedin github phone tunis',
    answer: 'Best way to reach him is by email at amineguizani33@gmail.com, or on LinkedIn. I just scrolled you to the contact section, where you can copy the address in one click.',
    tool: { name: 'get_contact', arg: 'preferred', result: { email: 'amineguizani33@gmail.com' } },
    target: 'contact',
  },
  {
    id: 'languages',
    title: 'Spoken languages & location',
    intent: 'languages & location',
    keywords: ['language', 'languages', 'speak', 'english', 'french', 'arabic', 'german', 'toeic', 'where', 'based', 'location', 'live', 'relocate', 'relocation', 'tunis', 'tunisia', 'country'],
    text: 'arabic native english advanced toeic 915 french upper-intermediate german a2 tunis tunisia open to relocation',
    answer:
      'He is based in Tunis, Tunisia, and open to relocation. He speaks Arabic (native), English (advanced, TOEIC 915/990), French (upper-intermediate) and German (A2).',
    tool: { name: 'get_profile', arg: 'languages', result: { english: 'TOEIC 915/990', location: 'Tunis' } },
    target: 'contact',
  },
  {
    id: 'why',
    title: 'Why Amine',
    intent: 'summary',
    keywords: ['why', 'who', 'about', 'summary', 'strength', 'strengths', 'best', 'good', 'should', 'tell', 'amine', 'him', 'overview', 'introduce'],
    text: 'full-stack ai engineer production agents rag tool calling',
    answer:
      "Short version: he's a Full-Stack AI Engineer who ships. He's already in production at AVOCarbon with software used across plants worldwide, he's building a LangGraph agent with role-based access, and he has a track record of RAG + tool-calling work and measurable results (60% faster delivery, 20% fewer re-renders at Cognira). He covers the whole stack, from FastAPI and NestJS to React.",
    tool: { name: 'summarize_profile', arg: 'visitor', result: { role: 'Full-Stack AI Engineer', employer: 'AVOCarbon Group' } },
    target: 'hero',
  },
];

export const SUGGESTIONS = [
  'What has Amine shipped to production?',
  'Show me his RAG work',
  'How does his LangGraph agent work?',
  'What were his results at Cognira?',
  'Why should we hire him?',
];

const STOP = new Set(['the', 'a', 'an', 'is', 'are', 'of', 'to', 'in', 'on', 'and', 'or', 'me', 'his', 'he', 'what', 'does', 'did', 'do', 'has', 'have', 'how', 'with', 'for', 'show', 'about', 'can', 'you', 'i', 'it', 'at', 'was', 'were', 'tell']);

function tokens(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9+#\s-]/g, ' ')
    .split(/\s+/)
    .filter((t) => t && !STOP.has(t))
    .map((t) => (t.length > 4 && t.endsWith('s') ? t.slice(0, -1) : t));
}

export type Hit = { doc: Doc; score: number };

export function retrieve(query: string): Hit[] {
  const q = tokens(query);
  if (!q.length) return [];
  return KB.map((doc) => {
    const kw = new Set(doc.keywords.map((k) => (k.length > 4 && k.endsWith('s') ? k.slice(0, -1) : k)));
    const title = tokens(doc.title);
    const body = tokens(doc.text);
    let score = 0;
    for (const t of q) {
      if (kw.has(t)) score += 3;
      if (title.includes(t)) score += 2;
      if (body.includes(t)) score += 1;
      // partial matches catch "langgraph's", "deploying", etc.
      else if (t.length > 4 && body.some((b) => b.startsWith(t.slice(0, 5)))) score += 0.5;
    }
    return { doc, score: score / Math.sqrt(q.length) };
  })
    .filter((h) => h.score > 0)
    .sort((a, b) => b.score - a.score);
}
