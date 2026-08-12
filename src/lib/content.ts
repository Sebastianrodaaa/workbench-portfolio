/**
 * Single place to edit every piece of copy in the experience.
 */

export const profile = {
  name: "Sebastian Roda",
  role: "Project Manager | Forward Deployed Engineer",
  shortRole: "Forward Deployed Engineer",
  location: "New York, NY",
  tagline:
    "Forward deployed engineer shipping local models, secure AI systems, and production ML into the real world.",
  email: "sebastian@rodaventuresllc.com",
  phone: "+1 (203) 427-5527",
  resume: {
    url: "/resume.pdf",
    filename: "Sebastian_Roda_Resume.pdf",
  },
  links: [
    {
      label: "LinkedIn",
      href: "https://linkedin.com/in/sebastian-roda",
      display: "linkedin.com/in/sebastian-roda",
    },
  ],
};

export const about = {
  heading: "Sebastian Roda",
  paragraphs: [
    "Multidisciplinary Project Manager and Forward Deployed Engineer working at the intersection of technology, sociology, and ontology.",
    "Three years shipping end-to-end products — from field discovery through architecture, verification, and production deployment.",
    "Four hackathon podiums across NYC and Paris — building agent systems under real constraints, from IBM agent orchestration to defence tech in Europe.",
    "Current focus: locally hosted models and security, frontier AI, distributed systems, and machine learning — training models for complex real-world workflows, putting them into production, and automating those pipelines with AI.",
  ],
  facts: [
    { label: "Based in", value: "New York, NY" },
    {
      label: "Focus",
      value:
        "Local hosting & security · frontier AI · distributed systems · production ML & automation",
    },
    { label: "Hackathons", value: "4 podiums · NYC & Paris" },
  ],
};

export type HackathonWin = {
  id: string;
  place: string;
  awards?: string[];
  event: string;
  location: string;
};

export const hackathons: HackathonWin[] = [
  {
    id: "ibm-agent",
    place: "1st Place",
    awards: ["Best Use Case"],
    event: "IBM Agent Orchestration Hackathon",
    location: "New York, NY",
  },
  {
    id: "fordham-pulse",
    place: "2nd Place",
    awards: ["Best Use Case"],
    event: "Fordham Business School × Pulse AI Foundry — GEO Agent Hackathon",
    location: "New York, NY",
  },
  {
    id: "eu-defence",
    place: "3rd Place",
    event: "European Defence Tech Hackathon",
    location: "Paris, France",
  },
  {
    id: "deepmind-cv",
    place: "Honorable Mention",
    event: "Google DeepMind × Cerebral Valley Hackathon",
    location: "New York, NY",
  },
];

export type Experience = {
  id: string;
  company: string;
  title: string;
  period: string;
  meta?: string;
  summary: string;
  bullets: string[];
  tags: string[];
  href?: string;
};

export const experience: Experience[] = [
  {
    id: "roda-ventures",
    company: "Roda Ventures LLC",
    title: "Project Manager, Product and Systems Consultant",
    period: "September 2022 — Present",
    meta: "Clients: Meta, Amazon, Hoka",
    summary:
      "Forward-deployed execution for clients, creatives, and engineering teams — from discovery in the field to verified production delivery.",
    bullets: [
      "Partner with clients, creative teams, and developers to drive execution, maintain alignment, and keep deliverables on track across hardware, retail, and AI engagements.",
      "Embedded with Meta's product development team on the Meta glasses launch — feature QA on device, user-friction analysis, production readiness, and campaign support.",
      "Forward deployed at Amazon to build an interactive Nike e-commerce experience: off-axis projection, Python 3D rendering, and TouchDesigner environment setup through production.",
      "Supported quality assurance across the Microsoft tool suite and in-house AI systems; delivered creative and brand projects with tight feedback loops.",
      "Supported new business development through client pitches and onboarding.",
    ],
    tags: [
      "Forward deployed",
      "Product strategy",
      "QA testing",
      "TouchDesigner",
      "Cross-functional coordination",
      "Client pitches",
    ],
  },
  {
    id: "meta-summer",
    company: "Meta",
    title: "Forward Deployed Engineer, Product Development",
    period: "Summer 2026",
    meta: "Meta glasses launch",
    summary:
      "Embedded with the product team shipping Meta's new glasses — testing on hardware, surfacing friction, and supporting launch.",
    bullets: [
      "Ran quality assurance on pre-release glasses builds — validating features on device, logging defects, and tracking fixes through production.",
      "Mapped user friction across core flows and translated field findings into actionable product feedback for engineering and design.",
      "Supported production readiness and launch campaign workstreams alongside the product development team.",
      "Worked forward deployed: short feedback loops between testers, builders, and the people who would wear the hardware at launch.",
    ],
    tags: [
      "Hardware QA",
      "User friction analysis",
      "Product development",
      "Launch support",
      "Forward deployed",
    ],
  },
  {
    id: "amazon-summer",
    company: "Amazon",
    title: "Forward Deployed Engineer",
    period: "Summer 2026",
    meta: "Nike interactive retail",
    summary:
      "Built an interactive Nike e-commerce production using off-axis projection and a Python 3D rendering stack.",
    bullets: [
      "Designed and implemented an interactive retail experience for Amazon's Nike e-commerce shop — from prototype through production deployment.",
      "Built the 3D rendering pipeline in Python and configured real-time environments in TouchDesigner for off-axis projection.",
      "Calibrated projection geometry, content playback, and scene logic so creative and engineering could iterate without breaking the install.",
      "Sat with stakeholders on-site to debug integration issues and ship a stable production system under a fixed launch window.",
    ],
    tags: [
      "TouchDesigner",
      "Off-axis projection",
      "Python 3D",
      "Interactive retail",
      "Production deployment",
      "Forward deployed",
    ],
  },
];

