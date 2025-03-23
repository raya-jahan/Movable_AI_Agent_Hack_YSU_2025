// playwright-script.js

import { chromium } from "playwright";

const webSurf =async (prompt) => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
try {
  
  await page.goto("http://127.0.0.1:7788/");
} catch (error) {
  
  console.error("Error during web surfing:", error);
}
try {
  
  await page.click("#component-17-button");
} catch (error) {
  
  console.error("Error clicking the button:", error);
}

  //click the llm provider dropdown input to expand options
  await page.click('input[aria-label="LLM Provider"]');
  //select the "google" option from the dropdown (adjust the text/selector as needed)
  await page.click("text=google");

  //click the Model Name dropdown
  await page.click('input[aria-label="Model Name"]');
  //select the gemini-2.0-flash-thinking-exp option
  await page.click("text=gemini-2.0-flash-thinking-exp");

  // 6. Fill in the API key
  await page.fill(
    'input[data-testid="password"]',
    ""
  );

  await page.click("#component-46-button");
  await page.fill(
    '[placeholder="Enter your task here..."]',
    prompt
  );

  // 4. Click the "Run Agent" button
  await page.click("#component-50");

  // (Optional) Wait a few seconds to observe the result
  await page.waitForTimeout(5000);

  // Close the browser
  await browser.close();
}

export default webSurf;


