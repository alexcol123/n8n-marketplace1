const { chromium } = require('@playwright/test');
const path = require('path');

async function takeScreenshots() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to the landing page
    console.log('Navigating to landing page...');
    await page.goto('http://localhost:3002', { waitUntil: 'networkidle' });
    
    // Wait for the page to fully load
    await page.waitForTimeout(3000);

    // Desktop screenshot (1920x1080)
    console.log('Taking desktop screenshot...');
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(1000);
    await page.screenshot({ 
      path: 'landing-desktop.png', 
      fullPage: true 
    });

    // Tablet screenshot (768x1024)
    console.log('Taking tablet screenshot...');
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(1000);
    await page.screenshot({ 
      path: 'landing-tablet.png', 
      fullPage: true 
    });

    // Mobile screenshot (375x667)
    console.log('Taking mobile screenshot...');
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);
    await page.screenshot({ 
      path: 'landing-mobile.png', 
      fullPage: true 
    });

    console.log('Screenshots saved successfully!');
    
  } catch (error) {
    console.error('Error taking screenshots:', error);
  } finally {
    await browser.close();
  }
}

takeScreenshots();