import { NEXUS_STUDIO_KNOWLEDGE } from '../data/nexusKnowledge';

export interface InstantResponse {
  text: string;
  action?: 'START_PROJECT' | 'OPEN_PRICING' | 'OPEN_WEB_DEV' | 'OPEN_APP_DEV' | 'OPEN_AUTOMATION' | 'OPEN_AI_AGENTS' | 'CONTACT_STUDIO';
}

/**
 * High-performance Instant Studio Intelligence Engine
 * Delivers sub-100ms instant, verified responses for all studio capabilities,
 * pricing packages, tech stack, founder details, and inquiry workflows.
 */
export function resolveInstantQuery(rawQuery: string, userName?: string): InstantResponse | null {
  const p = rawQuery.toLowerCase().trim();
  const greeting = userName ? `Hello ${userName}. ` : '';

  // 1. Quick Prompts Exact & Near Matches
  if (
    p.includes('interactive 3d architecture') ||
    p.includes('website development services') ||
    p === 'web development'
  ) {
    return {
      text: `${greeting}**Website Development at Tameem Nexus Studio**:\nWe engineer high-performance, kinetic web experiences blending custom 3D WebGL scenes with modern React architectures.\n\n• **Core Stack**: React 19, TypeScript, Three.js / WebGL, Tailwind CSS, Vite\n• **Key Deliverables**: Bespoke 3D scene architecture, fluid micro-interactions, 99+ Lighthouse performance scores, and conversion-optimized luxury UI\n• **Timeline & Budget**: 2–4 weeks, starting at ₹20,000\n\nWould you like to discuss your website concept or initiate an inquiry?`,
      action: 'OPEN_WEB_DEV',
    };
  }

  if (
    p.includes('what mobile app frameworks') ||
    p.includes('app frameworks and platforms') ||
    p === 'app development'
  ) {
    return {
      text: `${greeting}**App Development at Tameem Nexus Studio**:\nWe build fluid, tactile cross-platform mobile applications engineered for exceptional speed and polish.\n\n• **Core Stack**: React Native, Swift, Kotlin, Firebase, WebSockets\n• **Key Deliverables**: App Store ready iOS & Android builds, biometric auth, offline-first sync, and push notification relays\n• **Timeline & Budget**: 4–8 weeks, starting at ₹60,000\n\nWould you like to explore building a mobile application?`,
      action: 'OPEN_APP_DEV',
    };
  }

  if (
    p.includes('how does software automation work') ||
    p === 'software automation'
  ) {
    return {
      text: `${greeting}**Software Automation at Tameem Nexus Studio**:\nWe eliminate repetitive human effort by architecting autonomous internal workflows and API synchronizations.\n\n• **Core Stack**: Node.js, Python, TypeScript, REST/GraphQL APIs, Custom Webhook Orchestrators\n• **Key Deliverables**: Autonomous workflow pipelines, CRM & ERP synchronizations, automated database cron jobs, and real-time error monitors\n• **Timeline & Budget**: 1–3 weeks, starting at ₹25,000\n\nWhat manual tasks or systems would you like to automate?`,
      action: 'OPEN_AUTOMATION',
    };
  }

  if (
    p.includes('what kind of ai agents') ||
    p.includes('google gemini integrations') ||
    p === 'ai agents'
  ) {
    return {
      text: `${greeting}**AI Agent Development at Tameem Nexus Studio**:\nWe craft autonomous AI copilots and intelligent orchestrators grounded in your proprietary business data.\n\n• **Core Stack**: Google Gemini API (@google/genai), Function Calling tools, RAG Vector Search, Multi-Agent frameworks\n• **Key Deliverables**: Custom grounded AI agents, automated tool execution, secure chat interfaces, and observability dashboards\n• **Timeline & Budget**: 2–5 weeks, starting at ₹2,35,000\n\nWould you like to build a custom AI agent for your business?`,
      action: 'OPEN_AI_AGENTS',
    };
  }

  if (
    p.includes('commission packages and pricing') ||
    p.includes('pricing tiers') ||
    p === 'pricing'
  ) {
    return {
      text: `${greeting}Our commission packages for bespoke engineering have been updated:\n\n• **Web Development** (Starting at ₹20,000):\n  Starter: ₹20,000 | Pro: ₹70,000 | Scale: ₹1,60,000+\n\n• **App Development** (Starting at ₹60,000):\n  Starter: ₹60,000 | Growth: ₹1,35,000 | Pro: ₹2,85,000\n\n• **Software Automation** (Starting at ₹25,000):\n  Starter: ₹25,000 | Growth: ₹75,000 | Pro: ₹1,60,000\n\n• **UI/UX Design** (Starting at ₹15,000):\n  Foundation: ₹15,000 | Growth: ₹40,000 | Product: ₹85,000\n\n• **AI Solutions & Custom Software** (Starting at ₹2,35,000)\n\nWould you like to review the complete pricing breakdown or start a project inquiry?`,
      action: 'OPEN_PRICING',
    };
  }

  if (
    p.includes('how do i start a project') ||
    p === 'start a project'
  ) {
    return {
      text: `${greeting}Starting a commission with Tameem Nexus Studio is streamlined:\n\n1. Click **START A PROJECT** to share your project scope, target timeline, and budget.\n2. Mohammad Tameem Imran and our engineering leads will review your brief within 24–48 hours.\n3. We arrange a technical discovery session to finalize architecture and milestones.\n\nReady to get started?`,
      action: 'START_PROJECT',
    };
  }

  // 2. Unavailable Services
  if (
    p.includes('3d motion') ||
    p.includes('cinema') ||
    p.includes('render video') ||
    p.includes('ecommerce') ||
    p.includes('e-commerce') ||
    p.includes('shopify') ||
    p.includes('seo') ||
    p.includes('growth marketing') ||
    p.includes('marketing agency')
  ) {
    return {
      text: `${greeting}Please note that **3D Motion cinema video rendering**, **Mass E-Commerce catalog platforms**, and **SEO & Growth marketing retainers** are **Currently Unavailable** at Tameem Nexus Studio.\n\nWe specialize exclusively in our 4 core engineering disciplines:\n• **Website Development** (Interactive WebGL)\n• **App Development** (iOS & Android)\n• **Software Automation** (Autonomous Pipelines)\n• **AI Agent Development** (Gemini Copilots)\n\nWould you like to explore any of these available disciplines?`,
      action: 'OPEN_WEB_DEV',
    };
  }

  // 3. Pricing, Cost, Budget, Packages
  if (
    p.includes('pric') ||
    p.includes('cost') ||
    p.includes('budget') ||
    p.includes('tier') ||
    p.includes('quote') ||
    p.includes('rate') ||
    p.includes('how much') ||
    p.includes('package')
  ) {
    return {
      text: `${greeting}Our commission packages for bespoke engineering have been updated:\n\n• **Web Development** (Starting at ₹20,000):\n  Starter: ₹20,000 | Pro: ₹70,000 | Scale: ₹1,60,000+\n\n• **App Development** (Starting at ₹60,000):\n  Starter: ₹60,000 | Growth: ₹1,35,000 | Pro: ₹2,85,000\n\n• **Software Automation** (Starting at ₹25,000):\n  Starter: ₹25,000 | Growth: ₹75,000 | Pro: ₹1,60,000\n\n• **UI/UX Design** (Starting at ₹15,000):\n  Foundation: ₹15,000 | Growth: ₹40,000 | Product: ₹85,000\n\n• **AI Solutions & Custom Software** (Starting at ₹2,35,000)\n\nWould you like to review the complete pricing breakdown or start a project inquiry?`,
      action: 'OPEN_PRICING',
    };
  }

  // 4. Web Development, Three.js, WebGL, Front-end
  if (
    p.includes('website') ||
    p.includes('web development') ||
    p.includes('web dev') ||
    p.includes('three.js') ||
    p.includes('threejs') ||
    p.includes('webgl') ||
    p.includes('frontend') ||
    p.includes('front-end') ||
    p.includes('landing page') ||
    p.includes('portfolio')
  ) {
    return {
      text: `${greeting}**Website Development at Tameem Nexus Studio**:\nWe engineer high-performance, kinetic web experiences blending custom 3D WebGL scenes with modern React architectures.\n\n• **Core Stack**: React 19, TypeScript, Three.js / WebGL, Tailwind CSS, Vite\n• **Key Deliverables**: Bespoke 3D scene architecture, fluid micro-interactions, 99+ Lighthouse performance scores, and conversion-optimized luxury UI\n• **Timeline & Budget**: 2–4 weeks, starting at ₹20,000\n\nWould you like to discuss your website concept or initiate an inquiry?`,
      action: 'OPEN_WEB_DEV',
    };
  }

  // 5. App Development, Mobile, iOS, Android
  if (
    p.includes('app') ||
    p.includes('mobile') ||
    p.includes('ios') ||
    p.includes('android') ||
    p.includes('react native') ||
    p.includes('flutter') ||
    p.includes('swift')
  ) {
    return {
      text: `${greeting}**App Development at Tameem Nexus Studio**:\nWe build fluid, tactile cross-platform mobile applications engineered for exceptional speed and polish.\n\n• **Core Stack**: React Native, Swift, Kotlin, Firebase, WebSockets\n• **Key Deliverables**: App Store ready iOS & Android builds, biometric auth, offline-first sync, and push notification relays\n• **Timeline & Budget**: 4–8 weeks, starting at ₹60,000\n\nWould you like to explore building a mobile application?`,
      action: 'OPEN_APP_DEV',
    };
  }

  // 6. Automation, Workflows, Webhooks
  if (
    p.includes('automation') ||
    p.includes('automate') ||
    p.includes('pipeline') ||
    p.includes('webhook') ||
    p.includes('workflow') ||
    p.includes('n8n') ||
    p.includes('zapier') ||
    p.includes('make.com') ||
    p.includes('crm')
  ) {
    return {
      text: `${greeting}**Software Automation at Tameem Nexus Studio**:\nWe eliminate repetitive human effort by architecting autonomous internal workflows and API synchronizations.\n\n• **Core Stack**: Node.js, Python, TypeScript, REST/GraphQL APIs, Custom Webhook Orchestrators\n• **Key Deliverables**: Autonomous workflow pipelines, CRM & ERP synchronizations, automated database cron jobs, and real-time error monitors\n• **Timeline & Budget**: 1–3 weeks, starting at ₹25,000\n\nWhat manual tasks or systems would you like to automate?`,
      action: 'OPEN_AUTOMATION',
    };
  }

  // 7. AI Agents, Gemini, Copilots, LLM
  if (
    p.includes('ai') ||
    p.includes('agent') ||
    p.includes('gemini') ||
    p.includes('llm') ||
    p.includes('bot') ||
    p.includes('copilot') ||
    p.includes('artificial intelligence') ||
    p.includes('rag')
  ) {
    return {
      text: `${greeting}**AI Agent Development at Tameem Nexus Studio**:\nWe craft autonomous AI copilots and intelligent orchestrators grounded in your proprietary business data.\n\n• **Core Stack**: Google Gemini API (@google/genai), Function Calling tools, RAG Vector Search, Multi-Agent frameworks\n• **Key Deliverables**: Custom grounded AI agents, automated tool execution, secure chat interfaces, and observability dashboards\n• **Timeline & Budget**: 2–5 weeks, starting at $4,500\n\nWould you like to build a custom AI agent for your business?`,
      action: 'OPEN_AI_AGENTS',
    };
  }

  // 8. Reviews, Ratings, Testimonials
  if (
    p.includes('review') ||
    p.includes('testimonial') ||
    p.includes('rating') ||
    p.includes('feedback') ||
    p.includes('satisfied') ||
    p.includes('reputation') ||
    p.includes('track record')
  ) {
    return {
      text: `${greeting}**Verified Client Track Record**:\nTameem Nexus Studio maintains **18+ verified production reviews** from global founders and CTOs:\n\n• **Average Rating**: 4.98 / 5.0 Stars\n• **Milestone Adherence**: 100% On-Time Delivery\n• **Client Retention**: 98% Retained for Ongoing Sprints\n\nYou can review all client testimonials directly in the **Reviews & Trust Metrics** section on this site. Would you like to check our client feedback or discuss your requirements?`,
      action: 'START_PROJECT',
    };
  }

  // 9. Start a project, Hire, Consultation, Contact
  if (
    p.includes('start') ||
    p.includes('hire') ||
    p.includes('inquiry') ||
    p.includes('consult') ||
    p.includes('collaborate') ||
    p.includes('work together') ||
    p.includes('book')
  ) {
    return {
      text: `${greeting}Starting a commission with Tameem Nexus Studio is streamlined:\n\n1. Click **START A PROJECT** to share your project scope, target timeline, and budget.\n2. Mohammad Tameem Imran and our engineering leads will review your brief within 24–48 hours.\n3. We arrange a technical discovery session to finalize architecture and milestones.\n\nReady to get started?`,
      action: 'START_PROJECT',
    };
  }

  // 10. Founder & Studio details
  if (
    p.includes('who are you') ||
    p.includes('who is') ||
    p.includes('founder') ||
    p.includes('tameem') ||
    p.includes('about') ||
    p.includes('contact') ||
    p.includes('email') ||
    p.includes('location')
  ) {
    return {
      text: `${greeting}**TAMEEM NEXUS STUDIO** is a premier digital engineering studio founded by **Mohammad Tameem Imran**.\n\n• **Philosophy**: "Where the organic meets the digital, transforming visions into masterpieces that inspire and endure."\n• **Focus**: High-craft WebGL development, mobile apps, software automation, and custom AI agents.\n• **Contact**: tameemimran253@gmail.com\n• **Status**: Active for select commissions.\n\nHow can we help bring your digital vision to life?`,
      action: 'CONTACT_STUDIO',
    };
  }

  // 11. Process & Timeline
  if (
    p.includes('process') ||
    p.includes('methodology') ||
    p.includes('how do you work') ||
    p.includes('timeline') ||
    p.includes('delivery time') ||
    p.includes('turnaround')
  ) {
    return {
      text: `${greeting}Our engineering lifecycle follows 4 rigorous phases:\n\n1. **Discovery & Blueprint**: Deep analysis of technical architecture and brand aesthetics.\n2. **Kinetic Prototyping**: Interactive 3D and UI prototyping with tactile feedback.\n3. **Engineering & Automation**: Full-stack implementation, database design, and AI integration.\n4. **Launch & Expansion**: Performance auditing (99+ Lighthouse), cloud deployment, and handoff.`,
      action: 'OPEN_WEB_DEV',
    };
  }

  // 12. Dashboard, Custom Software, Portal
  if (
    p.includes('dashboard') ||
    p.includes('portal') ||
    p.includes('saas') ||
    p.includes('platform') ||
    p.includes('fintech') ||
    p.includes('software')
  ) {
    return {
      text: `${greeting}**Custom Dashboard & Portal Architecture**:\nWe build high-density, real-time administrative dashboards and SaaS portals combining custom WebGL data visualizers with robust full-stack backends.\n\n• **Features**: Live metrics streaming, role-based access control, responsive charts, and automated webhook integration\n• **Delivery**: 3–6 weeks depending on scale\n\nWould you like to review pricing or share your dashboard requirements?`,
      action: 'START_PROJECT',
    };
  }

  return null;
}
