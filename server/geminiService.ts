import { GoogleGenAI } from '@google/genai';
import { NEXUS_STUDIO_KNOWLEDGE } from '../src/data/nexusKnowledge';

let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Fast low-latency models in priority order
const CANDIDATE_MODELS = ['gemini-3.1-flash-lite', 'gemini-flash-latest'];

/**
 * Direct Instant Match for common high-confidence studio queries
 * Returns in < 5ms without waiting for external API latency
 */
export function getDirectInstantMatch(userPrompt: string, userName?: string): { text: string; action?: string } | null {
  const p = userPrompt.toLowerCase().trim();

  // 1. Pricing & Cost
  if (
    p.includes('price') ||
    p.includes('pricing') ||
    p.includes('cost') ||
    p.includes('budget') ||
    p.includes('tier') ||
    p.includes('quote') ||
    p.includes('rate') ||
    p.includes('package')
  ) {
    return getGroundedFallbackResponse('pricing', userName);
  }

  // 2. Unavailable services
  if (
    p.includes('3d motion') ||
    p.includes('cinema') ||
    p.includes('render video') ||
    p.includes('ecommerce') ||
    p.includes('e-commerce') ||
    p.includes('shopify') ||
    p.includes('seo') ||
    p.includes('marketing agency')
  ) {
    return getGroundedFallbackResponse('3d motion', userName);
  }

  // 3. Web Development
  if (
    p.includes('website') ||
    p.includes('web development') ||
    p.includes('three.js') ||
    p.includes('webgl') ||
    p.includes('frontend') ||
    p.includes('landing page')
  ) {
    return getGroundedFallbackResponse('web development', userName);
  }

  // 4. App Development
  if (
    p.includes('app development') ||
    p.includes('mobile app') ||
    p.includes('ios') ||
    p.includes('android') ||
    p.includes('react native') ||
    p.includes('flutter')
  ) {
    return getGroundedFallbackResponse('app development', userName);
  }

  // 5. Software Automation
  if (
    p.includes('automation') ||
    p.includes('automate') ||
    p.includes('pipeline') ||
    p.includes('webhook') ||
    p.includes('workflow') ||
    p.includes('n8n') ||
    p.includes('zapier') ||
    p.includes('make.com')
  ) {
    return getGroundedFallbackResponse('software automation', userName);
  }

  // 6. AI Agent Development
  if (
    p.includes('ai agent') ||
    p.includes('agent') ||
    p.includes('gemini') ||
    p.includes('llm') ||
    p.includes('bot') ||
    p.includes('copilot') ||
    p.includes('artificial intelligence')
  ) {
    return getGroundedFallbackResponse('ai agent', userName);
  }

  // 7. Reviews & Ratings
  if (
    p.includes('review') ||
    p.includes('testimonial') ||
    p.includes('rating') ||
    p.includes('feedback') ||
    p.includes('satisfied') ||
    p.includes('reputation')
  ) {
    return getGroundedFallbackResponse('review', userName);
  }

  // 8. Start a Project / Hire / Contact
  if (
    p.includes('start') ||
    p.includes('hire') ||
    p.includes('inquiry') ||
    p.includes('consult') ||
    p.includes('collaborate') ||
    p.includes('work together') ||
    p.includes('book')
  ) {
    return getGroundedFallbackResponse('start a project', userName);
  }

  // 9. Founder & Studio
  if (
    p.includes('who are you') ||
    p.includes('who is') ||
    p.includes('founder') ||
    p.includes('tameem') ||
    p.includes('about') ||
    p.includes('contact') ||
    p.includes('email')
  ) {
    return getGroundedFallbackResponse('founder', userName);
  }

  // 10. Process & Methodology
  if (
    p.includes('process') ||
    p.includes('methodology') ||
    p.includes('how do you work') ||
    p.includes('timeline') ||
    p.includes('delivery time')
  ) {
    return getGroundedFallbackResponse('process', userName);
  }

  return null;
}

