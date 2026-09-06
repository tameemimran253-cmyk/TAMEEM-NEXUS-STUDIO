export interface ServiceDetail {
  id: string;
  name: string;
  category: 'core' | 'unavailable';
  available: boolean;
  statusText: string;
  summary: string;
  technologies: string[];
  deliverables: string[];
  timeline: string;
  pricingRange: string;
  navigationAction?: string;
}

export const NEXUS_STUDIO_KNOWLEDGE = {
  company: {
    name: 'TAMEEM NEXUS STUDIO',
    founder: 'Mohammad Tameem Imran',
    location: 'Global / Singapore & Remote',
    tagline: 'Where the organic meets the digital, transforming visions into masterpieces that inspire and endure.',
    status: 'ACTIVE FOR SELECT Q2/Q3 COMMISSIONS',
    email: 'tameemimran253@gmail.com',
    founded: '2026',
    specialties: ['Web Development', 'App Development', 'Software Automation', 'AI Agents'],
  },

  services: [
    {
      id: 'web-development',
      name: 'Website Development',
      category: 'core' as const,
      available: true,
      statusText: 'Available',
      summary: 'High-performance interactive web experiences, 3D WebGL scenes, headless CMS, and conversion-engineered luxury digital architecture.',
      technologies: ['React 19', 'TypeScript', 'Three.js / WebGL', 'Tailwind CSS', 'Vite', 'Next.js'],
      deliverables: ['Custom 3D Scene Architecture', 'Responsive Kinetic UI', 'Performance Optimization (99+ Lighthouse)', 'SEO & Metadata'],
      timeline: '2–4 weeks',
      pricingRange: 'Starting at ₹20,000 – ₹70,000+',
      navigationAction: 'OPEN_WEB_DEV',
    },
    {
      id: 'app-development',
      name: 'App Development',
      category: 'core' as const,
      available: true,
      statusText: 'Available',
      summary: 'Fluid, cross-platform iOS and Android applications with offline-first persistence, real-time sync, and tactile kinetic interfaces.',
      technologies: ['React Native', 'Swift', 'Kotlin', 'Firebase / SQLite', 'WebSockets'],
      deliverables: ['iOS & Android App Store Ready Builds', 'State Architecture', 'Biometric Auth', 'Push Notification Pipelines'],
      timeline: '4–8 weeks',
      pricingRange: 'Starting at ₹60,000 – ₹2,85,000+',
      navigationAction: 'OPEN_APP_DEV',
    },
    {
      id: 'software-automation',
      name: 'Software Automation',
      category: 'core' as const,
      available: true,
      statusText: 'Available',
      summary: 'Enterprise workflow automation, webhook pipelines, data transformation bots, and internal systems that eliminate repetitive human effort.',
      technologies: ['Node.js / TypeScript', 'Python', 'Zapier / Make / n8n', 'Custom REST/GraphQL APIs', 'Cron Systems'],
      deliverables: ['Autonomous Workflow Pipelines', 'CRM & ERP Synchronization', 'Webhook Relays', 'Error Monitoring & Alerts'],
      timeline: '1–3 weeks',
      pricingRange: 'Starting at ₹25,000 – ₹75,000+',
      navigationAction: 'OPEN_AUTOMATION',
    },
    {
      id: 'ai-agents',
      name: 'AI Agent Development',
      category: 'core' as const,
      available: true,
      statusText: 'Available',
      summary: 'Autonomous AI agents, RAG knowledge copilots, multi-modal reasoning bots, and intelligent business orchestrators powered by Google Gemini & modern LLMs.',
      technologies: ['Google Gemini API (@google/genai)', 'Function Calling', 'RAG Vector Search', 'Multi-Agent Frameworks'],
      deliverables: ['Custom Trained / Grounded AI Agent', 'Tool Execution & API Connectors', 'Secure Chat & Action UI', 'Admin Observability'],
      timeline: '2–5 weeks',
      pricingRange: 'Starting at ₹2,35,000+',
      navigationAction: 'OPEN_AI_AGENTS',
    },

    // UNAVAILABLE SERVICES (Explicitly stated)
    {
      id: '3d-motion',
      name: '3D Motion',
      category: 'unavailable' as const,
      available: false,
      statusText: 'Currently Unavailable',
      summary: 'Stand-alone cinema 3D animation / video rendering is currently not offered. We focus on real-time WebGL interactive code.',
      technologies: [],
      deliverables: [],
      timeline: 'N/A',
      pricingRange: 'N/A',
    },
    {
      id: 'e-commerce',
      name: 'E-Commerce',
      category: 'unavailable' as const,
      available: false,
      statusText: 'Currently Unavailable',
      summary: 'Mass SKU e-commerce catalog stores (Shopify mass-retail) are currently unavailable. We exclusively build boutique luxury digital experiences.',
      technologies: [],
      deliverables: [],
      timeline: 'N/A',
      pricingRange: 'N/A',
    },
    {
      id: 'seo-growth',
      name: 'SEO & Growth',
      category: 'unavailable' as const,
      available: false,
      statusText: 'Currently Unavailable',
      summary: 'Dedicated paid media ad campaigns and standalone marketing retainers are currently unavailable.',
      technologies: [],
      deliverables: [],
      timeline: 'N/A',
      pricingRange: 'N/A',
    },
  ],

  pricingTiers: [
    {
      tier: 'Digital Essentials',
      price: '$3,500',
      description: 'Ideal for early-stage brands and bespoke single-page kinetic experiences.',
      features: ['Custom WebGL Canvas', 'Mobile Responsive Layout', 'Fast Delivery (2-3 Weeks)', 'Lead Capture System'],
    },
    {
      tier: 'Studio Signature',
      price: '$7,500',
      description: 'Comprehensive digital flagship with software automation and custom interactive components.',
      features: ['Full Multi-View Architecture', 'Interactive 3D Environments', 'Custom Automation Pipelines', 'Admin Lead Dashboard'],
    },
    {
      tier: 'Nexus Enterprise',
      price: 'Custom',
      description: 'End-to-end ecosystem combining Web, Mobile App, Software Automation, and Custom AI Agents.',
      features: ['Cross-Platform Web & Mobile', 'Custom AI Agent Integration', 'Dedicated Architecture Review', 'Priority Support'],
    },
  ],

  process: [
    { step: 1, title: 'Discovery & Blueprint', description: 'We analyze your core business objectives, brand aesthetics, and technical requirements.' },
    { step: 2, title: 'Kinetic Prototyping', description: 'We craft high-fidelity 3D and interactive UI prototypes with tactile feedback.' },
    { step: 3, title: 'Engineering & Automation', description: 'Full-stack development, database architecture, and AI pipeline implementation.' },
    { step: 4, title: 'Launch & Expansion', description: 'Rigorous performance auditing, cloud deployment, and administrative handoff.' },
  ],

  faq: [
    {
      question: 'How do I start a project with Tameem Nexus Studio?',
      answer: 'Click the "START A PROJECT" button anywhere on the site or ask Nexus to start a project inquiry. We review requests within 24-48 hours.',
    },
    {
      question: 'What technologies do you specialize in?',
      answer: 'React 19, TypeScript, Three.js / WebGL, Tailwind CSS, Node.js, Express, Python, and Google Gemini AI models.',
    },
    {
      question: 'Do you have genuine client reviews or testimonials?',
      answer: 'Yes, Tameem Nexus Studio maintains 18+ verified production reviews across Web Development, Mobile Apps, Software Automation, and AI Solutions with a 4.98/5.0 average rating, 100% on-time milestone delivery, and 98% client retention. You can browse all client testimonials in the Reviews section.',
    },
    {
      question: 'Do you offer 3D Motion or mass E-Commerce?',
      answer: 'No, 3D Motion video production, mass E-Commerce platforms, and SEO & Growth marketing retainers are currently unavailable.',
    },
  ],
};
