export type PromptItem = {
  title: string;
  description: string;
  tool: string;
  category: string;
  promptText: string;
};

export const prompts: PromptItem[] = [
  {
    title: "SaaS Landing Page With Social Proof",
    description:
      "Create a conversion-focused landing page for a B2B SaaS product with strong hierarchy and trust signals.",
    tool: "v0",
    category: "Landing Page",
    promptText:
      "Design a modern SaaS landing page for a product called FlowPilot, an AI workflow automation platform for operations teams. Include a clear hero section with headline, subheadline, CTA, and product preview. Add sections for customer logos, 3 key benefits, feature cards, pricing teaser, testimonials, and FAQ. Use a clean visual hierarchy, subtle gradients, and card-based layout. Make the design responsive for mobile and desktop. Prioritize high contrast and accessibility. Output production-ready React + Tailwind code.",
  },
  {
    title: "Startup Waitlist Splash Screen",
    description:
      "Generate a sleek pre-launch page with email capture and urgency messaging.",
    tool: "Bolt",
    category: "Landing Page",
    promptText:
      "Build a pre-launch waitlist page for Nimbus Notes, an AI meeting assistant. Include a hero headline, short value proposition, waitlist form (name + email), social proof snippet, and countdown to launch date. Add sticky mobile CTA and simple success state after submit. Style it with dark mode first, neon accent colors, and smooth micro-interactions. Ensure semantic HTML and mobile-first responsiveness.",
  },
  {
    title: "Analytics Dashboard Starter",
    description:
      "Scaffold a metrics dashboard with filterable charts and KPI cards.",
    tool: "Cursor",
    category: "Dashboard",
    promptText:
      "Create a React TypeScript admin dashboard for an e-commerce business. Include top KPI cards (revenue, orders, AOV, conversion), a date-range filter, sales trend chart, top products table, and recent orders list. Use reusable components and mock local JSON data. Add loading skeletons and empty states. Keep the UI minimal, professional, and responsive using Tailwind CSS.",
  },
  {
    title: "Founder Portfolio With Case Studies",
    description:
      "Craft a personal portfolio emphasizing shipped products and measurable outcomes.",
    tool: "Claude Code",
    category: "Portfolio",
    promptText:
      "Build a one-page portfolio for a product engineer named Thea. Include sections for intro, selected projects, case studies, tech stack, testimonials, and contact. Each case study should include problem, approach, and impact metrics. Use a premium editorial style with generous whitespace and strong typography. Add subtle reveal animations on scroll and optimize for performance. Provide clean Next.js App Router structure with Tailwind styling.",
  },
  {
    title: "Indie Hacker Changelog Page",
    description:
      "Produce a changelog layout that feels transparent, polished, and easy to scan.",
    tool: "v0",
    category: "Dashboard",
    promptText:
      "Generate a changelog page for a product named PromptForge. Include release timeline cards with version badges, dates, category tags (feature/fix/improvement), and expandable details. Add a small roadmap panel and subscribe form for update notifications. The page should support dark and light themes, maintain excellent readability, and use accessible color contrast.",
  },
  {
    title: "E-commerce Product Grid + Filters",
    description:
      "Build a performant product listing interface with sorting and faceted filters.",
    tool: "Cursor",
    category: "E-commerce",
    promptText:
      "Create a storefront collection page for a sneaker brand. Include product cards with image, price, rating, and quick add button. Add filters for size, color, and price range; include sort options for newest, price low-high, and best rated. Keep interactions snappy and state-driven. Use mock local data only. Make layout responsive with a collapsible mobile filter drawer.",
  },
  {
    title: "Checkout Experience Redesign",
    description:
      "Design a clean multi-step checkout focused on completion rate.",
    tool: "Bolt",
    category: "E-commerce",
    promptText:
      "Implement a 3-step checkout UI (shipping, payment, review) for a DTC skincare brand. Include progress indicator, editable cart summary, promo code input, and inline form validation. Use calm colors and clear spacing to reduce cognitive load. Ensure keyboard navigation, field labels, and error messages are accessible. Return modular React components with Tailwind classes.",
  },
  {
    title: "AI Note-Taking App UI",
    description:
      "Create a productivity app shell with sidebar, editor, and AI assistant panel.",
    tool: "Claude Code",
    category: "Dashboard",
    promptText:
      "Build a responsive app layout for an AI note-taking tool. Left sidebar: notebook list + search. Center: rich-text note area. Right panel: AI actions (summarize, rewrite, action items). Include top bar with workspace selector and profile menu. Provide polished spacing, typography, and hover states. Use static local mock data and no backend dependencies.",
  },
  {
    title: "Developer Docs Landing",
    description:
      "Create a docs-first homepage that guides users to quickstart and API references.",
    tool: "v0",
    category: "Landing Page",
    promptText:
      "Design a developer documentation landing page for an API product called StreamGrid. Include hero with quickstart CTA, language tabs for code snippets, feature comparison cards, and a structured docs sidebar preview. Add trust indicators like uptime stats and SDK badges. Keep style technical but approachable with restrained color usage and readable code-style typography.",
  },
  {
    title: "Agency Portfolio Studio Theme",
    description:
      "Generate a visually bold portfolio site for a creative studio.",
    tool: "Bolt",
    category: "Portfolio",
    promptText:
      "Create a multi-section portfolio website for a design agency named Orbit Studio. Include hero, capabilities, featured projects, team intro, process timeline, and contact section. Use strong visual rhythm, large headlines, and alternating section backgrounds. Add subtle hover effects to project cards and ensure responsive behavior from 375px to large desktop.",
  },
  {
    title: "Gamified Habit Tracker",
    description:
      "Build a playful tracker interface with streaks, badges, and progress feedback.",
    tool: "Cursor",
    category: "Game",
    promptText:
      "Design a habit-tracker web app UI with game mechanics. Include daily checklist, streak counter, XP progress bar, unlockable badges, and weekly heatmap. Use cheerful colors, rounded components, and motion cues for completed actions. Keep implementation in React + Tailwind with static data. Include empty state for new users and motivational microcopy.",
  },
  {
    title: "Browser Puzzle Game Start Screen",
    description:
      "Create an engaging game home screen with difficulty and mode selection.",
    tool: "Claude Code",
    category: "Game",
    promptText:
      "Build the start screen UI for a browser puzzle game called Neon Blocks. Include logo area, animated background, mode cards (classic, timed, zen), difficulty selector, and primary start button. Add high-score panel and keyboard shortcut hints. Keep the design vibrant but readable. Implement with accessible controls and responsive layout for mobile and desktop.",
  },
  {
    title: "Creator Link-in-Bio Page",
    description:
      "Produce a minimal mobile-first profile page optimized for clicks.",
    tool: "v0",
    category: "Portfolio",
    promptText:
      "Generate a link-in-bio page for a tech creator. Include avatar, short bio, social badges, featured links, newsletter signup, and sponsor section. Use soft gradients, glassmorphism card style, and smooth tap feedback. Prioritize mobile ergonomics, fast loading, and accessible focus states. Provide clean React + Tailwind output.",
  },
  {
    title: "B2B CRM Pipeline Dashboard",
    description:
      "Assemble a sales pipeline dashboard with stage-wise visibility and activity feed.",
    tool: "Cursor",
    category: "Dashboard",
    promptText:
      "Create a CRM dashboard page showing pipeline stages with deal counts and values, activity timeline, top reps leaderboard, and upcoming follow-ups. Add filters for owner, stage, and date. Use card-based UI with clear hierarchy and meaningful color coding. Ensure components are reusable and responsive. Use static local data and TypeScript types.",
  },
  {
    title: "Subscription Pricing Page Optimizer",
    description:
      "Build a pricing page with monthly/yearly toggle and highlighted best plan.",
    tool: "Bolt",
    category: "Landing Page",
    promptText:
      "Design a SaaS pricing page with three tiers, feature comparison table, FAQ, and trust badges. Include a monthly/yearly billing toggle that updates visible prices. Emphasize the recommended plan with stronger contrast and badge. Ensure all CTAs are clear and scannable. Produce responsive Next.js + Tailwind code with accessibility best practices.",
  },
];