/**
 * Intelligent Grounded Knowledge Engine for Tameem Nexus Studio
 * Used for instant direct responses or low-latency fallbacks
 */
export function getGroundedFallbackResponse(userPrompt: string, userName?: string): { text: string; action?: string } {
  const p = userPrompt.toLowerCase().trim();
  const greeting = userName ? `Hello ${userName}. ` : '';

  // 1. Unavailable services queries
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

  // 2. Pricing & Cost
  if (p.includes('pric') || p.includes('cost') || p.includes('budget') || p.includes('tier') || p.includes('rate') || p.includes('how much') || p.includes('quote') || p.includes('package')) {
    return {
      text: `${greeting}Our commission packages for bespoke engineering have been updated:\n\n• **Web Development** (Starting at ₹20,000):\n  Starter: ₹20,000 | Pro: ₹70,000 | Scale: ₹1,60,000+\n\n• **App Development** (Starting at ₹60,000):\n  Starter: ₹60,000 | Growth: ₹1,35,000 | Pro: ₹2,85,000\n\n• **Software Automation** (Starting at ₹25,000):\n  Starter: ₹25,000 | Growth: ₹75,000 | Pro: ₹1,60,000\n\n• **UI/UX Design** (Starting at ₹15,000):\n  Foundation: ₹15,000 | Growth: ₹40,000 | Product: ₹85,000\n\n• **AI Solutions & Custom Software** (Starting at ₹2,35,000)\n\nWould you like to review the complete pricing breakdown or start a project inquiry?`,
      action: 'OPEN_PRICING',
    };
  }

  // 3. Web Development
  if (p.includes('web') || p.includes('website') || p.includes('three.js') || p.includes('threejs') || p.includes('webgl') || p.includes('frontend') || p.includes('react')) {
    return {
      text: `${greeting}**Website Development at Tameem Nexus Studio**:\nWe engineer high-performance, kinetic web experiences blending custom 3D WebGL scenes with modern React architectures.\n\n• **Core Stack**: React 19, TypeScript, Three.js / WebGL, Tailwind CSS, Vite\n• **Key Deliverables**: Bespoke 3D scene architecture, fluid micro-interactions, 99+ Lighthouse performance scores, and conversion-optimized luxury UI\n• **Timeline & Budget**: 2–4 weeks, starting at ₹20,000\n\nWould you like to discuss your website concept or initiate an inquiry?`,
      action: 'OPEN_WEB_DEV',
    };
  }

  // 4. App Development
  if (p.includes('app') || p.includes('mobile') || p.includes('ios') || p.includes('android') || p.includes('react native') || p.includes('swift') || p.includes('flutter')) {
    return {
      text: `${greeting}**App Development at Tameem Nexus Studio**:\nWe build fluid, tactile cross-platform mobile applications engineered for exceptional speed and polish.\n\n• **Core Stack**: React Native, Swift, Kotlin, Firebase, WebSockets\n• **Key Deliverables**: App Store ready iOS & Android builds, biometric auth, offline-first sync, and push notification relays\n• **Timeline & Budget**: 4–8 weeks, starting at ₹60,000\n\nWould you like to explore building a mobile application?`,
      action: 'OPEN_APP_DEV',
    };
  }

  // 5. Software Automation
  if (p.includes('automation') || p.includes('automate') || p.includes('pipeline') || p.includes('webhook') || p.includes('workflow') || p.includes('integration') || p.includes('crm') || p.includes('zapier') || p.includes('make') || p.includes('n8n')) {
    return {
      text: `${greeting}**Software Automation at Tameem Nexus Studio**:\nWe eliminate repetitive human effort by architecting autonomous internal workflows and API synchronizations.\n\n• **Core Stack**: Node.js, Python, TypeScript, REST/GraphQL APIs, Custom Webhook Orchestrators\n• **Key Deliverables**: Autonomous workflow pipelines, CRM & ERP synchronizations, automated database cron jobs, and real-time error monitors\n• **Timeline & Budget**: 1–3 weeks, starting at ₹25,000\n\nWhat manual tasks or systems would you like to automate?`,
      action: 'OPEN_AUTOMATION',
    };
  }

  // 6. AI Agent Development
  if (p.includes('ai') || p.includes('agent') || p.includes('gemini') || p.includes('llm') || p.includes('bot') || p.includes('rag') || p.includes('copilot') || p.includes('artificial intelligence')) {
    return {
      text: `${greeting}**AI Agent Development at Tameem Nexus Studio**:\nWe craft autonomous AI copilots and intelligent orchestrators grounded in your proprietary business data.\n\n• **Core Stack**: Google Gemini API (@google/genai), Function Calling tools, RAG Vector Search, Multi-Agent frameworks\n• **Key Deliverables**: Custom grounded AI agents, automated tool execution, secure chat interfaces, and observability dashboards\n• **Timeline & Budget**: 2–5 weeks, starting at ₹2,35,000\n\nWould you like to build a custom AI agent for your business?`,
      action: 'OPEN_AI_AGENTS',
    };
  }

  // 7. Reviews & Testimonials
  if (p.includes('review') || p.includes('testimonial') || p.includes('rating') || p.includes('feedback') || p.includes('satisfaction') || p.includes('reputation')) {
    return {
      text: `${greeting}**Verified Client Track Record**:\nTameem Nexus Studio maintains **18+ verified production reviews** from global founders and CTOs:\n\n• **Average Rating**: 4.98 / 5.0 Stars\n• **Milestone Adherence**: 100% On-Time Delivery\n• **Client Retention**: 98% Retained for Ongoing Sprints\n\nYou can review all client testimonials directly in the **Reviews & Trust Metrics** section on this site. Would you like to check our client feedback or discuss your requirements?`,
      action: 'START_PROJECT',
    };
  }

  // 8. Founder & Studio Info
  if (p.includes('who are you') || p.includes('who is') || p.includes('founder') || p.includes('tameem') || p.includes('about') || p.includes('location') || p.includes('contact')) {
    return {
      text: `${greeting}**TAMEEM NEXUS STUDIO** is a premier digital engineering studio founded by **Mohammad Tameem Imran**.\n\n• **Philosophy**: "Where the organic meets the digital, transforming visions into masterpieces that inspire and endure."\n• **Focus**: High-craft WebGL development, mobile apps, software automation, and custom AI agents.\n• **Contact**: tameemimran253@gmail.com\n• **Status**: Active for select commissions.\n\nHow can we help bring your digital vision to life?`,
      action: 'CONTACT_STUDIO',
    };
  }

  // 9. Start a project / Inquiry
  if (p.includes('start') || p.includes('hire') || p.includes('inquiry') || p.includes('consult') || p.includes('work together') || p.includes('collaborate')) {
    return {
      text: `${greeting}Starting a commission with Tameem Nexus Studio is streamlined:\n\n1. Click **START A PROJECT** to share your project scope, target timeline, and budget.\n2. Mohammad Tameem Imran and our engineering leads will review your brief within 24–48 hours.\n3. We arrange a technical discovery session to finalize architecture and milestones.\n\nReady to get started?`,
      action: 'START_PROJECT',
    };
  }

  // 10. Process / Methodology
  if (p.includes('process') || p.includes('how do you work') || p.includes('steps') || p.includes('timeline')) {
    return {
      text: `${greeting}Our engineering lifecycle follows 4 rigorous phases:\n\n1. **Discovery & Blueprint**: Deep analysis of technical architecture and brand aesthetics.\n2. **Kinetic Prototyping**: Interactive 3D and UI prototyping with tactile feedback.\n3. **Engineering & Automation**: Full-stack implementation, database design, and AI integration.\n4. **Launch & Expansion**: Performance auditing (99+ Lighthouse), cloud deployment, and handoff.`,
      action: 'OPEN_WEB_DEV',
    };
  }

  // Default helpful overview
  return {
    text: `${greeting}I am **NEXUS**, the AI assistant for **Tameem Nexus Studio**.\n\nI can assist you with:\n• **Website Development** (Interactive 3D WebGL)\n• **App Development** (iOS & Android)\n• **Software Automation** (Autonomous Pipelines)\n• **AI Agent Development** (Google Gemini Copilots)\n• **Pricing & Commission Packages**\n• **Starting a New Project**\n\nWhat would you like to explore?`,
    action: 'START_PROJECT',
  };
}