export const education = [
  {
    id: "columbia-cert",
    credential:
      "Graduate Certificate, Computer Science — emphasis in AI and Machine Learning",
    school: "Columbia University",
    place: "New York, NY",
    period: "2025 — 2026",
  },
  {
    id: "pratt-cert",
    credential: "Advanced Certificate, User Experience and Data Science",
    school: "Pratt Institute, School of Information",
    place: "Brooklyn, NY",
    period: "January 2024 — January 2026",
  },
  {
    id: "pratt-ba",
    credential:
      "Bachelor of Arts, Critical and Visual Studies; Entrepreneurship and Entrepreneurial Studies",
    school: "Pratt Institute",
    place: "Brooklyn, NY",
    period: "September 2022 — May 2025",
  },
];

export const skills: { group: string; items: string[] }[] = [
  {
    group: "Languages",
    items: ["Python", "C++", "JavaScript", "TypeScript", "Swift", "HTML", "CSS"],
  },
  {
    group: "Frameworks and Libraries",
    items: ["React", "FastAPI", "PyTorch", "LangChain", "LangGraph"],
  },
  {
    group: "AI and ML",
    items: [
      "LLMs",
      "RAG",
      "Agentic frameworks",
      "Knowledge and context graphs",
      "Model fine-tuning and training",
      "Local model hosting",
      "Computer vision",
      "MLOps",
      "MLflow",
      "Production AI automation",
    ],
  },
  {
    group: "Data and Infrastructure",
    items: [
      "AWS",
      "PostgreSQL",
      "Neo4j",
      "Redis",
      "Real-time data pipelines",
      "Distributed systems",
      "Security-minded deployment",
      "A/B testing",
    ],
  },
  {
    group: "Blockchain",
    items: [
      "Solidity",
      "Hardhat",
      "Uniswap V4",
      "Base",
      "USDC",
      "Smart contract deployment",
      "DeFi",
      "AMMs",
    ],
  },
  {
    group: "Design and Product",
    items: [
      "Figma",
      "Adobe Creative Cloud",
      "TouchDesigner",
      "iOS and iPadOS development",
      "App Store release",
      "Design systems",
    ],
  },
  {
    group: "Project Management",
    items: [
      "Microsoft tool suite",
      "Quality assurance testing",
      "Cross-functional coordination",
      "Product strategy",
      "Fundraising",
    ],
  },
];

/** README.TXT, as read in Notepad. */
export const readme = {
  filename: "README.TXT",
  sections: [
    {
      heading: "INTRODUCTION",
      body: "I'm Sebastian Roda — a Forward Deployed Engineer and Project Manager based in New York. I work where product, infrastructure, and the people using the system actually meet. I don't stay at the whiteboard; I sit with users, watch where software breaks, and ship fixes that make it into production.",
    },
    {
      heading: "WHAT I BUILD",
      body: "My focus is locally hosted models and security, frontier AI, and distributed systems. I train models for complex, real-world workflows — ingestion, feature work, training, deployment, monitoring — and automate those pipelines so they stay reliable in production. The sociology is not decoration: systems are used by people, and the ontology you pick decides what the software is able to notice.",
    },
    {
      heading: "RECENT FIELD WORK",
      body: "This summer I forward-deployed with Meta's product development team on the new Meta glasses launch — QA on hardware, mapping user friction, supporting production, and helping with the launch campaign. At Amazon I built an interactive Nike e-commerce production using off-axis projection, Python 3D rendering, and TouchDesigner. Through Roda Ventures I partner with teams at Meta, Amazon, and Hoka to drive the same spec → implement → verify discipline on every engagement.",
    },
    {
      heading: "HACKATHON WINS",
      body: "1st & Best Use Case — IBM Agent Orchestration Hackathon (NYC). 2nd & Best Use Case — Fordham Business School × Pulse AI Foundry GEO Agent Hackathon (NYC). 3rd — European Defence Tech Hackathon (Paris). Honorable Mention — Google DeepMind × Cerebral Valley Hackathon (NYC).",
    },
    {
      heading: "WHY FORWARD DEPLOYED",
      body: "The best architecture comes from watching real users hit real constraints — then closing the loop fast enough that the field and the codebase stay aligned. That's the job: translate messy reality into systems that survive contact with it.",
    },
  ],
  quote:
    "We have interpreted the world, in various ways; mainly, however, is to change it.",
};

export const credits = [
  { label: "Renderer", value: "three.js + React Three Fiber" },
  { label: "Helpers", value: "drei, postprocessing, zustand" },
  { label: "Scene", value: "workbench.glb, supplied by the author" },
  { label: "Interface", value: "Hand-built Windows 95 tribute, in DOM" },
];

/** Power-on self test, shown while the site's assets load. */
export const biosLines = [
  "Award Modular BIOS v4.51PG, An Energy Star Ally",
  "Copyright (C) 1984-95, Award Software, Inc.",
  "",
  "RODA VENTURES WORKBENCH  486DX2-66",
  "",
];

export const biosDevices = [
  "Detecting HDD Primary Master   ... WORKBENCH.GLB",
  "Detecting HDD Primary Slave    ... None",
  "Detecting Display Adapter      ... CRT 1024x840",
  "Detecting Pointing Device      ... Serial Mouse",
  "Detecting Audio Device         ... Sound Blaster 16",
];

/** DOS hand-off, shown on the monitor the first time you sit down. */
export const bootLines = [
  "Starting Windows 95...",
  "",
  "C:\\> WIN",
];
