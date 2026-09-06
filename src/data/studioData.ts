export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  tagline: string;
  description: string;
  technologies: string[];
  features: string[];
  metrics: string;
  ctaText: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  year: string;
  client: string;
  description: string;
  impact: string;
  tags: string[];
  stats: { label: string; value: string }[];
  accentColor: string;
  image: string;
  imageAlt: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  tagline: string;
  description: string;
  deliverables: string[];
}

export const studioInfo = {
  name: "TAMEEM NEXUS STUDIO",
  founder: "MOHAMMAD TAMEEM IMRAN",
  founderTitle: "Founder — Tameem Nexus Studio",
  location: "Lucknow, Uttar Pradesh, India",
  phone: "+91 89572 17120",
  phoneRaw: "+918957217120",
  email: "tameemimran253@gmail.com",
  heroHeading: "WE BUILD DIGITAL EXPERIENCES THAT MOVE.",
  heroStatement: "Tameem Nexus Studio creates modern websites, applications, software experiences, automation systems, AI-powered solutions and interactive digital experiences.",
  introStatement: "We combine technology, design and motion to create digital experiences with purpose.",
  aboutHeading: "TECHNOLOGY WITH A CREATIVE POINT OF VIEW.",
  aboutDescription: "Tameem Nexus Studio focuses on combining design, technology, AI, software development and interactive experiences to build digital products with lasting impact.",
  contactHeading: "LET'S BUILD SOMETHING NEXT.",
  status: "ACCEPTING NEW COMMISSIONS",
  copyright: "© 2026 Tameem Nexus Studio. All rights reserved."
};

