export const teachingGuideSchema = {
  type: "object",
  properties: {
    title: {
      type: "string",
      description:
        "Create a problem-focused, outcome-driven title under 60 characters using formulas like 'OUTCOME + TIME FRAME + PAIN RELIEF' (e.g., 'Get Paid in Days, Not Weeks') or 'STOP/NEVER + PROBLEM' (e.g., 'Never Miss Another Payment'). Focus on the business result and emotional impact, not technical features. Include relevant emojis.",
    },
    whatYoullBuild: {
      type: "string",
      description:
        "A compelling 150-200 word description that follows this structure: [MAIN PRODUCT/OUTCOME] + [KEY BENEFIT] + [TECHNICAL FOUNDATION] + [TIME SAVINGS] + [BUSINESS IMPACT]. First, analyze the workflow steps to identify the primary end product (e.g., 'cartoon video generator', 'automated report system', 'lead qualification bot'). Lead with this main outcome, then highlight the key benefit it provides. Include specific time-saving examples (e.g., 'reduces 3-hour manual process to 10 minutes'). Mention the **bold tool names** that power the system. End with the broader business impact or scalability benefit. Use accessible language that emphasizes what the user will achieve, not just what tools they'll use. Make it feel like a valuable, time-saving solution they're building.",
    },
    whatYoullBuildSummary: {
      type: "string",
      description:
        "A compelling 2-line summary (maximum 120 characters) for workflow cards that captures attention and makes readers want to build this project. Focus on the main outcome and key benefit. Use action-oriented language and include the primary tool or result. Examples: 'Build automated invoice system that charges clients instantly and sends receipts via Gmail' or 'Create AI-powered video generator that transforms text into engaging cartoon content in minutes'. Make it irresistible and portfolio-worthy.",
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
    "whatYoullBuild",
    "whatYoullBuildSummary",
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
