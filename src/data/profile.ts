// Single source of truth for every claim on the site.
// Facts come from Resume/my_experiences.md — do not add anything unverified.

export const person = {
  fullName: 'Mohamed Amine Guizani',
  shortName: 'Amine Guizani',
  title: 'Full-Stack AI Engineer',
  location: 'Tunis, Tunisia',
  email: 'amineguizani33@gmail.com',
  phone: '(+216) 95 954 110',
  phoneHref: 'tel:+21695954110',
  linkedin: 'https://www.linkedin.com/in/mohamed-amine-guizani/',
  github: 'https://github.com/Med-Amine-Guizani',
  current: 'Full-Stack & AI Engineer @ AVOCarbon',
  languages: [
    ['Arabic', 'native'],
    ['English', 'advanced · TOEIC 915/990'],
    ['French', 'upper-intermediate'],
    ['German', 'A2'],
  ] as const,
};

export const chapters = [
  { id: 'hero', label: 'Signal' },
  { id: 'origin', label: 'Origin' },
  { id: 'journey', label: 'Journey' },
  { id: 'retrieval', label: 'Retrieval' },
  { id: 'production', label: 'Production' },
  { id: 'lab', label: 'Lab' },
  { id: 'stack', label: 'Toolbelt' },
  { id: 'contact', label: 'Next' },
] as const;

export type Stint = {
  id: string;
  company: string;
  role: string;
  when: string;
  where: string;
  blurb: string;
  points: string[];
  tags: string[];
  metrics?: { value: number; suffix: string; label: string }[];
};

export const journey: Stint[] = [
  {
    id: 'bs-automation',
    company: 'BS Automation',
    role: 'Software Engineering Intern',
    when: 'Jul — Aug 2024',
    where: 'Tunisia',
    blurb: 'Making collaborative robots easy to set up on a factory floor.',
    points: [
      'C++ features for a cobot installation & setup platform',
      'Angular interfaces for multi-step low-code workflows',
      'Clarified specs and acceptance criteria with a German client',
    ],
    tags: ['C++', 'Angular', 'Low-code', 'Scrum'],
  },
  {
    id: 'capgemini',
    company: 'Capgemini Engineering',
    role: 'Software Engineering Intern',
    when: 'Jun — Aug 2025',
    where: 'Tunis',
    blurb: 'An entire internship lifecycle, from inbox to archive, in one platform.',
    points: [
      'Email intake pipeline feeding a Kanban board for HR',
      'LLM pipeline that reads each application and scores fit as structured JSON',
      'Semantic vector search to catch duplicate projects',
      'Spring Boot + Spring Security (JWT, RBAC) and an Angular front',
    ],
    tags: ['Spring Boot', 'Angular', 'LLM scoring', 'Vector search'],
  },
  {
    id: 'cognira',
    company: 'Cognira',
    role: 'Software Engineering Intern · Final-year project',
    when: 'Feb — Jun 2026',
    where: 'Tunis R&D · Atlanta-based AI retail startup',
    blurb: 'Configuration Studio for PromoAI: GitOps file editing became four clicks.',
    points: [
      'Low-code configuration platform with a propagation engine and deviation detection',
      'Conversational agent (RAG + tool calling) in NestJS, operating on live configuration JSON',
      'Patch-based sync between the agent and the UI, human kept in the loop',
      'Redis sessions for concurrent multi-user workflows',
    ],
    tags: ['React', 'Redux Toolkit', 'NestJS', 'RAG', 'Tool calling', 'Redis'],
    metrics: [
      { value: 60, suffix: '%', label: 'faster delivery of client enhancement requests' },
      { value: 20, suffix: '%', label: 'fewer re-renders on large configuration trees' },
    ],
  },
  {
    id: 'auveillese',
    company: 'Auveillese',
    role: 'Freelance Full-Stack Developer',
    when: 'Jun — Jul 2026',
    where: 'Portugal · remote',
    blurb: 'Hotel platforms covering everything from reservations to energy consumption.',
    points: ['NestJS backend tasks', 'React interfaces for hotel operations and energy monitoring'],
    tags: ['NestJS', 'React', 'JavaScript'],
  },
];

export const avocarbon = {
  company: 'AVOCarbon Group',
  role: 'Full-Stack & AI Engineer',
  since: 'August 2026',
  derogation: {
    name: 'Derogation Management Platform',
    status: 'production' as const,
    summary:
      'A request and approval platform with four roles, a two-level approval workflow, configurable notifications and per-plant responsibility matrices.',
    stack: ['Python', 'FastAPI', 'SQLAlchemy', 'Alembic', 'React'],
  },
  agent: {
    name: 'Role-Based Intelligence Agent',
    status: 'development' as const,
    summary:
      'A LangGraph agent that correlates weekly operational data from several internal systems and reasons about what changed, what is stagnating, what is blocked, and which risk or opportunity is emerging. It then writes a memo for each role, and access control decides what each reader may see.',
    stack: ['Python', 'LangGraph', 'Agent orchestration', 'RBAC'],
  },
};

export const lab = [
  {
    id: 'watchwise',
    name: 'WatchWise',
    kind: 'Personal · full-stack',
    summary:
      'A MERN movie platform with JWT auth, cached TMDB data, and a customized Recombee engine that personalizes recommendations from ratings and interaction history.',
    stack: ['MongoDB', 'Express', 'React', 'Node.js', 'Recombee'],
    links: [
      { label: 'Live demo', href: 'https://watch-wise-pink.vercel.app/' },
      { label: 'GitHub', href: 'https://github.com/Med-Amine-Guizani/WatchWise' },
    ],
  },
  {
    id: 'smart-city',
    name: 'Smart City Shield',
    kind: 'Academic · distributed systems',
    summary:
      'Crime detection for a fictional smart city: Java and Spring Cloud microservices that talk over REST, GraphQL, SOAP and gRPC, behind an API gateway with service discovery and centralized configuration.',
    stack: ['Java', 'Spring Cloud', 'gRPC', 'GraphQL', 'SOAP', 'Docker'],
    links: [],
  },
];

export const stack: Record<string, string[]> = {
  AI: ['LangGraph', 'Agent orchestration', 'RAG', 'Tool calling', 'Conversational agents', 'LLM scoring', 'Vector search'],
  Languages: ['Python', 'TypeScript', 'JavaScript', 'Java', 'C', 'C++'],
  Frontend: ['React', 'Redux Toolkit', 'Angular'],
  Backend: ['FastAPI', 'NestJS', 'Node.js', 'Express', 'Spring Boot', 'Spring Security'],
  Data: ['PostgreSQL', 'SQLAlchemy', 'Alembic', 'Oracle PL/SQL', 'MySQL', 'MongoDB', 'Redis'],
  Ops: ['Docker', 'Compose', 'Kubernetes', 'CI/CD', 'GitHub Actions', 'Linux'],
};