export const servicesData: ServiceItem[] = [
  {
    id: "web-dev",
    number: "01",
    title: "WEB DEVELOPMENT",
    subtitle: "DIGITAL EXPERIENCES THAT MOVE.",
    tagline: "High-Performance Modern Web Architecture",
    description: "Bespoke digital platforms built with modern web technologies, responsive layouts, fast load speeds, and clean full-stack infrastructure.",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Three.js / WebGL", "Node.js", "Vite"],
    features: ["Sub-second page speeds", "Interactive 3D integration", "Responsive mobile-first layouts", "SEO-optimized structure", "Clean, maintainable code"],
    metrics: "Optimized Performance",
    ctaText: "START WEB PROJECT"
  },
  {
    id: "app-dev",
    number: "02",
    title: "APP DEVELOPMENT",
    subtitle: "BUILT FOR EVERY SCREEN.",
    tagline: "Native & Cross-Platform Mobile Applications",
    description: "Intuitive mobile applications for iOS and Android engineered with smooth gestures, secure cloud sync, and responsive user interfaces.",
    technologies: ["React Native", "Flutter", "TypeScript", "Cloud Storage", "REST APIs"],
    features: ["iOS & Android compatibility", "Fluid micro-interactions", "Offline-first capability", "Secure user authentication", "Push notification pipelines"],
    metrics: "Smooth 60 FPS UX",
    ctaText: "START APP PROJECT"
  },
  {
    id: "ui-ux",
    number: "03",
    title: "UI / UX DESIGN",
    subtitle: "PURPOSEFUL VISUAL SYSTEMS.",
    tagline: "Human-Centered Interface Design",
    description: "Elevated design language, user journey mapping, wireframing, high-fidelity prototypes, and comprehensive design systems tailored to your brand.",
    technologies: ["Figma", "Design Systems", "Interactive Prototyping", "UX Research", "Typography"],
    features: ["Editorial visual hierarchy", "High-fidelity clickable prototypes", "Comprehensive component libraries", "Accessibility-compliant contrast", "Design tokens & specs"],
    metrics: "Refined Craft",
    ctaText: "START DESIGN PROJECT"
  },
  {
    id: "automation",
    number: "04",
    title: "SOFTWARE AUTOMATION",
    subtitle: "SYSTEMS THAT WORK EFFORTLESSLY.",
    tagline: "Streamlined Workflows & API Pipelines",
    description: "Intelligent software automations that connect tools, streamline repetitive business workflows, and eliminate manual friction across systems.",
    technologies: ["Node.js", "Python", "Webhooks & APIs", "Workflow Orchestration", "Cloud Functions"],
    features: ["Custom API integrations", "Automated data synchronization", "Event-triggered workflows", "Error handling & notifications", "Reliable execution"],
    metrics: "Maximum Efficiency",
    ctaText: "START AUTOMATION PROJECT"
  },
  {
    id: "ai-solutions",
    number: "05",
    title: "AI SOLUTIONS",
    subtitle: "INTELLIGENCE EMBEDDED IN SOFTWARE.",
    tagline: "Custom AI Integration & Smart Capabilities",
    description: "Modern AI-powered solutions, intelligent chat interfaces, predictive data utilities, and automated task assistants designed for modern applications.",
    technologies: ["LLM Integration", "Gemini API", "Natural Language Processing", "Vector Embeddings", "Smart Workflows"],
    features: ["Custom AI assistance", "Automated content generation", "Context-aware reasoning", "Fast API response times", "Secure prompt engineering"],
    metrics: "Cognitive Velocity",
    ctaText: "START AI PROJECT"
  },
  {
    id: "3d-motion",
    number: "06",
    title: "3D / MOTION DESIGN",
    subtitle: "INTERACTIVE DIMENSIONS.",
    tagline: "WebGL, Spatial Interactions & Cinematic Motion",
    description: "Interactive 3D web environments, WebGL shaders, particle systems, and kinetic motion choreography that create unforgettable digital moments.",
    technologies: ["Three.js", "WebGL", "GSAP ScrollTrigger", "GLSL Shaders", "3D Canvas"],
    features: ["Real-time 3D rendering", "Cursor-reactive geometry", "Scroll-driven animations", "Hardware-accelerated performance", "Mobile fallback support"],
    metrics: "Cinematic Fidelity",
    ctaText: "START 3D PROJECT"
  },
  {
    id: "ecommerce",
    number: "07",
    title: "E-COMMERCE",
    subtitle: "MODERN COMMERCE EXPERIENCES.",
    tagline: "High-Converting Digital Storefronts",
    description: "Custom e-commerce platforms designed with frictionless checkout flows, interactive product showcases, and fast load times that drive conversions.",
    technologies: ["Custom Storefronts", "Stripe Checkout", "Product Visualizers", "Inventory APIs"],
    features: ["Frictionless checkout experience", "Interactive product showcases", "Secure payment gateway integration", "Mobile-first shopping UX", "Analytics readiness"],
    metrics: "Conversion-Focused",
    ctaText: "START STORE PROJECT"
  },
  {
    id: "seo-growth",
    number: "08",
    title: "SEO & DIGITAL GROWTH",
    subtitle: "VISIBILITY WITH PRECISION.",
    tagline: "Technical SEO & Search Optimization",
    description: "Comprehensive search engine optimization, Core Web Vitals optimization, semantic structured data, and technical growth strategies.",
    technologies: ["Core Web Vitals", "Semantic HTML5", "Structured Schema Data", "Sitemap Architecture", "Speed Optimization"],
    features: ["Technical SEO auditing", "Core Web Vitals acceleration", "Structured metadata & JSON-LD", "Mobile friendliness compliance", "Keyword & search visibility"],
    metrics: "Search Optimization",
    ctaText: "START SEO PROJECT"
  }
];

