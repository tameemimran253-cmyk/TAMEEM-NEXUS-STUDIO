export interface PricingTier {
  id: string;
  name: string;
  price: string;
  priceFormatted?: string;
  isPopular?: boolean;
  bestFor: string;
  features: string[];
  cta: string;
  note?: string;
}

export interface ServiceData {
  id: string;
  number: string;
  title: string;
  status: 'available' | 'unavailable';
  shortDescription: string;
  techTags: string[];
  demoId?: string;
  demoName?: string;
  demoTagline?: string;
  pricingStarting?: string;
  pricingDisplay?: string;
  pricingTiers?: PricingTier[];
  isPrimary?: boolean;
  unavailableReason?: string;
}

export const servicesDataFull: ServiceData[] = [
  {
    id: 'web-dev',
    number: '01',
    title: 'Web Development',
    status: 'available',
    shortDescription:
      'High-performance websites and web applications engineered with modern frameworks, conversion-focused UX, scalable architecture, and production-ready performance.',
    techTags: ['React', 'Next.js', 'Node.js', 'TypeScript', 'Tailwind CSS'],
    demoId: 'nova-saas',
    demoName: 'NOVA — AI SaaS Platform',
    demoTagline: 'Next.js 14 Production SaaS Architecture',
    pricingStarting: '₹20,000',
    pricingDisplay: 'From ₹20,000',
    pricingTiers: [
      {
        id: 'web-starter',
        name: 'STARTER',
        price: '₹20,000',
        bestFor: 'Small businesses, portfolios and landing pages.',
        features: [
          'Up to 5 pages',
          'Responsive design',
          'Modern UI',
          'Contact form',
          'WhatsApp CTA',
          'Basic SEO',
          'Performance optimization',
          'Analytics setup',
          '1 revision round',
          '30-day bug support'
        ],
        cta: 'Start Project'
      },
      {
        id: 'web-pro',
        name: 'PRO',
        price: '₹70,000',
        isPopular: true,
        bestFor: 'Growing businesses and professional brands.',
        features: [
          'Up to 10 pages',
          'Custom UI/UX',
          'React / Next.js',
          'CMS integration',
          'Advanced SEO',
          'Analytics',
          'Lead generation system',
          'API integrations',
          'Performance optimization',
          'Deployment',
          '2 revision rounds',
          '60-day support'
        ],
        cta: 'Build My Website'
      },
      {
        id: 'web-scale',
        name: 'SCALE',
        price: '₹1,60,000+',
        bestFor: 'High-growth companies and advanced web products.',
        features: [
          'Custom architecture',
          'Advanced Next.js application',
          'Authentication',
          'Database integration',
          'Admin dashboard',
          'Third-party APIs',
          'Advanced animations',
          'Advanced SEO',
          'Security configuration',
          'Cloud deployment',
          'CI/CD',
          'Performance monitoring',
          '90-day support'
        ],
        cta: 'Build My Platform',
        note: 'Final pricing depends on project scope and integrations.'
      }
    ]
  },
  {
    id: 'app-dev',
    number: '02',
    title: 'App Development',
    status: 'available',
    isPrimary: true,
    shortDescription:
      'Native-quality mobile experiences engineered for iOS and Android with scalable backend systems, secure APIs, payments, notifications, and polished product experiences.',
    techTags: ['Flutter', 'React Native', 'Swift', 'Kotlin', 'Firebase'],
    demoId: 'orbit-app',
    demoName: 'ORBIT — Mobile Commerce App',
    demoTagline: 'iOS & Android Universal Mobile Ecosystem',
    pricingStarting: '₹60,000',
    pricingDisplay: 'From ₹60,000',
    pricingTiers: [
      {
        id: 'app-starter',
        name: 'APP STARTER',
        price: '₹60,000',
        bestFor: 'MVPs, single-platform apps, and prototype validation.',
        features: [
          'Android OR iOS',
          'Up to 8 screens',
          'Responsive UI',
          'Basic authentication',
          'Basic API integration',
          'Firebase integration',
          'Testing',
          'Deployment assistance'
        ],
        cta: 'Start App'
      },
      {
        id: 'app-growth',
        name: 'APP GROWTH',
        price: '₹1,35,000',
        bestFor: 'Growing products needing dual-platform reach.',
        features: [
          'Android + iOS',
          'Up to 15 screens',
          'Custom UI/UX',
          'Authentication',
          'API integration',
          'Push notifications',
          'Analytics',
          'Payment integration',
          'Testing',
          'Store deployment assistance'
        ],
        cta: 'Build Growth App'
      },
      {
        id: 'app-pro',
        name: 'APP PRO',
        price: '₹2,85,000',
        isPopular: true,
        bestFor: 'Full-featured digital mobile products & platforms.',
        features: [
          'Android + iOS',
          'Advanced UI/UX',
          'Custom backend',
          'Authentication',
          'User roles',
          'Payments',
          'Push notifications',
          'Real-time functionality',
          'Admin dashboard',
          'Analytics',
          'Cloud deployment',
          'App Store / Play Store preparation',
          '60-day support'
        ],
        cta: 'Build Pro App'
      },
      {
        id: 'app-scale',
        name: 'APP SCALE',
        price: '₹5,85,000',
        bestFor: 'Scaling businesses with real-time multi-user operations.',
        features: [
          'Advanced mobile architecture',
          'Android + iOS',
          'Advanced backend',
          'Advanced admin panel',
          'Multiple user roles',
          'Real-time features',
          'Payment systems',
          'Notifications',
          'Third-party integrations',
          'Analytics',
          'Cloud infrastructure',
          'CI/CD',
          'Security hardening',
          'Performance optimization',
          '90-day support'
        ],
        cta: 'Scale My App'
      },
      {
        id: 'app-enterprise',
        name: 'APP ENTERPRISE',
        price: 'Custom Quote',
        priceFormatted: '₹11,85,000+',
        bestFor: 'Large enterprise mobile ecosystems and custom roadmaps.',
        features: [
          'Enterprise architecture',
          'Complex workflows',
          'Multi-role systems',
          'Advanced APIs',
          'Custom backend',
          'Advanced security',
          'Cloud architecture',
          'Monitoring',
          'CI/CD',
          'Advanced analytics',
          'Multiple integrations',
          'Dedicated development roadmap',
          'Long-term maintenance option'
        ],
        cta: 'Talk About Enterprise'
      }
    ]
  },
  {
    id: 'ui-ux',
    number: '03',
    title: 'UI/UX Design',
    status: 'available',
    shortDescription:
      'Human-centered digital experiences combining research, interaction design, visual systems, prototyping, and conversion-focused product experiences.',
    techTags: ['Figma', 'Design Systems', 'Prototyping', 'User Research', 'Interaction Design'],
    demoId: 'nebula-design',
    demoName: 'NEBULA — SaaS Dashboard Experience',
    demoTagline: 'Design System, Component Tokens & High-Fidelity UX',
    pricingStarting: '₹15,000',
    pricingDisplay: 'From ₹15,000',
    pricingTiers: [
      {
        id: 'ui-foundation',
        name: 'UI FOUNDATION',
        price: '₹15,000',
        bestFor: 'Landing page concepts, simple visual wireframes & MVP UI.',
        features: [
          'Up to 5 screens',
          'Wireframes',
          'Basic visual design',
          'Responsive concepts',
          'Figma source',
          '1 revision'
        ],
        cta: 'Start Design'
      },
      {
        id: 'ui-growth',
        name: 'UI GROWTH',
        price: '₹40,000',
        bestFor: 'Web & mobile applications requiring structured user flows.',
        features: [
          'Up to 10 screens',
          'User flow',
          'Wireframes',
          'High-fidelity UI',
          'Responsive design',
          'Interactive prototype',
          'Basic design system',
          '2 revisions'
        ],
        cta: 'Design My Product'
      },
      {
        id: 'ui-product',
        name: 'PRODUCT DESIGN',
        price: '₹85,000',
        isPopular: true,
        bestFor: 'Complete end-to-end product design & design system handoff.',
        features: [
          'Up to 20 screens',
          'UX research',
          'User flows',
          'Wireframes',
          'High-fidelity UI',
          'Interactive prototype',
          'Design system',
          'Responsive states',
          'Developer handoff',
          '3 revisions'
        ],
        cta: 'Build Product UX'
      },
      {
        id: 'ui-pro',
        name: 'EXPERIENCE PRO',
        price: '₹1,85,000',
        bestFor: 'Complex multi-platform digital software & design systems.',
        features: [
          '30+ screens',
          'UX strategy',
          'User research',
          'Information architecture',
          'Advanced interaction design',
          'Complete design system',
          'Prototype',
          'Mobile + desktop',
          'Developer handoff',
          'Usability review'
        ],
        cta: 'Create Premium UX'
      },
      {
        id: 'ui-enterprise',
        name: 'ENTERPRISE DESIGN',
        price: '₹3,85,000+',
        bestFor: 'Enterprise software platforms and design governance.',
        features: [
          'Large product ecosystem',
          'Extensive UX research',
          'Multiple user journeys',
          'Enterprise design system',
          'Complex dashboards',
          'Mobile + web',
          'Advanced prototyping',
          'Accessibility considerations',
          'Developer handoff',
          'Design governance'
        ],
        cta: 'Discuss Enterprise UX'
      }
    ]
  },
  {
    id: 'automation',
    number: '04',
    title: 'Software Automation',
    status: 'available',
    shortDescription:
      'Transform repetitive business processes into intelligent automated workflows using APIs, AI agents, databases, CRM integrations, and workflow orchestration.',
    techTags: ['AI Agents', 'n8n', 'Make', 'APIs', 'Python'],
    demoId: 'flowx-automation',
    demoName: 'FLOWX — Intelligent Business Automation',
    demoTagline: 'Autonomous AI Ingestion & Multi-Node Workflow Sync',
    pricingStarting: '₹25,000',
    pricingDisplay: 'From ₹25,000',
    pricingTiers: [
      {
        id: 'auto-starter',
        name: 'AUTOMATION STARTER',
        price: '₹25,000',
        bestFor: 'Single automated pipeline between core business tools.',
        features: [
          '1 workflow',
          'Up to 3 integrations',
          'Basic automation',
          'API connection',
          'Email automation',
          'Error handling',
          'Basic documentation',
          '30-day support'
        ],
        cta: 'Automate One Workflow'
      },
      {
        id: 'auto-growth',
        name: 'AUTOMATION GROWTH',
        price: '₹75,000',
        bestFor: 'Connected multi-app pipelines for sales and marketing.',
        features: [
          'Up to 3 workflows',
          'Up to 6 integrations',
          'CRM automation',
          'Email automation',
          'Lead automation',
          'Database connection',
          'Notifications',
          'Monitoring',
          'Documentation'
        ],
        cta: 'Automate My Business'
      },
      {
        id: 'auto-pro',
        name: 'AI AUTOMATION PRO',
        price: '₹1,60,000',
        isPopular: true,
        bestFor: 'Intelligent AI agent pipelines and automated business operations.',
        features: [
          '5–8 workflows',
          'AI-powered steps',
          'AI agents',
          'CRM integration',
          'API integrations',
          'Database automation',
          'Lead qualification',
          'Automated reporting',
          'Admin dashboard',
          'Monitoring',
          '60-day support'
        ],
        cta: 'Build AI Automation'
      },
      {
        id: 'auto-scale',
        name: 'AUTOMATION SCALE',
        price: '₹3,35,000',
        bestFor: 'Scaling companies with custom Python services and ERPs.',
        features: [
          '10+ workflows',
          'Advanced API architecture',
          'AI agents',
          'CRM + ERP integrations',
          'Custom Python services',
          'Database systems',
          'Advanced dashboards',
          'Error recovery',
          'Logging',
          'Monitoring',
          'Cloud deployment',
          'CI/CD'
        ],
        cta: 'Scale Automation'
      },
      {
        id: 'auto-enterprise',
        name: 'ENTERPRISE AUTOMATION',
        price: '₹7,35,000+',
        bestFor: 'Enterprise automation orchestration and custom infrastructure.',
        features: [
          'Enterprise automation architecture',
          'Multiple business systems',
          'AI agent workflows',
          'ERP / CRM integrations',
          'Advanced security',
          'Custom APIs',
          'Cloud infrastructure',
          'Monitoring',
          'Audit logs',
          'Advanced analytics',
          'Long-term support architecture'
        ],
        cta: 'Build Enterprise Automation'
      }
    ]
  },
  {
    id: '3d-motion',
    number: '05',
    title: '3D Motion',
    status: 'unavailable',
    unavailableReason: 'Capacity Reserved — New slots opening soon',
    shortDescription:
      'Immersive 3D experiences, product visualization, motion systems, and interactive digital environments.',
    techTags: ['Three.js', 'WebGL', 'Blender', 'GSAP']
  },
  {
    id: 'ecommerce',
    number: '06',
    title: 'E-Commerce',
    status: 'unavailable',
    unavailableReason: 'Under Pipeline Upgrade — Coming Soon',
    shortDescription:
      'High-converting digital commerce experiences with modern storefronts, payments, product systems, and scalable commerce infrastructure.',
    techTags: ['Shopify', 'WooCommerce', 'Next.js', 'Payments']
  },
  {
    id: 'seo-growth',
    number: '07',
    title: 'SEO & Growth',
    status: 'unavailable',
    unavailableReason: 'Service Expansion in Progress — Coming Soon',
    shortDescription:
      'Technical SEO, content systems, analytics, conversion optimization, and sustainable organic growth strategies.',
    techTags: ['Technical SEO', 'Analytics', 'Content', 'CRO']
  },
  {
    id: 'ai-solutions',
    number: '08',
    title: 'AI Solutions & Custom Software',
    status: 'available',
    shortDescription:
      'Build intelligent digital products with AI assistants, custom software, SaaS platforms, APIs, dashboards, databases, and AI-powered workflows.',
    techTags: ['AI', 'Python', 'APIs', 'SaaS', 'Cloud'],
    demoId: 'apex-ai',
    demoName: 'APEX — AI Business Intelligence Platform',
    demoTagline: 'Intelligent Autonomous Decision Core & Analytics Stream',
    pricingStarting: 'From ₹2,35,000',
    pricingDisplay: 'Custom Project',
    pricingTiers: [
      {
        id: 'ai-custom',
        name: 'CUSTOM PROJECT',
        price: 'From ₹2,35,000',
        bestFor: 'Startups and businesses building bespoke AI products & custom software.',
        features: [
          'Custom AI assistant / LLM integration',
          'Proprietary data ingestion pipelines',
          'Vector database & semantic search',
          'Custom full-stack web/cloud application',
          'Role-based access & authentication',
          'Interactive intelligence dashboard',
          'Automated data reports & triggers',
          'API orchestration & secure keys management',
          'End-to-end cloud deployment & monitoring',
          'Post-launch support & tuning'
        ],
        cta: 'Discuss My Product',
        note: 'Every custom software project is architected to your exact technical specifications.'
      }
    ]
  }
];

export const trustPoints = [
  'Transparent project scope',
  'Modern production-ready technology',
  'Responsive design',
  'Post-launch support'
];
