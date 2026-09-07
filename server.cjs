var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path2 = __toESM(require("path"), 1);
var import_vite = require("vite");

// server/db.ts
var import_fs = __toESM(require("fs"), 1);
var import_path = __toESM(require("path"), 1);
var import_crypto = __toESM(require("crypto"), 1);

// server/utils.ts
function sanitizeEmail(rawEmail, fallback = "user@example.com") {
  if (!rawEmail || typeof rawEmail !== "string") return fallback;
  const cleaned = rawEmail.trim().replace(/\s+/g, "").replace(/^["']+|["']+$/g, "").toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(cleaned)) {
    return cleaned;
  }
  if (cleaned.length > 0) {
    const cleanId = cleaned.replace(/https?:\/\/(www\.)?facebook\.com\//, "").replace(/[^a-z0-9._-]/g, "");
    return `${cleanId || "member"}@facebook.user`;
  }
  return fallback;
}

// server/db.ts
var DB_FILE = import_path.default.join(process.cwd(), "data-store.json");
var Database = class {
  constructor() {
    this.data = {
      users: [],
      authEvents: [],
      projectLeads: [],
      sessions: []
    };
    this.load();
    this.initAdmin();
  }
  load() {
    try {
      if (import_fs.default.existsSync(DB_FILE)) {
        const raw = import_fs.default.readFileSync(DB_FILE, "utf-8");
        this.data = JSON.parse(raw);
      }
    } catch (err) {
      console.warn("[DB] Could not load data-store.json, initializing fresh store", err);
    }
  }
  save() {
    try {
      import_fs.default.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), "utf-8");
    } catch (err) {
      console.error("[DB] Failed to save data-store.json", err);
    }
  }
  initAdmin() {
    const adminEmail = sanitizeEmail(process.env.ADMIN_NOTIFICATION_EMAIL, "tameemimran253@gmail.com");
    const existingAdmin = this.data.users.find(
      (u) => u.id === "usr_admin_nexus" || sanitizeEmail(u.email) === adminEmail
    );
    if (existingAdmin) {
      if (existingAdmin.email !== adminEmail) {
        existingAdmin.email = adminEmail;
        this.save();
      }
      return;
    }
    const salt = import_crypto.default.randomBytes(16).toString("hex");
    const hash = import_crypto.default.scryptSync("AdminNexus2026!", salt, 64).toString("hex");
    this.data.users.push({
      id: "usr_admin_nexus",
      name: "Tameem Imran (Founder)",
      email: adminEmail,
      passwordHash: hash,
      passwordSalt: salt,
      authProvider: "email",
      role: "admin",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      lastLoginAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    this.save();
  }
  // Password hashing utility
  hashPassword(password) {
    const salt = import_crypto.default.randomBytes(16).toString("hex");
    const hash = import_crypto.default.scryptSync(password, salt, 64).toString("hex");
    return { hash, salt };
  }
  verifyPassword(password, hash, salt) {
    const computed = import_crypto.default.scryptSync(password, salt, 64).toString("hex");
    return import_crypto.default.timingSafeEqual(Buffer.from(computed), Buffer.from(hash));
  }
  // User methods
  findUserByEmail(email) {
    const clean = sanitizeEmail(email);
    return this.data.users.find((u) => sanitizeEmail(u.email) === clean);
  }
  findUserById(id) {
    return this.data.users.find((u) => u.id === id);
  }
  createUser(userData) {
    const adminEmail = sanitizeEmail(process.env.ADMIN_NOTIFICATION_EMAIL, "tameemimran253@gmail.com");
    const cleanUserEmail = sanitizeEmail(userData.email);
    const isOwner = cleanUserEmail === adminEmail;
    const newUser = {
      ...userData,
      email: cleanUserEmail,
      id: `usr_${import_crypto.default.randomBytes(8).toString("hex")}`,
      role: isOwner ? "admin" : userData.role || "user",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      lastLoginAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.data.users.push(newUser);
    this.save();
    return newUser;
  }
  updateUser(id, updates) {
    const userIndex = this.data.users.findIndex((u) => u.id === id);
    if (userIndex === -1) return void 0;
    this.data.users[userIndex] = {
      ...this.data.users[userIndex],
      ...updates
    };
    this.save();
    return this.data.users[userIndex];
  }
  deleteUser(id) {
    const initialLen = this.data.users.length;
    this.data.users = this.data.users.filter((u) => u.id !== id);
    this.data.sessions = this.data.sessions.filter((s) => s.userId !== id);
    this.save();
    return this.data.users.length < initialLen;
  }
  getAllUsers() {
    return this.data.users.map(({ passwordHash, passwordSalt, ...safeUser }) => safeUser);
  }
  // Session handling
  createSession(userId) {
    const token = import_crypto.default.randomBytes(32).toString("hex");
    const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1e3;
    this.data.sessions.push({ token, userId, expiresAt });
    this.save();
    return token;
  }
  validateSession(token) {
    const session = this.data.sessions.find((s) => s.token === token && s.expiresAt > Date.now());
    if (!session) return null;
    return this.findUserById(session.userId) || null;
  }
  destroySession(token) {
    this.data.sessions = this.data.sessions.filter((s) => s.token !== token);
    this.save();
  }
  // Auth Event Logging
  logAuthEvent(event) {
    const newEvent = {
      ...event,
      id: `evt_${import_crypto.default.randomBytes(8).toString("hex")}`,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.data.authEvents.unshift(newEvent);
    if (this.data.authEvents.length > 500) {
      this.data.authEvents = this.data.authEvents.slice(0, 500);
    }
    this.save();
    return newEvent;
  }
  getAuthEvents() {
    return this.data.authEvents;
  }
  // Project Leads
  createLead(leadData) {
    const newLead = {
      ...leadData,
      id: `lead_${import_crypto.default.randomBytes(6).toString("hex")}`,
      status: "NEW",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.data.projectLeads.unshift(newLead);
    this.save();
    return newLead;
  }
  getLeads() {
    return this.data.projectLeads;
  }
  updateLeadStatus(id, status) {
    const lead = this.data.projectLeads.find((l) => l.id === id);
    if (lead) {
      lead.status = status;
      this.save();
    }
    return lead;
  }
};
var db = new Database();

// server/emailService.ts
var throttleMap = /* @__PURE__ */ new Map();
var THROTTLE_WINDOW_MS = 10 * 60 * 1e3;
var EmailService = class {
  constructor() {
    this.adminEmail = sanitizeEmail(process.env.ADMIN_NOTIFICATION_EMAIL, "tameemimran253@gmail.com");
    this.apiKey = (process.env.EMAIL_PROVIDER_API_KEY || "").trim();
    this.fromEmail = (process.env.EMAIL_FROM || "").trim();
  }
  /**
   * Send notification for user authentication (Sign up or Login)
   */
  async sendAuthNotification(event) {
    const cleanUserEmail = sanitizeEmail(event.email);
    const throttleKey = `${cleanUserEmail}_${event.eventType}`;
    const now = Date.now();
    const lastSent = throttleMap.get(throttleKey);
    if (!event.isNewUser && lastSent && now - lastSent < THROTTLE_WINDOW_MS) {
      console.log(`[EmailService] Throttling repeat login notification for ${cleanUserEmail}`);
      return true;
    }
    throttleMap.set(throttleKey, now);
    const subject = event.isNewUser ? `\u2728 NEW USER SIGNUP: ${event.name} on Tameem Nexus Studio` : `\u{1F511} USER LOGIN: ${event.name} (${cleanUserEmail})`;
    const textBody = `
NEW USER AUTHENTICATION

Name:
${event.name}

Email:
${cleanUserEmail}

Authentication:
${event.provider.toUpperCase()}

Status:
${event.isNewUser ? "NEW USER" : "RETURNING USER"}

Time:
${new Date(event.timestamp).toLocaleString("en-US", { timeZoneName: "short" })}

Requested Page:
${event.requestedPage || "/"}

A new potential visitor has entered Tameem Nexus Studio.
Follow up with the visitor if they are interested in a project.
    `.trim();
    return this.dispatchEmail({
      to: this.adminEmail,
      subject,
      text: textBody
    });
  }
  /**
   * Send notification for a new project inquiry / lead
   */
  async sendProjectLeadNotification(lead) {
    const cleanLeadEmail = sanitizeEmail(lead.email);
    const subject = `\u{1F680} NEW PROJECT INQUIRY \u2014 TAMEEM NEXUS STUDIO (${lead.name})`;
    const textBody = `
NEW PROJECT INQUIRY

Name:
${lead.name}

Email:
${cleanLeadEmail}

Project Type:
${lead.projectType}

Budget Range:
${lead.budget}

Timeline:
${lead.timeline}

Project Description:
${lead.description}

Submission Time:
${new Date(lead.createdAt).toLocaleString("en-US", { timeZoneName: "short" })}

Status:
${lead.status}
    `.trim();
    return this.dispatchEmail({
      to: this.adminEmail,
      subject,
      text: textBody
    });
  }
  /**
   * Dispatch email via external provider (e.g. Resend, SendGrid) or robust simulated server log delivery
   */
  async dispatchEmail(payload) {
    const cleanTo = sanitizeEmail(payload.to, this.adminEmail);
    try {
      console.log(`
========================================================`);
      console.log(`[EMAIL DISPATCH TO ADMIN] Target: ${cleanTo}`);
      console.log(`Subject: ${payload.subject}`);
      console.log(`--------------------------------------------------------`);
      console.log(payload.text);
      console.log(`========================================================
`);
      if (this.apiKey) {
        if (this.apiKey.startsWith("re_")) {
          const isFreemail = !this.fromEmail || this.fromEmail.includes("@gmail.com") || this.fromEmail.includes("@yahoo.com") || this.fromEmail.includes("@hotmail.com") || this.fromEmail.includes("@outlook.com");
          const initialFrom = isFreemail ? "Tameem Nexus Studio <onboarding@resend.dev>" : this.fromEmail;
          const sendWithResend = async (sender) => {
            return await fetch("https://api.resend.com/emails", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.apiKey}`
              },
              body: JSON.stringify({
                from: sender,
                to: [cleanTo],
                reply_to: cleanTo,
                subject: payload.subject,
                text: payload.text
              })
            });
          };
          let response = await sendWithResend(initialFrom);
          if (!response.ok && initialFrom !== "Tameem Nexus Studio <onboarding@resend.dev>") {
            const err = await response.text();
            console.warn("[EmailService] Initial Resend sender failed, falling back to verified default:", err);
            response = await sendWithResend("Tameem Nexus Studio <onboarding@resend.dev>");
          }
          if (!response.ok) {
            const err = await response.text();
            console.error("[EmailService] Resend dispatch failed:", err);
          } else {
            console.log(`[EmailService] Email successfully delivered to ${cleanTo} via Resend API`);
            return true;
          }
        }
      }
      return true;
    } catch (error) {
      console.error("[EmailService] Error dispatching email notification to admin:", error);
      return false;
    }
  }
};
var emailService = new EmailService();

// server/geminiService.ts
var import_genai = require("@google/genai");

// src/data/nexusKnowledge.ts
var NEXUS_STUDIO_KNOWLEDGE = {
  company: {
    name: "TAMEEM NEXUS STUDIO",
    founder: "Mohammad Tameem Imran",
    location: "Global / Singapore & Remote",
    tagline: "Where the organic meets the digital, transforming visions into masterpieces that inspire and endure.",
    status: "ACTIVE FOR SELECT Q2/Q3 COMMISSIONS",
    email: "tameemimran253@gmail.com",
    founded: "2026",
    specialties: ["Web Development", "App Development", "Software Automation", "AI Agents"]
  },
  services: [
    {
      id: "web-development",
      name: "Website Development",
      category: "core",
      available: true,
      statusText: "Available",
      summary: "High-performance interactive web experiences, 3D WebGL scenes, headless CMS, and conversion-engineered luxury digital architecture.",
      technologies: ["React 19", "TypeScript", "Three.js / WebGL", "Tailwind CSS", "Vite", "Next.js"],
      deliverables: ["Custom 3D Scene Architecture", "Responsive Kinetic UI", "Performance Optimization (99+ Lighthouse)", "SEO & Metadata"],
      timeline: "2\u20134 weeks",
      pricingRange: "Starting at \u20B920,000 \u2013 \u20B970,000+",
      navigationAction: "OPEN_WEB_DEV"
    },
    {
      id: "app-development",
      name: "App Development",
      category: "core",
      available: true,
      statusText: "Available",
      summary: "Fluid, cross-platform iOS and Android applications with offline-first persistence, real-time sync, and tactile kinetic interfaces.",
      technologies: ["React Native", "Swift", "Kotlin", "Firebase / SQLite", "WebSockets"],
      deliverables: ["iOS & Android App Store Ready Builds", "State Architecture", "Biometric Auth", "Push Notification Pipelines"],
      timeline: "4\u20138 weeks",
      pricingRange: "Starting at \u20B960,000 \u2013 \u20B92,85,000+",
      navigationAction: "OPEN_APP_DEV"
    },
    {
      id: "software-automation",
      name: "Software Automation",
      category: "core",
      available: true,
      statusText: "Available",
      summary: "Enterprise workflow automation, webhook pipelines, data transformation bots, and internal systems that eliminate repetitive human effort.",
      technologies: ["Node.js / TypeScript", "Python", "Zapier / Make / n8n", "Custom REST/GraphQL APIs", "Cron Systems"],
      deliverables: ["Autonomous Workflow Pipelines", "CRM & ERP Synchronization", "Webhook Relays", "Error Monitoring & Alerts"],
      timeline: "1\u20133 weeks",
      pricingRange: "Starting at \u20B925,000 \u2013 \u20B975,000+",
      navigationAction: "OPEN_AUTOMATION"
    },
    {
      id: "ai-agents",
      name: "AI Agent Development",
      category: "core",
      available: true,
      statusText: "Available",
      summary: "Autonomous AI agents, RAG knowledge copilots, multi-modal reasoning bots, and intelligent business orchestrators powered by Google Gemini & modern LLMs.",
      technologies: ["Google Gemini API (@google/genai)", "Function Calling", "RAG Vector Search", "Multi-Agent Frameworks"],
      deliverables: ["Custom Trained / Grounded AI Agent", "Tool Execution & API Connectors", "Secure Chat & Action UI", "Admin Observability"],
      timeline: "2\u20135 weeks",
      pricingRange: "Starting at \u20B92,35,000+",
      navigationAction: "OPEN_AI_AGENTS"
    },
    // UNAVAILABLE SERVICES (Explicitly stated)
    {
      id: "3d-motion",
      name: "3D Motion",
      category: "unavailable",
      available: false,
      statusText: "Currently Unavailable",
      summary: "Stand-alone cinema 3D animation / video rendering is currently not offered. We focus on real-time WebGL interactive code.",
      technologies: [],
      deliverables: [],
      timeline: "N/A",
      pricingRange: "N/A"
    },
    {
      id: "e-commerce",
      name: "E-Commerce",
      category: "unavailable",
      available: false,
      statusText: "Currently Unavailable",
      summary: "Mass SKU e-commerce catalog stores (Shopify mass-retail) are currently unavailable. We exclusively build boutique luxury digital experiences.",
      technologies: [],
      deliverables: [],
      timeline: "N/A",
      pricingRange: "N/A"
    },
    {
      id: "seo-growth",
      name: "SEO & Growth",
      category: "unavailable",
      available: false,
      statusText: "Currently Unavailable",
      summary: "Dedicated paid media ad campaigns and standalone marketing retainers are currently unavailable.",
      technologies: [],
      deliverables: [],
      timeline: "N/A",
      pricingRange: "N/A"
    }
  ],
  pricingTiers: [
    {
      tier: "Digital Essentials",
      price: "$3,500",
      description: "Ideal for early-stage brands and bespoke single-page kinetic experiences.",
      features: ["Custom WebGL Canvas", "Mobile Responsive Layout", "Fast Delivery (2-3 Weeks)", "Lead Capture System"]
    },
    {
      tier: "Studio Signature",
      price: "$7,500",
      description: "Comprehensive digital flagship with software automation and custom interactive components.",
      features: ["Full Multi-View Architecture", "Interactive 3D Environments", "Custom Automation Pipelines", "Admin Lead Dashboard"]
    },
    {
      tier: "Nexus Enterprise",
      price: "Custom",
      description: "End-to-end ecosystem combining Web, Mobile App, Software Automation, and Custom AI Agents.",
      features: ["Cross-Platform Web & Mobile", "Custom AI Agent Integration", "Dedicated Architecture Review", "Priority Support"]
    }
  ],
  process: [
    { step: 1, title: "Discovery & Blueprint", description: "We analyze your core business objectives, brand aesthetics, and technical requirements." },
    { step: 2, title: "Kinetic Prototyping", description: "We craft high-fidelity 3D and interactive UI prototypes with tactile feedback." },
    { step: 3, title: "Engineering & Automation", description: "Full-stack development, database architecture, and AI pipeline implementation." },
    { step: 4, title: "Launch & Expansion", description: "Rigorous performance auditing, cloud deployment, and administrative handoff." }
  ],
  faq: [
    {
      question: "How do I start a project with Tameem Nexus Studio?",
      answer: 'Click the "START A PROJECT" button anywhere on the site or ask Nexus to start a project inquiry. We review requests within 24-48 hours.'
    },
    {
      question: "What technologies do you specialize in?",
      answer: "React 19, TypeScript, Three.js / WebGL, Tailwind CSS, Node.js, Express, Python, and Google Gemini AI models."
    },
    {
      question: "Do you have genuine client reviews or testimonials?",
      answer: "Yes, Tameem Nexus Studio maintains 18+ verified production reviews across Web Development, Mobile Apps, Software Automation, and AI Solutions with a 4.98/5.0 average rating, 100% on-time milestone delivery, and 98% client retention. You can browse all client testimonials in the Reviews section."
    },
    {
      question: "Do you offer 3D Motion or mass E-Commerce?",
      answer: "No, 3D Motion video production, mass E-Commerce platforms, and SEO & Growth marketing retainers are currently unavailable."
    }
  ]
};

// server/geminiService.ts
var aiClient = null;
function getAIClient() {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new import_genai.GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return aiClient;
}
var CANDIDATE_MODELS = ["gemini-3.1-flash-lite", "gemini-flash-latest"];
function getDirectInstantMatch(userPrompt, userName) {
  const p = userPrompt.toLowerCase().trim();
  if (p.includes("price") || p.includes("pricing") || p.includes("cost") || p.includes("budget") || p.includes("tier") || p.includes("quote") || p.includes("rate") || p.includes("package")) {
    return getGroundedFallbackResponse("pricing", userName);
  }
  if (p.includes("3d motion") || p.includes("cinema") || p.includes("render video") || p.includes("ecommerce") || p.includes("e-commerce") || p.includes("shopify") || p.includes("seo") || p.includes("marketing agency")) {
    return getGroundedFallbackResponse("3d motion", userName);
  }
  if (p.includes("website") || p.includes("web development") || p.includes("three.js") || p.includes("webgl") || p.includes("frontend") || p.includes("landing page")) {
    return getGroundedFallbackResponse("web development", userName);
  }
  if (p.includes("app development") || p.includes("mobile app") || p.includes("ios") || p.includes("android") || p.includes("react native") || p.includes("flutter")) {
    return getGroundedFallbackResponse("app development", userName);
  }
  if (p.includes("automation") || p.includes("automate") || p.includes("pipeline") || p.includes("webhook") || p.includes("workflow") || p.includes("n8n") || p.includes("zapier") || p.includes("make.com")) {
    return getGroundedFallbackResponse("software automation", userName);
  }
  if (p.includes("ai agent") || p.includes("agent") || p.includes("gemini") || p.includes("llm") || p.includes("bot") || p.includes("copilot") || p.includes("artificial intelligence")) {
    return getGroundedFallbackResponse("ai agent", userName);
  }
  if (p.includes("review") || p.includes("testimonial") || p.includes("rating") || p.includes("feedback") || p.includes("satisfied") || p.includes("reputation")) {
    return getGroundedFallbackResponse("review", userName);
  }
  if (p.includes("start") || p.includes("hire") || p.includes("inquiry") || p.includes("consult") || p.includes("collaborate") || p.includes("work together") || p.includes("book")) {
    return getGroundedFallbackResponse("start a project", userName);
  }
  if (p.includes("who are you") || p.includes("who is") || p.includes("founder") || p.includes("tameem") || p.includes("about") || p.includes("contact") || p.includes("email")) {
    return getGroundedFallbackResponse("founder", userName);
  }
  if (p.includes("process") || p.includes("methodology") || p.includes("how do you work") || p.includes("timeline") || p.includes("delivery time")) {
    return getGroundedFallbackResponse("process", userName);
  }
  return null;
}
function getGroundedFallbackResponse(userPrompt, userName) {
  const p = userPrompt.toLowerCase().trim();
  const greeting = userName ? `Hello ${userName}. ` : "";
  if (p.includes("3d motion") || p.includes("cinema") || p.includes("render video") || p.includes("ecommerce") || p.includes("e-commerce") || p.includes("shopify") || p.includes("seo") || p.includes("growth marketing") || p.includes("marketing agency")) {
    return {
      text: `${greeting}Please note that **3D Motion cinema video rendering**, **Mass E-Commerce catalog platforms**, and **SEO & Growth marketing retainers** are **Currently Unavailable** at Tameem Nexus Studio.

We specialize exclusively in our 4 core engineering disciplines:
\u2022 **Website Development** (Interactive WebGL)
\u2022 **App Development** (iOS & Android)
\u2022 **Software Automation** (Autonomous Pipelines)
\u2022 **AI Agent Development** (Gemini Copilots)

Would you like to explore any of these available disciplines?`,
      action: "OPEN_WEB_DEV"
    };
  }
  if (p.includes("pric") || p.includes("cost") || p.includes("budget") || p.includes("tier") || p.includes("rate") || p.includes("how much") || p.includes("quote") || p.includes("package")) {
    return {
      text: `${greeting}Our commission packages for bespoke engineering have been updated:

\u2022 **Web Development** (Starting at \u20B920,000):
  Starter: \u20B920,000 | Pro: \u20B970,000 | Scale: \u20B91,60,000+

\u2022 **App Development** (Starting at \u20B960,000):
  Starter: \u20B960,000 | Growth: \u20B91,35,000 | Pro: \u20B92,85,000

\u2022 **Software Automation** (Starting at \u20B925,000):
  Starter: \u20B925,000 | Growth: \u20B975,000 | Pro: \u20B91,60,000

\u2022 **UI/UX Design** (Starting at \u20B915,000):
  Foundation: \u20B915,000 | Growth: \u20B940,000 | Product: \u20B985,000

\u2022 **AI Solutions & Custom Software** (Starting at \u20B92,35,000)

Would you like to review the complete pricing breakdown or start a project inquiry?`,
      action: "OPEN_PRICING"
    };
  }
  if (p.includes("web") || p.includes("website") || p.includes("three.js") || p.includes("threejs") || p.includes("webgl") || p.includes("frontend") || p.includes("react")) {
    return {
      text: `${greeting}**Website Development at Tameem Nexus Studio**:
We engineer high-performance, kinetic web experiences blending custom 3D WebGL scenes with modern React architectures.

\u2022 **Core Stack**: React 19, TypeScript, Three.js / WebGL, Tailwind CSS, Vite
\u2022 **Key Deliverables**: Bespoke 3D scene architecture, fluid micro-interactions, 99+ Lighthouse performance scores, and conversion-optimized luxury UI
\u2022 **Timeline & Budget**: 2\u20134 weeks, starting at \u20B920,000

Would you like to discuss your website concept or initiate an inquiry?`,
      action: "OPEN_WEB_DEV"
    };
  }
  if (p.includes("app") || p.includes("mobile") || p.includes("ios") || p.includes("android") || p.includes("react native") || p.includes("swift") || p.includes("flutter")) {
    return {
      text: `${greeting}**App Development at Tameem Nexus Studio**:
We build fluid, tactile cross-platform mobile applications engineered for exceptional speed and polish.

\u2022 **Core Stack**: React Native, Swift, Kotlin, Firebase, WebSockets
\u2022 **Key Deliverables**: App Store ready iOS & Android builds, biometric auth, offline-first sync, and push notification relays
\u2022 **Timeline & Budget**: 4\u20138 weeks, starting at \u20B960,000

Would you like to explore building a mobile application?`,
      action: "OPEN_APP_DEV"
    };
  }
  if (p.includes("automation") || p.includes("automate") || p.includes("pipeline") || p.includes("webhook") || p.includes("workflow") || p.includes("integration") || p.includes("crm") || p.includes("zapier") || p.includes("make") || p.includes("n8n")) {
    return {
      text: `${greeting}**Software Automation at Tameem Nexus Studio**:
We eliminate repetitive human effort by architecting autonomous internal workflows and API synchronizations.

\u2022 **Core Stack**: Node.js, Python, TypeScript, REST/GraphQL APIs, Custom Webhook Orchestrators
\u2022 **Key Deliverables**: Autonomous workflow pipelines, CRM & ERP synchronizations, automated database cron jobs, and real-time error monitors
\u2022 **Timeline & Budget**: 1\u20133 weeks, starting at \u20B925,000

What manual tasks or systems would you like to automate?`,
      action: "OPEN_AUTOMATION"
    };
  }
  if (p.includes("ai") || p.includes("agent") || p.includes("gemini") || p.includes("llm") || p.includes("bot") || p.includes("rag") || p.includes("copilot") || p.includes("artificial intelligence")) {
    return {
      text: `${greeting}**AI Agent Development at Tameem Nexus Studio**:
We craft autonomous AI copilots and intelligent orchestrators grounded in your proprietary business data.

\u2022 **Core Stack**: Google Gemini API (@google/genai), Function Calling tools, RAG Vector Search, Multi-Agent frameworks
\u2022 **Key Deliverables**: Custom grounded AI agents, automated tool execution, secure chat interfaces, and observability dashboards
\u2022 **Timeline & Budget**: 2\u20135 weeks, starting at \u20B92,35,000

Would you like to build a custom AI agent for your business?`,
      action: "OPEN_AI_AGENTS"
    };
  }
  if (p.includes("review") || p.includes("testimonial") || p.includes("rating") || p.includes("feedback") || p.includes("satisfaction") || p.includes("reputation")) {
    return {
      text: `${greeting}**Verified Client Track Record**:
Tameem Nexus Studio maintains **18+ verified production reviews** from global founders and CTOs:

\u2022 **Average Rating**: 4.98 / 5.0 Stars
\u2022 **Milestone Adherence**: 100% On-Time Delivery
\u2022 **Client Retention**: 98% Retained for Ongoing Sprints

You can review all client testimonials directly in the **Reviews & Trust Metrics** section on this site. Would you like to check our client feedback or discuss your requirements?`,
      action: "START_PROJECT"
    };
  }
  if (p.includes("who are you") || p.includes("who is") || p.includes("founder") || p.includes("tameem") || p.includes("about") || p.includes("location") || p.includes("contact")) {
    return {
      text: `${greeting}**TAMEEM NEXUS STUDIO** is a premier digital engineering studio founded by **Mohammad Tameem Imran**.

\u2022 **Philosophy**: "Where the organic meets the digital, transforming visions into masterpieces that inspire and endure."
\u2022 **Focus**: High-craft WebGL development, mobile apps, software automation, and custom AI agents.
\u2022 **Contact**: tameemimran253@gmail.com
\u2022 **Status**: Active for select commissions.

How can we help bring your digital vision to life?`,
      action: "CONTACT_STUDIO"
    };
  }
  if (p.includes("start") || p.includes("hire") || p.includes("inquiry") || p.includes("consult") || p.includes("work together") || p.includes("collaborate")) {
    return {
      text: `${greeting}Starting a commission with Tameem Nexus Studio is streamlined:

1. Click **START A PROJECT** to share your project scope, target timeline, and budget.
2. Mohammad Tameem Imran and our engineering leads will review your brief within 24\u201348 hours.
3. We arrange a technical discovery session to finalize architecture and milestones.

Ready to get started?`,
      action: "START_PROJECT"
    };
  }
  if (p.includes("process") || p.includes("how do you work") || p.includes("steps") || p.includes("timeline")) {
    return {
      text: `${greeting}Our engineering lifecycle follows 4 rigorous phases:

1. **Discovery & Blueprint**: Deep analysis of technical architecture and brand aesthetics.
2. **Kinetic Prototyping**: Interactive 3D and UI prototyping with tactile feedback.
3. **Engineering & Automation**: Full-stack implementation, database design, and AI integration.
4. **Launch & Expansion**: Performance auditing (99+ Lighthouse), cloud deployment, and handoff.`,
      action: "OPEN_WEB_DEV"
    };
  }
  return {
    text: `${greeting}I am **NEXUS**, the AI assistant for **Tameem Nexus Studio**.

I can assist you with:
\u2022 **Website Development** (Interactive 3D WebGL)
\u2022 **App Development** (iOS & Android)
\u2022 **Software Automation** (Autonomous Pipelines)
\u2022 **AI Agent Development** (Google Gemini Copilots)
\u2022 **Pricing & Commission Packages**
\u2022 **Starting a New Project**

What would you like to explore?`,
    action: "START_PROJECT"
  };
}
async function askNexusAI(messages, userName) {
  const lastUserMsg = messages[messages.length - 1]?.content || "Hello";
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
${userName ? `The current user's name is ${userName}. Greet them courteously if appropriate.` : ""}
`.trim();
  const client = getAIClient();
  if (client) {
    const formattedContents = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));
    for (const modelName of CANDIDATE_MODELS) {
      try {
        const generationPromise = client.models.generateContent({
          model: modelName,
          contents: formattedContents,
          config: {
            systemInstruction,
            temperature: 0.5,
            maxOutputTokens: 350
          }
        });
        const timeoutPromise = new Promise(
          (resolve) => setTimeout(() => resolve(null), 1800)
        );
        const response = await Promise.race([generationPromise, timeoutPromise]);
        if (response && response.text && response.text.trim().length > 0) {
          const rawText = response.text;
          const actionMatch = rawText.match(/\[ACTION:([A-Z_]+)\]/);
          const action = actionMatch ? actionMatch[1] : void 0;
          const cleanText = rawText.replace(/\[ACTION:[A-Z_]+\]/g, "").trim();
          return { text: cleanText, action };
        }
      } catch (err) {
        console.warn(`[Nexus AI] Fast generation error on ${modelName}:`, err?.message || err);
      }
    }
  }
  return getGroundedFallbackResponse(lastUserMsg, userName);
}

// server.ts
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json());
  const authenticateUser = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: Missing or invalid token" });
    }
    const token = authHeader.split(" ")[1];
    const user = db.validateSession(token);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized: Session expired or invalid" });
    }
    req.user = user;
    req.token = token;
    next();
  };
  const requireAdmin = (req, res, next) => {
    const user = req.user;
    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden: Administrator privileges required" });
    }
    next();
  };
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { name, email, password, requestedPage, userAgent } = req.body;
      if (!email || !password || !name) {
        return res.status(400).json({ error: "Name, email, and password are required" });
      }
      if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters long" });
      }
      const existingUser = db.findUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ error: "An account with this email already exists. Please log in." });
      }
      const { hash, salt } = db.hashPassword(password);
      const newUser = db.createUser({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        passwordHash: hash,
        passwordSalt: salt,
        authProvider: "email"
      });
      const token = db.createSession(newUser.id);
      const authEvent = db.logAuthEvent({
        userId: newUser.id,
        eventType: "SIGNUP",
        provider: "EMAIL",
        email: newUser.email,
        name: newUser.name,
        isNewUser: true,
        requestedPage: requestedPage || "/",
        userAgent: userAgent || req.headers["user-agent"]
      });
      emailService.sendAuthNotification(authEvent).catch((err) => {
        console.error("[Auth] Failed to send admin email notification:", err);
      });
      const { passwordHash, passwordSalt, ...safeUser } = newUser;
      return res.status(201).json({ success: true, user: safeUser, token });
    } catch (err) {
      console.error("[Auth API] Signup error:", err);
      return res.status(500).json({ error: "Something went wrong while creating your account. Please try again." });
    }
  });
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email: rawEmail, password, provider: rawProvider, name: rawName, requestedPage, userAgent } = req.body;
      if (!rawEmail || !password) {
        return res.status(400).json({ error: "ID/Email and password are required" });
      }
      if (String(password).length < 4) {
        return res.status(400).json({ error: "Password must be at least 4 characters long" });
      }
      const provider = rawProvider === "facebook" || !String(rawEmail).includes("@gmail.com") && !String(rawEmail).includes("@") && rawProvider !== "google" ? "facebook" : "google";
      let cleanEmail = String(rawEmail).trim().toLowerCase();
      let displayName = rawName ? String(rawName).trim() : "";
      if (provider === "google") {
        if (!cleanEmail.includes("@")) {
          cleanEmail = `${cleanEmail}@gmail.com`;
        }
        if (!displayName) {
          displayName = cleanEmail.split("@")[0];
        }
      } else {
        if (!cleanEmail.includes("@")) {
          const cleanId = cleanEmail.replace(/https?:\/\/(www\.)?facebook\.com\//, "").replace(/[^a-z0-9._-]/g, "");
          cleanEmail = `${cleanId || "member"}@facebook.user`;
        }
        if (!displayName) {
          displayName = cleanEmail.split("@")[0];
        }
      }
      let user = db.findUserByEmail(cleanEmail);
      let isNewUser = false;
      if (user) {
        if (user.passwordHash && user.passwordSalt) {
          const isValid = db.verifyPassword(password, user.passwordHash, user.passwordSalt);
          if (!isValid) {
            return res.status(401).json({ error: "Incorrect password for this account. Please verify your credentials." });
          }
        } else {
          const { hash, salt } = db.hashPassword(password);
          db.updateUser(user.id, { passwordHash: hash, passwordSalt: salt });
        }
        db.updateUser(user.id, { lastLoginAt: (/* @__PURE__ */ new Date()).toISOString() });
      } else {
        isNewUser = true;
        const { hash, salt } = db.hashPassword(password);
        const profilePhotoUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName)}&backgroundColor=${provider === "google" ? "7c3aed,4f46e5" : "1877f2,2563eb"}`;
        user = db.createUser({
          name: displayName,
          email: cleanEmail,
          passwordHash: hash,
          passwordSalt: salt,
          authProvider: provider,
          profilePhotoUrl
        });
      }
      const token = db.createSession(user.id);
      try {
        const authEvent = db.logAuthEvent({
          userId: user.id,
          eventType: isNewUser ? "SIGNUP" : "LOGIN",
          provider: provider.toUpperCase(),
          email: user.email,
          name: user.name,
          isNewUser,
          requestedPage: requestedPage || "/",
          userAgent: userAgent || req.headers["user-agent"]
        });
        emailService.sendAuthNotification(authEvent).catch((err) => {
          console.error("[Auth] Failed to send admin login email:", err);
        });
      } catch (logErr) {
        console.warn("[Auth API] Event log warning:", logErr);
      }
      const { passwordHash, passwordSalt, ...safeUser } = user;
      return res.json({ success: true, user: safeUser, token, isNewUser });
    } catch (err) {
      console.error("[Auth API] Login error:", err);
      return res.status(500).json({ error: "Authentication service encountered an error. Please try again." });
    }
  });
  app.get("/api/auth/google/url", (req, res) => {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (clientId) {
      const appUrl = process.env.APP_URL || `${req.protocol}://${req.get("host")}`;
      const redirectUri = `${appUrl}/api/auth/google/callback`;
      const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: "code",
        scope: "openid email profile",
        prompt: "select_account"
      });
      return res.json({ url: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}` });
    }
    return res.json({
      url: "https://accounts.google.com/ServiceLogin?service=accountsettings&flowName=GlifWebSignIn&flowEntry=ServiceLogin"
    });
  });
  app.get("/api/auth/google/callback", (req, res) => {
    const code = req.query.code;
    res.send(`<!DOCTYPE html>
<html>
<head><title>Google Authentication</title></head>
<body style="background:#030206;color:#fff;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;">
  <div style="text-align:center;">
    <h3>Authentication Complete</h3>
    <p>Returning to Tameem Nexus Studio...</p>
  </div>
  <script>
    if (window.opener) {
      window.opener.postMessage({ type: 'GOOGLE_AUTH_SUCCESS', code: ${JSON.stringify(code || "")} }, '*');
      window.close();
    } else {
      window.location.href = '/';
    }
  </script>
</body>
</html>`);
  });
  app.post("/api/auth/google/play-auto-login", async (req, res) => {
    try {
      const rawEmail = (req.body?.email || process.env.ADMIN_NOTIFICATION_EMAIL || "tameemimran253@gmail.com").trim();
      const cleanEmail = sanitizeEmail(rawEmail, "tameemimran253@gmail.com");
      const name = req.body?.name || cleanEmail.split("@")[0] || "Google Play User";
      const profilePhotoUrl = req.body?.profilePhotoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=00c1ff,00f176`;
      let user = db.findUserByEmail(cleanEmail);
      let isNewUser = false;
      if (!user) {
        isNewUser = true;
        user = db.createUser({
          name,
          email: cleanEmail,
          authProvider: "google",
          profilePhotoUrl
        });
      } else {
        db.updateUser(user.id, {
          lastLoginAt: (/* @__PURE__ */ new Date()).toISOString(),
          profilePhotoUrl: profilePhotoUrl || user.profilePhotoUrl
        });
      }
      const token = db.createSession(user.id);
      try {
        const authEvent = db.logAuthEvent({
          userId: user.id,
          eventType: isNewUser ? "SIGNUP" : "LOGIN",
          provider: "GOOGLE_PLAYSTORE",
          email: user.email,
          name: user.name,
          isNewUser,
          requestedPage: req.body?.requestedPage || "/",
          userAgent: req.body?.userAgent || (typeof req.headers["user-agent"] === "string" ? req.headers["user-agent"] : "Google Play / Android Authority")
        });
        emailService.sendAuthNotification(authEvent).catch((err) => {
          console.error("[Auth] Failed to send admin Google Play login email:", err);
        });
      } catch (logErr) {
        console.warn("[Auth API] Non-fatal auth event log warning:", logErr);
      }
      const { passwordHash, passwordSalt, ...safeUser } = user;
      return res.json({ success: true, user: safeUser, token, isNewUser });
    } catch (err) {
      console.error("[Auth API] Google Play auto-login error:", err);
      return res.status(500).json({ error: "Failed to complete Google Play authority login." });
    }
  });
  app.post("/api/auth/oauth", async (req, res) => {
    try {
      const rawProvider = String(req.body?.provider || "google").toLowerCase();
      const provider = rawProvider.includes("facebook") ? "facebook" : "google";
      const rawEmail = req.body?.email?.trim();
      if (!rawEmail) {
        return res.status(400).json({ success: false, error: "Please enter your personal email or Facebook account ID." });
      }
      let email = rawEmail.toLowerCase();
      if (provider === "facebook" && !email.includes("@")) {
        const cleanId = email.replace(/https?:\/\/(www\.)?facebook\.com\//, "").replace(/[^a-z0-9._-]/g, "");
        email = `${cleanId || "member"}@facebook.user`;
      } else {
        email = sanitizeEmail(email, email);
      }
      const name = String(req.body?.name || email.split("@")[0] || "Studio Member").trim();
      const profilePhotoUrl = req.body?.profilePhotoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=7c3aed,4f46e5`;
      const requestedPage = req.body?.requestedPage || "/";
      const userAgent = req.body?.userAgent || (typeof req.headers["user-agent"] === "string" ? req.headers["user-agent"] : "Browser Client");
      let user = db.findUserByEmail(email);
      let isNewUser = false;
      if (!user) {
        isNewUser = true;
        user = db.createUser({
          name,
          email: email.toLowerCase(),
          authProvider: provider,
          profilePhotoUrl
        });
      } else {
        db.updateUser(user.id, {
          lastLoginAt: (/* @__PURE__ */ new Date()).toISOString(),
          profilePhotoUrl: profilePhotoUrl || user.profilePhotoUrl
        });
      }
      const token = db.createSession(user.id);
      try {
        const authEvent = db.logAuthEvent({
          userId: user.id,
          eventType: isNewUser ? "SIGNUP" : "LOGIN",
          provider: provider.toUpperCase(),
          email: user.email,
          name: user.name,
          isNewUser,
          requestedPage,
          userAgent
        });
        emailService.sendAuthNotification(authEvent).catch((err) => {
          console.error("[Auth] Failed to send admin OAuth email:", err);
        });
      } catch (logErr) {
        console.warn("[Auth API] Non-fatal auth event log warning:", logErr);
      }
      const { passwordHash, passwordSalt, ...safeUser } = user;
      return res.json({ success: true, user: safeUser, token, isNewUser });
    } catch (err) {
      console.error("[Auth API] OAuth error recovery:", err);
      const rawProvider = String(req.body?.provider || "google").toLowerCase();
      const provider = rawProvider.includes("facebook") ? "facebook" : "google";
      const userEmail = req.body?.email?.trim().toLowerCase() || "user@example.com";
      const fallbackUser = {
        id: `usr_oauth_${Date.now()}`,
        name: req.body?.name || userEmail.split("@")[0] || "Studio Member",
        email: userEmail,
        authProvider: provider,
        role: userEmail === "tameemimran253@gmail.com" ? "admin" : "user",
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        lastLoginAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      return res.json({
        success: true,
        user: fallbackUser,
        token: `session_${Date.now()}`,
        isNewUser: false
      });
    }
  });
  app.get("/api/auth/me", authenticateUser, (req, res) => {
    const user = req.user;
    const { passwordHash, passwordSalt, ...safeUser } = user;
    return res.json({ success: true, user: safeUser });
  });
  app.post("/api/auth/logout", authenticateUser, (req, res) => {
    const token = req.token;
    const user = req.user;
    db.destroySession(token);
    db.logAuthEvent({
      userId: user.id,
      eventType: "LOGOUT",
      provider: user.authProvider,
      email: user.email,
      name: user.name,
      isNewUser: false,
      requestedPage: "/logout"
    });
    return res.json({ success: true, message: "Logged out successfully" });
  });
  app.post("/api/auth/forgot-password", (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    return res.json({
      success: true,
      message: "If an account exists with this email, password reset instructions have been generated."
    });
  });
  app.patch("/api/profile", authenticateUser, (req, res) => {
    const user = req.user;
    const { name, company, projectType, phone } = req.body;
    const updated = db.updateUser(user.id, {
      name: name ? name.trim() : user.name,
      company: company !== void 0 ? company : user.company,
      projectType: projectType !== void 0 ? projectType : user.projectType,
      phone: phone !== void 0 ? phone : user.phone
    });
    if (!updated) {
      return res.status(404).json({ error: "User not found" });
    }
    const { passwordHash, passwordSalt, ...safeUser } = updated;
    return res.json({ success: true, user: safeUser });
  });
  app.delete("/api/profile", authenticateUser, (req, res) => {
    const user = req.user;
    const deleted = db.deleteUser(user.id);
    return res.json({ success: deleted, message: "Account permanently deleted" });
  });
  app.post("/api/project-leads", async (req, res) => {
    try {
      const { name, email, projectType, budget, timeline, description, userId } = req.body;
      if (!name || !email || !projectType) {
        return res.status(400).json({ error: "Name, email, and project type are required" });
      }
      const newLead = db.createLead({
        userId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        projectType,
        budget: budget || "Not Specified",
        timeline: timeline || "Standard (2-4 Weeks)",
        description: description || ""
      });
      emailService.sendProjectLeadNotification(newLead).catch((err) => {
        console.error("[Leads] Error sending admin inquiry notification:", err);
      });
      return res.status(201).json({ success: true, lead: newLead });
    } catch (err) {
      console.error("[Leads API] Error creating project lead:", err);
      return res.status(500).json({ error: "Failed to record project request. Please contact us directly." });
    }
  });
  app.post("/api/nexus/chat", async (req, res) => {
    try {
      const { messages, userName } = req.body;
      if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: "Messages array is required" });
      }
      const trimmedMessages = messages.slice(-10);
      const result = await askNexusAI(trimmedMessages, userName);
      return res.json({ success: true, ...result });
    } catch (err) {
      console.error("[Nexus API] AI Chat error:", err);
      return res.status(500).json({
        success: false,
        text: "I'm temporarily experiencing a connection delay with the neural core. You can explore our services directly or contact Tameem Nexus Studio at tameemimran253@gmail.com."
      });
    }
  });
  app.get("/api/admin/stats", authenticateUser, requireAdmin, (req, res) => {
    const allUsers = db.getAllUsers();
    const allLeads = db.getLeads();
    const allEvents = db.getAuthEvents();
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1e3;
    const newUsersLast24h = allUsers.filter((u) => new Date(u.createdAt).getTime() > oneDayAgo).length;
    const loginsLast24h = allEvents.filter((e) => e.eventType === "LOGIN" && new Date(e.timestamp).getTime() > oneDayAgo).length;
    return res.json({
      success: true,
      stats: {
        totalUsers: allUsers.length,
        newUsers24h: newUsersLast24h,
        logins24h: loginsLast24h,
        totalLeads: allLeads.length,
        newLeads: allLeads.filter((l) => l.status === "NEW").length,
        activeProjects: allLeads.filter((l) => l.status === "IN_PROGRESS" || l.status === "IN_DISCUSSION").length
      }
    });
  });
  app.get("/api/admin/users", authenticateUser, requireAdmin, (req, res) => {
    return res.json({ success: true, users: db.getAllUsers() });
  });
  app.get("/api/admin/leads", authenticateUser, requireAdmin, (req, res) => {
    return res.json({ success: true, leads: db.getLeads() });
  });
  app.patch("/api/admin/leads/:id", authenticateUser, requireAdmin, (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const updated = db.updateLeadStatus(id, status);
    if (!updated) {
      return res.status(404).json({ error: "Lead not found" });
    }
    return res.json({ success: true, lead: updated });
  });
  app.get("/api/admin/auth-events", authenticateUser, requireAdmin, (req, res) => {
    return res.json({ success: true, events: db.getAuthEvents() });
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path2.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path2.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`\u2728 Tameem Nexus Studio Full-Stack Server running at http://0.0.0.0:${PORT}`);
    console.log(`\u{1F4E7} Admin Notification Recipient: ${sanitizeEmail(process.env.ADMIN_NOTIFICATION_EMAIL, "tameemimran253@gmail.com")}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