export const projectsData: ProjectItem[] = [
  {
    id: "nexus-digital",
    title: "NEXUS DIGITAL",
    category: "Luxury Technology Website",
    year: "2026",
    client: "Nexus Digital Platform",
    description: "A flagship digital presence crafted with high-contrast editorial typography, interactive WebGL geometry, and sub-second page performance.",
    impact: "Elevated brand stature with interactive spatial web design.",
    tags: ["React", "Three.js", "Tailwind CSS", "WebGL Shaders", "GSAP"],
    stats: [
      { label: "Performance", value: "60 FPS" },
      { label: "Load Time", value: "<0.6s" },
      { label: "Interaction", value: "Real-time" }
    ],
    accentColor: "#a855f7",
    image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=1200&auto=format&fit=crop",
    imageAlt: "Nexus Digital - High-performance hardware motherboard with Intel processor and GeForce RTX graphics"
  },
  {
    id: "aurora",
    title: "AURORA",
    category: "Interactive 3D Product Experience",
    year: "2026",
    client: "Aurora Spatial Labs",
    description: "An interactive 3D product showcase allowing users to explore hardware architecture in real-time space with lighting and material customization.",
    impact: "Immersive 3D interactive exploration across all modern devices.",
    tags: ["Three.js", "WebGL", "Interactive 3D", "PBR Materials", "TypeScript"],
    stats: [
      { label: "Rendering", value: "WebGL 2.0" },
      { label: "Fidelity", value: "High-Res" },
      { label: "Platform", value: "Universal" }
    ],
    accentColor: "#38bdf8",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
    imageAlt: "Aurora - 3D spatial interactive network and cyber geometry matrix"
  },
  {
    id: "vision-ai",
    title: "VISION AI",
    category: "AI-Powered Digital Platform",
    year: "2025",
    client: "Vision AI Systems",
    description: "An intelligent digital platform combining natural language interaction, smart automation pipelines, and a refined dark-mode dashboard interface.",
    impact: "Unified AI-powered workflows in a clean, human-centered UI.",
    tags: ["AI Solutions", "React", "Node.js", "REST APIs", "Modern UI/UX"],
    stats: [
      { label: "Response", value: "<200ms" },
      { label: "Architecture", value: "Serverless" },
      { label: "Interface", value: "Adaptive" }
    ],
    accentColor: "#ec4899",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
    imageAlt: "Vision AI - Intelligent multi-device SaaS productivity dashboard with glassmorphism UI"
  },
  {
    id: "synapse-os",
    title: "SYNAPSE OS",
    category: "Software Automation & Platform",
    year: "2025",
    client: "Synapse Software",
    description: "A modern software ecosystem designed to automate multi-step business pipelines, manage data sync, and deliver real-time operational insights.",
    impact: "Automated core workflows with high reliability and zero downtime.",
    tags: ["Software Automation", "TypeScript", "Node.js", "Cloud APIs"],
    stats: [
      { label: "Reliability", value: "99.9%" },
      { label: "Latency", value: "Sub-second" },
      { label: "Scalability", value: "Cloud-native" }
    ],
    accentColor: "#c084fc",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1200&auto=format&fit=crop",
    imageAlt: "Synapse OS - Autonomous neural fiber orchestration and enterprise software pipelines"
  }
];

export const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "DISCOVER",
    tagline: "Strategic Foundation",
    description: "Understand the idea, audience and objectives. We map out the vision, technical requirements, and core digital strategy.",
    deliverables: ["Project Blueprint", "Requirements Scope", "Technical Architecture"]
  },
  {
    number: "02",
    title: "DESIGN",
    tagline: "Visual & Spatial Language",
    description: "Create the visual language and experience. We craft the typography, interactive wireframes, 3D assets, and high-fidelity prototypes.",
    deliverables: ["UI/UX Design System", "Interactive Prototypes", "Motion & 3D Concepts"]
  },
  {
    number: "03",
    title: "BUILD",
    tagline: "Production Engineering",
    description: "Develop the digital product with modern technology. We write clean, performant code, integrate APIs, and engineer responsive interactions.",
    deliverables: ["Full-Stack Codebase", "Performance Tuning", "Cross-Platform Hardening"]
  },
  {
    number: "04",
    title: "LAUNCH",
    tagline: "Deployment & Optimization",
    description: "Test, optimize and launch the final experience. We perform quality assurance, verify performance across devices, and deploy to production.",
    deliverables: ["Production Deployment", "Core Web Vitals Verification", "Final Handoff"]
  }
];

export const whyChooseTNS = [
  {
    number: "01",
    title: "Design + Technology Fusion",
    description: "We bridge the gap between creative visual artistry and robust, production-grade engineering."
  },
  {
    number: "02",
    title: "Custom Craftsmanship",
    description: "Every digital experience is built from first principles — no generic templates or shortcuts."
  },
  {
    number: "03",
    title: "Interactive 3D & Modern Motion",
    description: "Subtle, purposeful animations and WebGL experiences that captivate users without sacrificing speed."
  },
  {
    number: "04",
    title: "Direct Founder Collaboration",
    description: "Work directly with founder Mohammad Tameem Imran for focused creative direction and clear communication."
  }
];
