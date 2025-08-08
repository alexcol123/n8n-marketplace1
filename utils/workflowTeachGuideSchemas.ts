export const teachingGuideSchema = {
  type: "object",
  properties: {
    title: {
      type: "string",
      description:
        "Create a problem-focused, outcome-driven title under 60 characters using formulas like 'OUTCOME + TIME FRAME + PAIN RELIEF' (e.g., 'Get Paid in Days, Not Weeks') or 'STOP/NEVER + PROBLEM' (e.g., 'Never Miss Another Payment'). Focus on the business result and emotional impact, not technical features. Include relevant emojis.",
    },
    description: {
      type: "string",
      description:
        "Brief one-sentence description of what this automation accomplishes from a business perspective. Focus on the transformation, not the technology.",
    },
    projectIntro: {
      type: "string",
      description:
        "Paul Graham style introduction explaining the real cost of NOT having this automation. Start by identifying the hidden pain, then show the transformation. Include 'Whether you're [simple use case] or [bigger ambition]' to appeal to both beginners and entrepreneurs. Under 200 words.",
    },
    idealFor: {
      type: "string",
      description:
        "Three specific target audiences using this format: '🎯 [Audience 1] 🎯 [Audience 2] 🎯 [Audience 3]'. Be specific about who has this exact pain point.",
    },
    timeToValue: {
      type: "string",
      description:
        "Compare setup time vs time saved weekly. Format: '⚡ **X minutes/hours** to build vs. **X hours** spent every week on [specific manual tasks]. Make the ROI calculation obvious and compelling.",
    },
    howItWorks: {
      type: "string",
      description:
        "3-4 bullet points using ✅ symbol explaining the automation flow in business terms. Each bullet should describe what happens automatically, with **bold tool names**. Focus on outcomes, not technical implementation.",
    },
    realCostOfNotHaving: {
      type: "string",
      description:
        "Paul Graham style explanation of what you're really losing beyond just time. Include opportunity costs, reputation damage, cash flow issues, and competitive disadvantages. Make it feel urgent and costly to NOT have this.",
    },
    whatYoullBuild: {
      type: "string",
      description:
        "A bulleted list using • symbol and \\n line breaks, with 4-6 tangible, specific outcomes. Each bullet should describe a complete system or capability, with **bold tool names**. Use accessible language - avoid technical jargon.",
    },
    possibleMonetization: {
      type: "string",
      description:
        "Focus on selling TO business owners who need this automation. Structure: 1) Identify the target market that has this pain, 2) Specific pricing for setup ($XXX) and monthly service ($XX/month), 3) Include realistic client count and monthly revenue calculation, 4) Position as solving immediate business pain. Make it feel like a validated business opportunity.",
    },
    toolsUsed: {
      type: "array",
      items: {
        type: "string",
        description:
          "Format: 'Tool Name - Brief Description' using accessible language that explains what the tool does for the business outcome, not technical specifications",
      },
      description:
        "List of tools and services the student will master, described in everyday business language",
    },
  },
  required: [
    "title",
    "description",
    "projectIntro",
    "idealFor",
    "timeToValue",
    "howItWorks",
    "realCostOfNotHaving",
    "whatYoullBuild",
    "possibleMonetization",
    "toolsUsed",
  ],
};

export const stepTeachingSchema = {
  type: "object",
  properties: {
    summary: {
      type: "string",
      description:
        "A very brief, 3-5 word action-oriented summary of the technical task. Use a direct 'Verb + Noun' format. Examples: 'Capture user request via form', 'Upload photo to Google Drive', 'Generate AI image prompt'. This should be like a to-do list item.",
    },
    explanation: {
      type: "string",
      description:
        "A friendly, 3-sentence explanation that MUST follow this structure: 1) WHAT: Explain directly what this step technically does (e.g., 'This step uploads the image to Google Drive.'). 2) WHY: Explain the immediate reason for this action within the workflow (e.g., 'We do this so the next API can access the file.'). 3) THE BIG PICTURE: Connect it to a broader, James Clear-style systems insight (e.g., 'This creates a reliable asset pipeline, which is key to any automated content system.'). Use simple, jargon-free language.",
    },
    tips: {
      type: "array",
      items: { type: "string" },
      description:
        "Exactly 3 practical, actionable tips that save time and prevent frustration",
    },
    keyPoints: {
      type: "array",
      items: { type: "string" },
      description: "Exactly 2 core learning objectives or concepts",
    },
    summaryForNext: {
      type: "string",
      description:
        "Show progression and data flow, not just a list of completed steps (1-2 sentences)",
    },
  },
  required: ["summary", "explanation", "tips", "keyPoints", "summaryForNext"],
};
