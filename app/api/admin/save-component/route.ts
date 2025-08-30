import { NextRequest, NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';
import { FormConfig } from '@/components/(custom)/(admin)/FormBuilder';
import { ChatConfig } from '@/components/(custom)/(admin)/ChatBuilder';

export async function POST(request: NextRequest) {
  try {
    const { siteName, componentName, componentCode, formConfig, chatConfig } = await request.json() as {
      siteName: string;
      componentName: string;
      componentCode: string;
      formConfig?: FormConfig;
      chatConfig?: ChatConfig;
    };
    
    if (!siteName || !componentName || !componentCode) {
      return NextResponse.json(
        { error: "siteName, componentName, and componentCode are required" },
        { status: 400 }
      );
    }

    const portfolioTemplatesDir = path.join(process.cwd(), 'components', 'portfolio-templates');
    
    // Ensure directory exists
    if (!fs.existsSync(portfolioTemplatesDir)) {
      fs.mkdirSync(portfolioTemplatesDir, { recursive: true });
    }

    // Save the component file
    const componentPath = path.join(portfolioTemplatesDir, `${componentName}.tsx`);
    fs.writeFileSync(componentPath, componentCode);
    
    // Save the configuration for future editing
    let configPath = '';
    if (formConfig) {
      const formConfigDir = path.join(process.cwd(), 'data', 'form-configs');
      if (!fs.existsSync(formConfigDir)) {
        fs.mkdirSync(formConfigDir, { recursive: true });
      }
      
      configPath = path.join(formConfigDir, `${siteName}.json`);
      fs.writeFileSync(configPath, JSON.stringify(formConfig, null, 2));
    }
    
    if (chatConfig) {
      const chatConfigDir = path.join(process.cwd(), 'data', 'chat-configs');
      if (!fs.existsSync(chatConfigDir)) {
        fs.mkdirSync(chatConfigDir, { recursive: true });
      }
      
      configPath = path.join(chatConfigDir, `${siteName}.json`);
      fs.writeFileSync(configPath, JSON.stringify(chatConfig, null, 2));
    }

    return NextResponse.json({ 
      success: true, 
      componentName,
      componentPath: componentPath.replace(process.cwd(), ''),
      configPath: configPath.replace(process.cwd(), '')
    });
  } catch (error) {
    console.error("Error saving component:", error);
    return NextResponse.json(
      { error: "Failed to save component" },
      { status: 500 }
    );
  }
}