export const teachingGuideSchema = {
  type: "object",
  properties: {
    title: {
      type: "string",
      description: "Create a problem-focused, outcome-driven title under 60 characters using formulas like 'OUTCOME + TIME FRAME + PAIN RELIEF' (e.g., 'Get Paid in Days, Not Months') or 'STOP/NEVER + PROBLEM' (e.g., 'Never Miss Another Payment'). Focus on the business result and emotional impact, not technical features. Include relevant emojis."
    },
    projectIntro: {
      type: "string", 
      description: "A conversational introduction starting with 'Imagine...' and ellipsis, explaining the transformation this enables. Include 'Whether you're [simple use case] or [bigger ambition]' to appeal to both beginners and entrepreneurs. End with strategic advice like 'Start simple, then scale from there.' Keep under 150 words."
    },
    whatYoullBuild: {
      type: "string",
      description: "A bulleted list using • symbol and \\n line breaks, with 4-6 tangible, specific outcomes. Each bullet should describe a complete system or capability, with **bold tool names**. Use accessible language - avoid technical jargon. Focus on what the system does, not how it works."
    },
    possibleMonetization: {
      type: "string",
      description: "A 3-4 sentence business opportunity starting with '🚀 BUSINESS OPPORTUNITY:' that follows this structure: 1) Start by building this exact automation for businesses at a specific price per project, 2) Mention solving a major pain point, 3) Progress to offering a 'Pro' subscription version, 4) Include realistic subscriber count and monthly revenue that leads to 'real freedom' and 'replacing your 9-to-5'"
    },
    toolsUsed: {
      type: "array",
      items: {
        type: "string",
        description: "Format: 'Tool Name - Brief Description' using accessible language that explains what the tool does, not technical specifications"
      },
      description: "List of tools and services the student will master, described in everyday language"
    }
  },
  required: ["title", "projectIntro", "whatYoullBuild", "possibleMonetization", "toolsUsed"]
};

export   const stepTeachingSchema = {
  type: "object",
  properties: {
    summary: {
      type: "string",
      description: "Brief 5-7 word action-oriented summary using power verbs like 'Create', 'Process', 'Generate', 'Upload'. Focus on the outcome/result, not the technical process."
    },
    explanation: {
      type: "string",
      description: "Friendly 2-3 sentence explanation in accessible language. Start with what this step accomplishes, explain why it's important for the bigger picture, and show how it builds on previous work. Avoid technical jargon - use everyday language that both beginners and entrepreneurs can understand."
    },
    tips: {
      type: "array",
      items: {
        type: "string"
      },
      minItems: 3,
      maxItems: 3,
      description: "Exactly 3 practical, actionable tips that save time and prevent frustration. Use accessible language and focus on common-sense advice rather than technical troubleshooting. Make them feel confident and capable."
    },
    keyPoints: {
      type: "array", 
      items: {
        type: "string"
      },
      minItems: 2,
      maxItems: 2,
      description: "Exactly 2 core learning concepts that show the bigger picture value of this step. Focus on why this matters for building something useful, using language that motivates both casual users and future business builders."
    },
    summaryForNext: {
      type: "string",
      description: "Brief 1-2 sentence summary that shows meaningful progress toward the end goal. Focus on what valuable capability has been built so far, using encouraging language that builds momentum for the next step."
    }
  },
  required: ["summary", "explanation", "tips", "keyPoints", "summaryForNext"]
};