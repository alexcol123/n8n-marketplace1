import { NextRequest, NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';

// This will store component mappings in a JSON file for simplicity
const MAPPINGS_FILE = path.join(process.cwd(), 'data', 'component-mappings.json');

interface ComponentMapping {
  siteName: string;
  componentName: string;
  isActive: boolean;
  updatedAt: string;
}

// Ensure data directory exists
function ensureDataDir() {
  const dataDir = path.dirname(MAPPINGS_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Read component mappings from file
function readMappings(): ComponentMapping[] {
  ensureDataDir();
  
  if (!fs.existsSync(MAPPINGS_FILE)) {
    return [];
  }
  
  try {
    const data = fs.readFileSync(MAPPINGS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading component mappings:', error);
    return [];
  }
}

// Write component mappings to file
function writeMappings(mappings: ComponentMapping[]) {
  ensureDataDir();
  
  try {
    fs.writeFileSync(MAPPINGS_FILE, JSON.stringify(mappings, null, 2));
  } catch (error) {
    console.error('Error writing component mappings:', error);
    throw new Error('Failed to save mappings');
  }
}

// Update the dynamic route file with new mappings
function updateDynamicRoute(mappings: ComponentMapping[]) {
  try {
    const routeFile = path.join(process.cwd(), 'app', 'dashboard', 'portfolio', '[siteId]', 'page.tsx');
    
    if (!fs.existsSync(routeFile)) {
      throw new Error('Dynamic route file not found');
    }
    
    let content = fs.readFileSync(routeFile, 'utf8');
    
    // Build the component map
    const componentMap = mappings
      .filter(m => m.isActive)
      .map(m => `  "${m.siteName}": ${m.componentName},`)
      .join('\n');
    
    // Find the PORTFOLIO_COMPONENTS section and replace it
    const mapPattern = /const PORTFOLIO_COMPONENTS = \{[\s\S]*?\};/;
    
    const newMap = `const PORTFOLIO_COMPONENTS = {
  "003-cartoon-video-generator": CartoonVideoTestForm,
${componentMap}
  // Components managed by admin panel
};`;
    
    if (mapPattern.test(content)) {
      content = content.replace(mapPattern, newMap);
      fs.writeFileSync(routeFile, content);
    }
  } catch (error) {
    console.error('Error updating dynamic route:', error);
    // Don't throw - this is not critical
  }
}

export async function GET() {
  try {
    const mappings = readMappings();
    return NextResponse.json(mappings);
  } catch {
    return NextResponse.json(
      { error: "Failed to read mappings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { siteName, componentName } = await request.json();
    
    if (!siteName || !componentName) {
      return NextResponse.json(
        { error: "siteName and componentName are required" },
        { status: 400 }
      );
    }
    
    const mappings = readMappings();
    
    // Remove existing mapping for this site
    const filteredMappings = mappings.filter(m => m.siteName !== siteName);
    
    // Add new mapping
    const newMapping: ComponentMapping = {
      siteName,
      componentName,
      isActive: true,
      updatedAt: new Date().toISOString()
    };
    
    filteredMappings.push(newMapping);
    
    // Save to file
    writeMappings(filteredMappings);
    
    // Update the dynamic route file
    updateDynamicRoute(filteredMappings);
    
    return NextResponse.json({ success: true, mapping: newMapping });
  } catch (error) {
    console.error("Error saving mapping:", error);
    return NextResponse.json(
      { error: "Failed to save mapping" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const siteName = url.searchParams.get('siteName');
    
    if (!siteName) {
      return NextResponse.json(
        { error: "siteName is required" },
        { status: 400 }
      );
    }
    
    const mappings = readMappings();
    const filteredMappings = mappings.filter(m => m.siteName !== siteName);
    
    writeMappings(filteredMappings);
    updateDynamicRoute(filteredMappings);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting mapping:", error);
    return NextResponse.json(
      { error: "Failed to delete mapping" },
      { status: 500 }
    );
  }
}