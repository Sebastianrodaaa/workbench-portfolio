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

/** Verbatim copy from portfolio.pdf for the About Me window. */
export const portfolio = {
  welcome: {
    heading: "WELCOME",
    greeting: "I'm Sebastian Roda",
    intro:
      "I'm a Forward Deployed Engineer & Project Manager Consultant. In May of 2026 I graduated from Pratt Institute with a degree in Political Science & Entrepreneurship. I also obtained an advanced certificate in Data Science from the information school at Pratt & a graduate certificate from Columbia University in Computer Science.",
    closing:
      "Thank you for taking the time to check out my portfolio. I really hope you enjoy exploring as much as I enjoyed building it. if you have any questions or comments feel free to contact me using the contact information section or shoot me an email at sebastian@rodaventuresllc.com",
  },
  aboutMe: {
    heading: "ABOUT ME",
    blocks: [
      {
        type: "paragraph" as const,
        text: "For most of my early life, my world was entirely defined by basketball. Growing up in Greenwich, I constantly traveled to play in the city and across the country, eventually earning a McDonald's All-American nomination at New York Military Academy and a collegiate spot in Brooklyn. But it was actually on the court where I found my way into tech. I started using Python and data science to evaluate team stats and analyzing my own performance metrics to argue for better playing time with my coach.",
      },
      {
        type: "figure" as const,
        src: "/images/portfolio/figure-1.png",
        alt: "Sebastian Roda competing in his final college basketball game",
        text: "Figure 1. Me competing in my final college basketball game of my career",
      },
      {
        type: "figure" as const,
        src: "/images/portfolio/figure-2.png",
        alt: "Sebastian Roda with high school teammates and McDonald's All-American Nominee certificates",
        text: "Figure 2. Posing with my high school teammates with our McDonald's All-American Nominee Certificates",
      },
      {
        type: "paragraph" as const,
        text: "As I stepped outside the athletic bubble, I started connecting with a whole new world and people. I have a passion for competitiveness, solving problems, and building things so naturally my hobbies consist of things like Chess & Hackathons. I began jumping into hackathons building solo and winning them right out of the gate.",
      },
      {
        type: "figure" as const,
        src: "/images/portfolio/figure-3.jpeg",
        alt: "Building a drone for a defense tech hackathon in Paris",
        text: "Figure 3. Building a drone for a defense tech hackathon in Paris. (built a multimodal counter drone acoustic detection system)",
      },
      {
        type: "paragraph" as const,
        text: "Today, my foundation is a mix of creative vision, critical conceptualizing, and rigorous attention to detail. I've transitioned fully into systems architecture. Recently, I've worked on immersive e-commerce and Python 3D rendering environments at Amazon, and handled QA and user friction reporting for the new Meta glasses launch. Now, I consult as a Forward Deployed Engineer & Project Manager thriving in fast sprints, shipping distributed systems, and building production-ready products that bridge the gap between complex engineering and the human experience.",
      },
    ],
  },
};

export const landing = {
  title: profile.name,
  subtitle: [
    "Forward Deployed Engineer",
    "Project Manager",
    "Serial Hackathon Winner",
  ],
  links: [
    { label: "About Me", windowId: "about" as const },
    { label: "Experience", windowId: "work" as const },
    { label: "Projects", windowId: "notes" as const },
    { label: "Contact", windowId: "contact" as const },
  ],
};

