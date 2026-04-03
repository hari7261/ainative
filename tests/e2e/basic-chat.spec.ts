import { test, expect } from '@playwright/test';

test.describe('Basic Chat Example', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('should load the application', async ({ page }) => {
    await expect(page.locator('h2')).toContainText('Basic Chat Example');
  });

  test('should have an input field', async ({ page }) => {
    const input = page.locator('.ai-input-field');
    await expect(input).toBeVisible();
  });

  test('should have a send button', async ({ page }) => {
    const button = page.locator('.ai-input-submit');
    await expect(button).toBeVisible();
  });

  test('should type and submit a message', async ({ page }) => {
    const input = page.locator('.ai-input-field');
    const button = page.locator('.ai-input-submit');

    await input.fill('Hello, AI!');
    await button.click();

    // Wait for the message to appear
    await page.waitForSelector('.ai-stream-message', { timeout: 5000 });

    const messages = page.locator('.ai-stream-message');
    await expect(messages).toHaveCount(1);
  });

  test('should stream a response', async ({ page }) => {
    // This test requires a running server
    const input = page.locator('.ai-input-field');
    const button = page.locator('.ai-input-submit');

    await input.fill('Tell me a short joke');
    await button.click();

    // Wait for streaming to complete
    await page.waitForTimeout(3000);

    const messages = page.locator('.ai-stream-message');
    const count = await messages.count();

    expect(count).toBeGreaterThan(0);
  });
});
