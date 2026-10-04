// Single source of truth for every claim on the site.
// Facts come from Resume/my_experiences.md plus what Amine told us directly on 2026-10-04
// (bac honour, entrance-exam rank, what each step taught him, how he works at AVOCarbon).
// Never add numbers, names or outcomes that aren't verified there.

const BASE = import.meta.env.BASE_URL;

export const person = {
  fullName: 'Mohamed Amine Guizani',
  first: 'Amine',
  last: 'Guizani',
  role: 'Full-Stack & AI Engineer',
  company: 'AVOCarbon Group',
  location: 'Tunis, Tunisia',
  email: 'amineguizani33@gmail.com',
  phone: '(+216) 95 954 110',
  phoneHref: 'tel:+21695954110',
  linkedin: 'https://www.linkedin.com/in/mohamed-amine-guizani/',
  github: 'https://github.com/Med-Amine-Guizani',
  languages: [
    ['Arabic', 'native'],
    ['English', 'advanced, TOEIC 915/990'],
    ['French', 'upper-intermediate'],
    ['German', 'A2'],
  ] as const,
};

export type Logo = { src: string; alt: string; dark?: boolean; width: number; height: number };

/** `dark` logos are published only in white, so they sit on a navy badge. */
export const logos: Record<string, Logo | null> = {
  ipein: { src: `${BASE}logos/ipein.webp`, alt: 'IPEIN, Preparatory Engineering Institute of Nabeul', width: 302, height: 150 },
  enicarthage: { src: `${BASE}logos/enicarthage.webp`, alt: 'ENICarthage, National School of Engineering of Carthage', dark: true, width: 273, height: 108 },
  // No verified official BS Automation logo yet: a plain name label is shown until Amine provides it.
  bs: null,
  capgemini: { src: `${BASE}logos/capgemini.svg`, alt: 'Capgemini Engineering', width: 708, height: 85 },
  cognira: { src: `${BASE}logos/cognira.svg`, alt: 'Cognira', width: 210, height: 30 },
  avocarbon: { src: `${BASE}logos/avocarbon.webp`, alt: 'AVOCarbon Group', width: 640, height: 118 },
};

/** A lesson: the key phrase gets the highlighter sweep, the rest follows it. */
export type Lesson = { key: string; rest: string };

export const prepa = {
  when: '2021 — 2023',
  school: 'IPEIN, Preparatory Engineering Institute of Nabeul',
  track: 'Physics & Technology',
  lessons: [
    {
      key: 'Problem solving, every single day.',
      rest: 'Maths and physics taught me to break a hard problem down, model it, and not let go until it gives in.',
    },
    { key: 'I still work that way.', rest: '' },
  ] satisfies Lesson[],
  rank: { value: 100, of: 800 },
};

export const enicarthage = {
  when: '2023 — 2026',
  school: 'ENICarthage, National School of Engineering of Carthage',
  degree: 'National engineering degree in Software Engineering',
  graduated: 'July 2026',
  lessons: [
    {
      key: 'Computer science from the ground up:',
      rest: 'algorithms, systems, databases, networks and software architecture.',
    },
    {
      key: 'The people.',
      rest: 'Through networking I met many interesting people, classmates and professors, and learned a lot from them.',
    },
  ] satisfies Lesson[],
};

export type Internship = {
  id: 'bs' | 'capgemini' | 'cognira';
  company: string;
  when: string;
  kind: string;
  title: [string, string]; // plain, emphasised
  lessons: Lesson[];
  note?: string;
};

