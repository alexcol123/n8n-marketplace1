/**
 * WORKFLOW TOOLS DETECTION UTILITY
 * 
 * Analyzes workflow steps to identify external tools and services used in n8n workflows.
 * This function serves as a comprehensive fallback for tool detection when LLM analysis fails,
 * providing student-friendly tool names for educational content generation.
 * 
 * WHAT IT DOES:
 * - Scans workflow steps for n8n node types (Google Sheets, Slack, OpenAI, etc.)
 * - Analyzes HTTP request URLs to identify external APIs and services
 * - Returns human-readable tool descriptions like "OpenAI - AI Language Models"
 * - Covers 100+ popular services and APIs commonly used in automation workflows
 * 
 * USE CASES:
 * - Teaching guide generation (shows students what tools they'll learn)
 * - Workflow documentation and categorization
 * - Error fallback when LLM tool detection fails
 * - Analytics and usage tracking of popular automation tools
 * 
 * EXAMPLE OUTPUT:
 * Input: Steps with Google Sheets node + HTTP request to api.openai.com
 * Output: ["Google Sheets - Spreadsheet Automation", "OpenAI - AI Language Models"]
 * 
 * @param workflowSteps - Array of workflow step objects containing nodeType and parameters
 * @returns Array of student-friendly tool descriptions, or empty array if no tools detected
 */