export const about = {
  heading: "Sebastian Roda",
  paragraphs: [
    "Multidisciplinary Project Manager & Forward Deployed Engineer working at the intersection of technology, sociology, and ontology.",
    "Four years shipping end-to-end products across Hardware, Saas, and Blockchain domains.",
    "Four hackathon podiums across NYC and Paris — building agentic systems under high risk and short sprint cycles, from IBM agent orchestration to defence tech in Europe.",
    "Current focus: locally hosted models and security, frontier AI, distributed systems, and machine learning — training models for complex real-world workflows, putting them into production, and automating those pipelines with AI.",
  ],
  facts: [
    { label: "Based in", value: "New York, NY" },
    {
      label: "Focus",
      value:
        "Local hosting & security · Computer vision · Distributed systems · Production ML & AI",
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

export type Project = {
  id: string;
  title: string;
  event: string;
  url: string;
  body: string;
  demoVideo?: string;
};

/** Portfolio projects (from projects.pdf). */
export const projects: Project[] = [
  {
    id: "fpv-acoustic",
    title: "FPV Drone Acoustic Detection",
    event: "European Defence Tech Hackathon · 3rd Place · Paris",
    url: "https://github.com/Sebastianrodaaa/EDTHHACK",
    demoVideo: "/videos/edth-demo.mp4",
    body: "I built this multi-modal acoustic detection system for the European Defence Tech Hackathon to counter the rising threat of low-cost FPV drones that easily bypass traditional radar. Shifting away from easily jammed active radar, I engineered a passive, edge-deployed system that uses multiple microphones and advanced signal processing to filter out ambient noise and isolate the distinct high-frequency whine of drone motors. To ensure operational viability, I optimized a real-time inference engine for low-latency detection and implemented time-difference-of-arrival (TDOA) algorithms across the sensor array to accurately triangulate the drone's directional bearing. Designed to run entirely on portable edge hardware without cloud dependency, this sprint into signal processing and AI proved that you don't need a multi-million dollar defense contract to build a highly capable, passive early-warning system for modern security environments.",
  },
  {
    id: "org-sim",
    title: "Org-Sim",
    event: "IBM Agent Orchestration Hackathon · 1st & Best Use Case · NYC",
    url: "https://github.com/Sebastianrodaaa/org-simulator",
    demoVideo: "/videos/orgsim-demo.mp4",
    body: "I built the org-simulator to tackle a complex challenge in multi-agent orchestration, which eventually led to a win at the IBM hackathon. The core problem I wanted to solve was how to effectively manage, simulate, and optimize the interactions between autonomous AI agents operating within a complex organizational structure. To achieve this, I developed a sophisticated framework that treats an organization as a dynamic system of nodes, where individual agents can be assigned specific roles, communication protocols, and decision-making weights. I focused on building a scalable architecture that allows users to model various operational scenarios, stress-test agent workflows, and identify bottlenecks in collaborative processes before deploying them in real-world environments. By prioritizing modularity and interoperability with existing LLM frameworks, I created a tool that provides granular visibility into how information propagates, decisions are reached, and conflicts are resolved between agents. This project served as a powerful sandbox for agentic design, proving that we can simulate and refine large-scale autonomous workflows with high precision.",
  },
  {
    id: "six-degrees",
    title: "6 Degree's",
    event: "Fordham × Pulse AI Geo Agent Hackathon · 2nd & Best Use Case · NYC",
    url: "https://github.com/Sebastianrodaaa/SebastianRoda-Fordham-hackathon",
    demoVideo: "/videos/six-degrees-demo.mp4",
    body: "I built 6 Degree's for the Fordham Business School Geo Agent Hackathon to tackle the complex challenge of uncovering hidden spatial and economic relationships within business networks. My goal was to move beyond traditional, static maps and create a dynamic ecosystem where autonomous geo-agents act on behalf of users to discover optimal physical connections — essentially calculating the six degrees of separation between disparate supply chain nodes, market opportunities, or physical assets. I engineered the architecture to continuously ingest and analyze geographic datasets, allowing the agents to evaluate physical constraints, infrastructure, and proximity in real-time. By bridging location-based intelligence with multi-agent orchestration, the platform enables businesses to simulate logistics, discover hyper-local networking opportunities, and stress-test physical operations. Winning the hackathon proved that combining geospatial data with agentic decision-making can transform abstract geographic routing into a highly actionable tool for strategic business planning.",
  },
  {
    id: "system-library-skill",
    title: "System Library Skill",
    event: "Developer tooling · cross-platform",
    url: "https://github.com/Sebastianrodaaa/system-library-skill",
    body: "I built the system-library-skill to eliminate the constant context-switching and friction of managing core system libraries by turning complex operating system environments into something you can simply converse with. To achieve this, I engineered a dynamic, cross-platform AI tool that safely scans system directories like /usr/lib across Linux and macOS, pulling raw metadata — such as version numbers and linker dependencies — and translating it into clean, human-readable insights. Because system-level operations carry inherent risk, I designed the skill with strict read-and-diagnose safety rails that give developers deep troubleshooting visibility without the danger of altering critical files. The result is a seamless bridge that instantly demystifies your entire system library stack and removes the guesswork from dependency management.",
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
      body: "I'm Sebastian Roda — a Forward Deployed Engineer and Project Manager based in New York. I work where product, infrastructure, and the people using the system actually meet.",
    },
    {
      heading: "WHAT I BUILD",
      body: "My focus is on building production-ready agentic systems and machine learning pipelines for complex real-world workflows.",
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
      body: 'from day one I\'ve wnanted to operate with small human teams and massive AI swarms. This "AI-native" approach companies will be able to offer the same services as legacy software, consulting, or financial firms but at a fraction of the cost. They will aggressively steal market share from heavy, bloated incumbents who are too slow to fire staff or adapt..',
    },
  ],
  quote:
    "We have interpreted the world, in various ways; mainly, however, is to change it.",
};

export const credits = [
  { label: "Renderer", value: "three.js + React Three Fiber" },
  { label: "Helpers", value: "drei, postprocessing, zustand" },
  { label: "Scene", value: "workbench.glb, supplied by the author" },
  { label: "Interface", value: "React95 on the CRT, in DOM" },
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