export const internships: Internship[] = [
  {
    id: 'bs',
    company: 'BS Automation',
    when: 'Jul — Aug 2024',
    kind: 'Internship',
    title: ['My first client,', 'and my first robots.'],
    lessons: [
      { key: 'Dealing with clients.', rest: 'Working with a German client taught me to find out what people really need, and agree on what "done" means.' },
      { key: 'Robotics.', rest: 'C++ and Angular for a platform that makes collaborative robots easier to set up in factories.' },
      { key: 'The startup pace.', rest: 'A small team, real ownership, moving fast.' },
      { key: 'Scrum in practice.', rest: 'Dailies, sprint planning, delivering in increments.' },
    ],
  },
  {
    id: 'capgemini',
    company: 'Capgemini Engineering',
    when: 'Jun — Aug 2025',
    kind: 'Internship',
    title: ['My first project,', 'end to end.'],
    lessons: [
      {
        key: 'Owning it from start to finish.',
        rest: 'A platform that automates the whole internship journey, from applications arriving by email to archiving the finished project.',
      },
      {
        key: 'My first AI features, built for better UX.',
        rest: 'An LLM reads each application and scores the fit, and semantic search finds similar past projects. Not AI for show: it saved HR real effort.',
      },
    ],
  },
  {
    id: 'cognira',
    company: 'Cognira',
    when: 'Feb — Jun 2026',
    kind: 'Final-year project',
    title: ['How a real', 'product company works.'],
    lessons: [
      { key: 'Inside a SaaS company:', rest: 'how Cognira builds, ships and supports PromoAI for retailers.' },
      { key: 'Deep JavaScript and TypeScript.', rest: '' },
      { key: 'A team I learned so much from.', rest: 'Very competent, genuinely kind people.' },
      { key: 'Building with AI.', rest: 'Tools like Claude Code became part of how I work.' },
    ],
    note: 'I built Configuration Studio, a low-code platform with an AI assistant (RAG + tool calling) that keeps the human in charge.',
  },
];

export const cogniraMetrics = [
  { value: 60, suffix: '%', label: 'faster delivery of client enhancement requests' },
  { value: 20, suffix: '%', label: 'fewer re-renders on large configuration trees' },
];

export const avocarbon = {
  since: 'August 2026',
  role: 'Full-Stack & AI Engineer',
  platform: 'The Derogation Management Platform',
  loop: [
    {
      step: 'Listen',
      text: 'I talked with the people who handle derogations to get the features right: the real flows, and where they hurt.',
    },
    { step: 'Build with AI', text: 'I used AI to build and ship the solution fast.' },
    { step: 'Deploy', text: "Deployed efficiently into production, now used across AVOCarbon's plants." },
    {
      step: 'Watch & fix',
      text: "I keep watching how people use it. When something breaks, I usually see it in the logs and fix it before anyone reports it.",
    },
  ],
  facts: ['4 roles', '2-level approval workflow', 'Configurable notifications', 'Per-plant responsibility matrices'],
  stack: ['Python', 'FastAPI', 'SQLAlchemy', 'Alembic', 'React'],
  next: {
    title: 'A role-based intelligence agent',
    text: 'A LangGraph agent that turns weekly operational data into a memo for each role, with access control deciding who sees what.',
  },
};

export const projects = [
  {
    name: 'WatchWise',
    kind: 'Personal project',
    text: 'A movie platform with personalised recommendations from a customised Recombee engine.',
    stack: ['MongoDB', 'Express', 'React', 'Node.js'],
    links: [
      { label: 'Live demo', href: 'https://watch-wise-pink.vercel.app/' },
      { label: 'GitHub', href: 'https://github.com/Med-Amine-Guizani/WatchWise' },
    ],
  },
  {
    name: 'Smart City Shield',
    kind: 'Academic project',
    text: 'Crime detection for a fictional smart city: Spring Cloud microservices talking REST, GraphQL, SOAP and gRPC.',
    stack: ['Java', 'Spring Cloud', 'gRPC', 'Docker'],
    links: [],
  },
];

export const toolbox: Record<string, string[]> = {
  AI: ['LangGraph', 'Agent orchestration', 'RAG', 'Tool calling', 'LLM scoring', 'Semantic search'],
  Languages: ['Python', 'TypeScript', 'JavaScript', 'Java', 'C', 'C++'],
  'Front end': ['React', 'Redux Toolkit', 'Angular'],
  'Back end': ['FastAPI', 'NestJS', 'Node.js', 'Express', 'Spring Boot'],
  Data: ['PostgreSQL', 'SQLAlchemy', 'Alembic', 'MySQL', 'MongoDB', 'Redis', 'Oracle'],
  Ops: ['Docker', 'Kubernetes', 'CI/CD', 'GitHub Actions', 'Linux'],
};