export async function askNexusAI(messages: ChatMessage[], userName?: string): Promise<{ text: string; action?: string }> {
  const lastUserMsg = messages[messages.length - 1]?.content || 'Hello';

  // 1. Instant check: If matching standard query, return instantly without unnecessary round-trip latency
  const directMatch = getDirectInstantMatch(lastUserMsg, userName);
  if (directMatch) {
    return directMatch;
  }

  const knowledgeSummary = JSON.stringify(NEXUS_STUDIO_KNOWLEDGE, null, 2);

  const systemInstruction = `
You are NEXUS, the official AI Business Assistant for TAMEEM NEXUS STUDIO.
Founder: Mohammad Tameem Imran.
Your purpose is to assist website visitors and clients in exploring the studio's services, pricing, development process, technologies, and starting project inquiries.

STRICT APPROVED BUSINESS KNOWLEDGE:
${knowledgeSummary}

CRITICAL RULES:
1. APPROVED SERVICES ONLY:
   - Website Development (Available)
   - App Development (Available)
   - Software Automation (Available)
   - AI Agent Development (Available)
2. UNAVAILABLE SERVICES:
   - 3D Motion (Currently Unavailable)
   - E-Commerce (Currently Unavailable)
   - SEO & Growth (Currently Unavailable)
   If asked about any unavailable service, you MUST explicitly state that it is currently unavailable and suggest available alternatives.
3. CONCISE & FAST: Keep answers concise, clear, and informative. Avoid excessive verbosity.
4. NAVIGATION ACTIONS: When recommending a service or inviting a user to start a project or see pricing, append an action tag at the very end of your response if relevant:
   - [ACTION:START_PROJECT] - when user expresses interest in building/pricing a project.
   - [ACTION:OPEN_WEB_DEV] - when discussing website development.
   - [ACTION:OPEN_APP_DEV] - when discussing mobile app development.
   - [ACTION:OPEN_AUTOMATION] - when discussing software automation.
   - [ACTION:OPEN_AI_AGENTS] - when discussing AI agent development.
   - [ACTION:OPEN_PRICING] - when discussing pricing plans.
   - [ACTION:CONTACT_STUDIO] - when user wants direct contact.
${userName ? `The current user's name is ${userName}. Greet them courteously if appropriate.` : ''}
`.trim();

  const client = getAIClient();

  // If Gemini API client is available, attempt ultra-fast generation with strict 1.8s timeout
  if (client) {
    const formattedContents = messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    for (const modelName of CANDIDATE_MODELS) {
      try {
        const generationPromise = client.models.generateContent({
          model: modelName,
          contents: formattedContents,
          config: {
            systemInstruction,
            temperature: 0.5,
            maxOutputTokens: 350,
          },
        });

        // Fast timeout race: if the API takes > 1800ms, immediately fall back to instant grounded engine
        const timeoutPromise = new Promise<null>((resolve) =>
          setTimeout(() => resolve(null), 1800)
        );

        const response: any = await Promise.race([generationPromise, timeoutPromise]);

        if (response && response.text && response.text.trim().length > 0) {
          const rawText = response.text;
          const actionMatch = rawText.match(/\[ACTION:([A-Z_]+)\]/);
          const action = actionMatch ? actionMatch[1] : undefined;
          const cleanText = rawText.replace(/\[ACTION:[A-Z_]+\]/g, '').trim();

          return { text: cleanText, action };
        }
      } catch (err: any) {
        console.warn(`[Nexus AI] Fast generation error on ${modelName}:`, err?.message || err);
      }
    }
  }

  // Instant seamless fallback to Grounded Knowledge Engine
  return getGroundedFallbackResponse(lastUserMsg, userName);
}