export function detectWorkflowTools(workflowSteps: any[]): string[] {
  const tools = new Set<string>();

  workflowSteps.forEach(step => {
    const nodeType = step.nodeType?.toLowerCase() || '';
    const url = step.parameters?.url || '';

    // Basic node type detection
    if (nodeType.includes('n8n-nodes-base.webhook')) {
      tools.add('Webhook - Real-time Data Receiving');
    } else if (nodeType.includes('n8n-nodes-base.schedule')) {
      tools.add('Schedule - Trigger at Intervals');
    } else if (nodeType.includes('n8n-nodes-base.set')) {
      tools.add('Set - Data Manipulation');
    } else if (nodeType.includes('n8n-nodes-base.if')) {
      tools.add('IF - Conditional Logic');
    } else if (nodeType.includes('n8n-nodes-base.switch')) {
      tools.add('Switch - Multi-conditional Logic');
    } else if (nodeType.includes('n8n-nodes-base.merge')) {
      tools.add('Merge - Combine Data Streams');
    } else if (nodeType.includes('n8n-nodes-base.googlesheets')) {
      tools.add('Google Sheets - Spreadsheet Automation');
    } else if (nodeType.includes('n8n-nodes-base.gmail')) {
      tools.add('Gmail - Email Automation');
    } else if (nodeType.includes('n8n-nodes-base.googledrive')) {
      tools.add('Google Drive - File Storage');
    } else if (nodeType.includes('n8n-nodes-base.googlecalendar')) {
      tools.add('Google Calendar - Calendar Automation');
    } else if (nodeType.includes('n8n-nodes-base.microsoftexcel')) {
      tools.add('Microsoft Excel - Spreadsheet Automation'); 
    } else if (nodeType.includes('n8n-nodes-base.microsoftoutlook')) {
      tools.add('Microsoft Outlook - Email & Calendar');
    } else if (nodeType.includes('n8n-nodes-base.microsoftteams')) {
      tools.add('Microsoft Teams - Collaboration');
    } else if (nodeType.includes('n8n-nodes-base.onedrive')) {
      tools.add('Microsoft OneDrive - File Storage');
    } else if (nodeType.includes('n8n-nodes-base.slack')) {
      tools.add('Slack - Team Communication');
    } else if (nodeType.includes('n8n-nodes-base.discord')) {
      tools.add('Discord - Community Communication');
    } else if (nodeType.includes('n8n-nodes-base.notion')) {
      tools.add('Notion - Project Management');
    } else if (nodeType.includes('n8n-nodes-base.trello')) {
      tools.add('Trello - Task Management');
    } else if (nodeType.includes('n8n-nodes-base.airtable')) {
      tools.add('Airtable - Database & Spreadsheet Hybrid');
    } else if (nodeType.includes('n8n-nodes-base.jira')) {
      tools.add('Jira - Issue Tracking');
    } else if (nodeType.includes('n8n-nodes-base.linear')) {
      tools.add('Linear - Issue Tracking');
    } else if (nodeType.includes('n8n-nodes-base.github')) {
      tools.add('GitHub - Code Repository');
    } else if (nodeType.includes('n8n-nodes-base.gitlab')) {
      tools.add('GitLab - DevOps Platform');
    } else if (nodeType.includes('n8n-nodes-base.typeform')) {
      tools.add('Typeform - Online Forms');
    } else if (nodeType.includes('n8n-nodes-base.calendly')) {
      tools.add('Calendly - Scheduling');
    } else if (nodeType.includes('n8n-nodes-base.intercom')) {
      tools.add('Intercom - Customer Communication');
    } else if (nodeType.includes('n8n-nodes-base.zendesk')) {
      tools.add('Zendesk - Customer Support');
    } else if (nodeType.includes('n8n-nodes-base.freshdesk')) {
      tools.add('Freshdesk - Customer Support');
    } else if (nodeType.includes('n8n-nodes-base.youtube')) {
      tools.add('YouTube - Video Platform');
    } else if (nodeType.includes('n8n-nodes-base.vimeo')) {
      tools.add('Vimeo - Video Hosting');
    } else if (nodeType.includes('n8n-nodes-base.awss3')) {
      tools.add('Amazon S3 - Cloud Storage');
    } else if (nodeType.includes('n8n-nodes-base.redis')) {
      tools.add('Redis - In-Memory Database');
    } else if (nodeType.includes('n8n-nodes-base.mongodb')) {
      tools.add('MongoDB - NoSQL Database');
    } else if (nodeType.includes('n8n-nodes-base.elasticsearch')) {
      tools.add('Elasticsearch - Search Engine');
    } else if (nodeType.includes('n8n-nodes-base.matrix')) {
      tools.add('Matrix - Decentralized Communication');
    } else if (nodeType.includes('n8n-nodes-base.mattermost')) {
      tools.add('Mattermost - Team Communication');
    } else if (nodeType.includes('n8n-nodes-base.rocketchat')) {
      tools.add('Rocket.Chat - Team Communication');
    } else if (nodeType.includes('n8n-nodes-base.openai')) {
      tools.add('OpenAI - AI Language Models');
    } else if (nodeType.includes('n8n-nodes-base.code')) {
      tools.add('Code - Custom JavaScript');
    } else if (nodeType.includes('n8n-nodes-base.mysql')) {
      tools.add('MySQL - Database Management');
    } else if (nodeType.includes('n8n-nodes-base.postgres')) {
      tools.add('Postgres - Database Management');
    } else if (nodeType.includes('n8n-nodes-base.start')) {
      tools.add('Start - Workflow Initiation');
    } else if (nodeType.includes('n8n-nodes-base.execute-workflow')) {
      tools.add('Execute Workflow - Chaining Workflows');
    } else if (nodeType.includes('n8n-nodes-base.wait')) {
      tools.add('Wait - Delay Execution');
    } else if (nodeType.includes('n8n-nodes-base.error-trigger')) {
      tools.add('Error Trigger - Workflow Error Handling');
    } else if (nodeType.includes('n8n-nodes-base.splitinbatches')) {
      tools.add('Split In Batches - Data Batching');
    } else if (nodeType.includes('n8n-nodes-base.function')) {
      tools.add('Function - Basic Data Transformation');
    } else if (nodeType.includes('n8n-nodes-base.functionitem')) {
      tools.add('Function Item - Item-level Data Transformation');
    } else if (nodeType.includes('n8n-nodes-base.movebinarydata')) {
      tools.add('Move Binary Data - File Handling');
    } else if (nodeType.includes('n8n-nodes-base.readbinaryfile')) {
      tools.add('Read Binary File - File Reading');
    } else if (nodeType.includes('n8n-nodes-base.writebinaryfile')) {
      tools.add('Write Binary File - File Writing');
    } else if (nodeType.includes('n8n-nodes-base.xml')) {
      tools.add('XML - XML Data Processing');
    } else if (nodeType.includes('n8n-nodes-base.httprequest')) {
      // Expanded URL detection for HTTP services
      if (url.includes('api.openai.com')) {
        tools.add('OpenAI - AI Language Models');
      } else if (url.includes('api.elevenlabs.io')) {
        tools.add('ElevenLabs - Voice Synthesis');
      } else if (url.includes('api.anthropic.com')) {
        tools.add('Anthropic - AI Language Models');
      } else if (url.includes('api.cohere.ai')) {
        tools.add('Cohere - AI Language Models');
      } else if (url.includes('api.replicate.com') || url.includes('replicate.ai')) {
        tools.add('Replicate - AI Models & APIs');
      } else if (url.includes('api.huggingface.co')) {
        tools.add('Hugging Face - AI Models & Datasets');
      } else if (url.includes('api.stability.ai')) {
        tools.add('Stability AI - Image & Audio Generation');
      } else if (url.includes('api.midjourney.com')) {
        tools.add('Midjourney - Image Generation');
      } else if (url.includes('api.hedra.com')) {
        tools.add('Hedra - AI Video Creation');
      } else if (url.includes('api.runpod.io')) {
        tools.add('RunPod - GPU Cloud Computing');
      } else if (url.includes('api.vast.ai')) {
        tools.add('Vast.ai - GPU Rental Platform');  
      } else if (url.includes('api.together.xyz')) {
        tools.add('Together AI - Large Language Models');
      } else if (url.includes('api.groq.com')) {
        tools.add('Groq - Fast AI Inference');
      } else if (url.includes('api.perplexity.ai')) {
        tools.add('Perplexity - AI Search');
      } else if (url.includes('api.claude.ai')) {
        tools.add('Claude AI - Conversational AI');
      } else if (url.includes('api.stripe.com')) {
        tools.add('Stripe - Payment Processing');
      } else if (url.includes('api.paypal.com')) {
        tools.add('PayPal - Payment Processing');
      } else if (url.includes('api.shopify.com')) {
        tools.add('Shopify - E-commerce Platform');
      } else if (url.includes('woocommerce.')) {
        tools.add('WooCommerce - E-commerce Platform');
      } else if (url.includes('api.hubspot.com')) {
        tools.add('HubSpot - CRM Platform');
      } else if (url.includes('salesforce.com')) {
        tools.add('Salesforce - CRM Platform');
      } else if (url.includes('api.pipedrive.com')) {
        tools.add('Pipedrive - CRM Platform');
      } else if (url.includes('api.sendgrid.com')) {
        tools.add('SendGrid - Email Delivery Service');
      } else if (url.includes('api.mailchimp.com')) {
        tools.add('Mailchimp - Email Marketing');
      } else if (url.includes('api.convertkit.com')) {
        tools.add('ConvertKit - Email Marketing');
      } else if (url.includes('api.brevo.com') || url.includes('api.sendinblue.com')) {
        tools.add('Brevo (Sendinblue) - Marketing Platform');
      } else if (url.includes('api.resend.com')) {
        tools.add('Resend - Developer Email API');
      } else if (url.includes('api.postmark.com')) {
        tools.add('Postmark - Transactional Email');
      } else if (url.includes('api.loops.so')) {
        tools.add('Loops - Email Marketing');
      } else if (url.includes('api.beehiiv.com')) {
        tools.add('Beehiiv - Newsletter Platform');
      } else if (url.includes('api.github.com')) {
        tools.add('GitHub - Code Hosting & Version Control');
      } else if (url.includes('gitlab.com/api')) {
        tools.add('GitLab - DevOps Platform');
      } else if (url.includes('api.supabase.co')) {
        tools.add('Supabase - Backend as a Service');
      } else if (url.includes('api.firebase.google.com')) {
        tools.add('Firebase - Google Backend Platform');
      } else if (url.includes('api.planetscale.com')) {
        tools.add('PlanetScale - Serverless Database');
      } else if (url.includes('api.neon.tech')) {
        tools.add('Neon - Serverless Postgres');
      } else if (url.includes('api.railway.app')) {
        tools.add('Railway - Cloud Deployment Platform');
      } else if (url.includes('api.render.com')) {
        tools.add('Render - Cloud Application Platform');
      } else if (url.includes('api.digitalocean.com')) {
        tools.add('DigitalOcean - Cloud Infrastructure');
      } else if (url.includes('api.heroku.com')) {
        tools.add('Heroku - Cloud Platform (PaaS)');
      } else if (url.includes('api.vercel.com')) {
        tools.add('Vercel - Frontend Cloud Platform');
      } else if (url.includes('api.netlify.com')) {
        tools.add('Netlify - Web Development Platform');
      } else if (url.includes('api.aws.amazon.com') || url.includes('amazonaws.com')) {
        tools.add('Amazon Web Services - Cloud Platform');
      } else if (url.includes('api.azure.com') || url.includes('microsoft.com/api')) {
        tools.add('Microsoft Azure - Cloud Platform');
      } else if (url.includes('cloud.google.com/api')) {
        tools.add('Google Cloud Platform - Cloud Services');
      } else if (url.includes('api.cloudflare.com')) {
        tools.add('Cloudflare - Web Performance & Security');
      } else if (url.includes('api.apify.com')) {
        tools.add('Apify - Web Scraping & Automation');
      } else if (url.includes('api.firecrawl.dev')) {
        tools.add('Firecrawl - Web Scraping & Data Extraction');
      } else if (url.includes('api.telegram.org')) {
        tools.add('Telegram - Messaging');
      } else if (url.includes('graph.facebook.com')) {
        tools.add('Facebook Graph API - Social Media');
      } else if (url.includes('api.twitter.com')) {
        tools.add('X (Twitter) API - Social Media');
      } else if (url.includes('api.linkedin.com')) {
        tools.add('LinkedIn - Professional Networking');
      } else if (url.includes('api.instagram.com')) {
        tools.add('Instagram - Social Media');
      } else if (url.includes('tiktok.com')) {
        tools.add('TikTok - Social Media');
      } else if (url.includes('discord.com/api')) {
        tools.add('Discord - Community Communication');
      } else if (url.includes('slack.com/api')) {
        tools.add('Slack - Team Communication');
      } else if (url.includes('api.notion.com')) {
        tools.add('Notion - Project Management');
      } else if (url.includes('api.trello.com')) {
        tools.add('Trello - Task Management');
      } else if (url.includes('api.asana.com')) {
        tools.add('Asana - Project Management');
      } else if (url.includes('api.clickup.com')) {
        tools.add('ClickUp - Project Management');
      } else if (url.includes('api.monday.com')) {
        tools.add('Monday.com - Work Management');
      } else if (url.includes('api.linear.app')) {
        tools.add('Linear - Issue Tracking');
      } else if (url.includes('api.height.app')) {
        tools.add('Height - Project Management');
      } else if (url.includes('api.airtable.com')) {
        tools.add('Airtable - Database & Spreadsheet Hybrid');
      } else if (url.includes('sheets.googleapis.com')) {
        tools.add('Google Sheets - Spreadsheet Automation');
      } else if (url.includes('api.typeform.com')) {
        tools.add('Typeform - Online Forms');
      } else if (url.includes('api.jotform.com')) {
        tools.add('Jotform - Form Builder');
      } else if (url.includes('api.gravity.forms')) {
        tools.add('Gravity Forms - WordPress Forms');
      } else if (url.includes('api.ghost.org')) {
        tools.add('Ghost - Publishing Platform');
      } else if (url.includes('wordpress.com/api') || url.includes('wp-json')) {
        tools.add('WordPress - Content Management');
      } else if (url.includes('api.webflow.com')) {
        tools.add('Webflow - Visual Web Development');
      } else if (url.includes('api.framer.com')) {
        tools.add('Framer - Design & Prototyping');
      } else if (url.includes('api.figma.com')) {
        tools.add('Figma - Design Collaboration');
      } else if (url.includes('api.canva.com')) {
        tools.add('Canva - Graphic Design');
      } else if (url.includes('api.unsplash.com')) {
        tools.add('Unsplash - Stock Photography');
      } else if (url.includes('api.pexels.com')) {
        tools.add('Pexels - Stock Photography');
      } else if (url.includes('api.youtube.com')) {
        tools.add('YouTube - Video Platform');
      } else if (url.includes('api.vimeo.com')) {
        tools.add('Vimeo - Video Hosting');
      } else if (url.includes('api.loom.com')) {
        tools.add('Loom - Video Messaging');
      } else if (url.includes('api.zoom.us')) {
        tools.add('Zoom - Video Conferencing');
      } else if (url.includes('api.intercom.io')) {
        tools.add('Intercom - Customer Communication');
      } else if (url.includes('api.crisp.chat')) {
        tools.add('Crisp - Live Chat');
      } else if (url.includes('api.zendesk.com')) {
        tools.add('Zendesk - Customer Support');
      } else if (url.includes('api.freshdesk.com')) {
        tools.add('Freshdesk - Customer Support');
      } else if (url.includes('api.openweathermap.org')) {
        tools.add('OpenWeatherMap - Weather Data');
      } else if (url.includes('api.weatherapi.com')) {
        tools.add('WeatherAPI - Weather Data');
      } else if (url.includes('api.twilio.com')) {
        tools.add('Twilio - Communication APIs (SMS, Voice)');
      } else if (url.includes('api.pushover.net')) {
        tools.add('Pushover - Push Notifications');
      } else if (url.includes('api.cal.com')) {
        tools.add('Cal.com - Scheduling');
      } else if (url.includes('api.calendly.com')) {
        tools.add('Calendly - Scheduling');
      } else if (url.includes('api.dropboxapi.com')) {
        tools.add('Dropbox - File Storage');
      } else if (url.includes('upload.wikimedia.org')) {
        tools.add('Wikimedia - Media Uploads');
      } else if (url.includes('api.make.com')) {
        tools.add('Make (Integromat) - Automation Platform');
      } else if (url.includes('zapier.com/api')) {
        tools.add('Zapier - Automation Platform');
      } else if (url.includes('api.pabbly.com')) {
        tools.add('Pabbly Connect - Automation Platform');
      } else if (url) {
        tools.add('External API - Data Processing');
      } else {
        tools.add('HTTP Request - External Service');
      }
    }
  });

  return Array.from(tools);
}