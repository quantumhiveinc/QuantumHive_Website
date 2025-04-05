import { test, expect, Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const LOG_FILE = path.join(__dirname, '..', 'admin_login_verification.log'); // Place log in project root
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'; // Use env var or default
const ADMIN_LOGIN_URL = `${BASE_URL}/admin/login`;
const ADMIN_DASHBOARD_URL_PATTERN = /.*\/admin.*/; // Pattern to check for successful redirect to any admin page

// --- Logger Function ---
function logAttempt(username: string, action: string, outcome: 'Success' | 'Failure', details: string = '') {
    const timestamp = new Date().toISOString();
    // Note: Getting client IP reliably in automated tests is often not feasible/accurate.
    const logEntry = `${timestamp} | User: ${username || '<empty>'} | Action: ${action} | Outcome: ${outcome} | Details: ${details}\n`;
    try {
        fs.appendFileSync(LOG_FILE, logEntry);
    } catch (error) {
        console.error(`Failed to write to log file ${LOG_FILE}:`, error);
    }
}

// --- Helper Function to Attempt Login ---
async function attemptLogin(page: Page, username: string, password?: string) {
    await page.goto(ADMIN_LOGIN_URL);

    // Wait for the page to be fully interactive
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('networkidle'); // Wait for network activity to cease

    // Ensure we are on the login page before proceeding
    expect(page.url()).toBe(ADMIN_LOGIN_URL);

    const usernameInput = page.locator('input[name="username"]');
    const passwordInput = page.locator('input[name="password"]');
    // Use a more specific locator for the Sign In button
    const submitButton = page.getByRole('button', { name: 'Sign In' });

    // Ensure elements are ready before interacting
    await usernameInput.waitFor({ state: 'visible', timeout: 3000 });
    await passwordInput.waitFor({ state: 'visible', timeout: 3000 });
    await submitButton.waitFor({ state: 'visible', timeout: 3000 });

    await usernameInput.fill(username);
    if (password !== undefined) { // Allow testing empty password explicitly
        await passwordInput.fill(password);
    }
    // Add a small delay before clicking, sometimes helps with event listeners
    await page.waitForTimeout(100);
    await submitButton.click();
}

// --- Test Suite ---
test.describe('Admin Login Verification', () => {
    // Clear log file before starting tests
    test.beforeAll(() => {
        try {
            if (fs.existsSync(LOG_FILE)) {
                fs.unlinkSync(LOG_FILE);
            }
            fs.writeFileSync(LOG_FILE, `--- Admin Login Test Log ---\n`);
        } catch (error) {
            console.error(`Failed to clear or create log file ${LOG_FILE}:`, error);
        }
    });

    test('1. Successful Login with Valid Admin Credentials', async ({ page }) => {
        const username = 'admin';
        const password = 'password'; // Using the hardcoded credentials
        const action = 'Admin Login Attempt (Valid Credentials)';
        let outcome: 'Success' | 'Failure' = 'Failure';
        let details = 'Test started';

        try {
            await attemptLogin(page, username, password);
            // Wait for navigation after successful login
            await page.waitForURL(ADMIN_DASHBOARD_URL_PATTERN, { timeout: 5000 }); // Wait up to 5s for redirect
            // Check if the URL matches the admin area pattern (more flexible than a fixed URL)
            expect(page.url()).toMatch(ADMIN_DASHBOARD_URL_PATTERN);
            expect(page.url()).not.toBe(ADMIN_LOGIN_URL); // Ensure we navigated away
            outcome = 'Success';
            details = `Redirected to ${page.url()}`;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            outcome = 'Failure'; // Ensure outcome is set on error
            details = `Test resulted in ${outcome}: ${errorMessage}. Current URL: ${page.url()}`;
            throw error; // Re-throw to mark the test as failed
        } finally {
            logAttempt(username, action, outcome, details);
        }
    });

    test('2. Failed Login: Correct Username, Incorrect Password', async ({ page }) => {
        const username = 'admin';
        const password = 'wrongpassword';
        const action = 'Admin Login Attempt (Incorrect Password)';
        let outcome: 'Success' | 'Failure' = 'Success'; // Assume success until failure is confirmed
        let details = 'Test started';

        try {
            await attemptLogin(page, username, password);
            // Wait briefly for potential error messages or page updates
            await page.waitForTimeout(1000); // Adjust if needed
            // Expect to stay on the login page
            expect(page.url()).toBe(ADMIN_LOGIN_URL);
            // Optional: Check for a specific error message element if known
            // const errorMessage = page.locator('.error-message'); // Example selector
            // await expect(errorMessage).toBeVisible();
            // await expect(errorMessage).toContainText('Invalid credentials'); // Example text
            outcome = 'Failure'; // Correct outcome for this test case
            details = 'Remained on login page as expected.';
            // If an error message check was added: details += ' Error message verified.';
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            outcome = 'Failure'; // Mark as failure if expectations weren't met
            details = `Test resulted in ${outcome} unexpectedly: ${errorMessage}. Current URL: ${page.url()}`;
            throw error; // Re-throw to mark the test as failed
        } finally {
            // Log the *intended* outcome (Failure) vs the *test execution* outcome
            logAttempt(username, action, 'Failure', details);
        }
    });

    test('3. Failed Login: Non-existent Admin Username', async ({ page }) => {
        const username = 'nonexistentuser';
        const password = 'password';
        const action = 'Admin Login Attempt (Non-existent User)';
        let outcome: 'Success' | 'Failure' = 'Success';
        let details = 'Test started';

        try {
            await attemptLogin(page, username, password);
            await page.waitForTimeout(1000);
            expect(page.url()).toBe(ADMIN_LOGIN_URL);
            // Optional: Check for error message
            outcome = 'Failure';
            details = 'Remained on login page as expected.';
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            outcome = 'Failure';
            details = `Test resulted in ${outcome} unexpectedly: ${errorMessage}. Current URL: ${page.url()}`;
            throw error;
        } finally {
            logAttempt(username, action, 'Failure', details);
        }
    });

    test('4. Failed Login: Empty Username/Password Fields', async ({ page }) => {
        const username = '';
        const password = '';
        const action = 'Admin Login Attempt (Empty Credentials)';
        let outcome: 'Success' | 'Failure' = 'Success';
        let details = 'Test started';

        try {
            await attemptLogin(page, username, password);
            await page.waitForTimeout(1000);
            expect(page.url()).toBe(ADMIN_LOGIN_URL);
            // Optional: Check for specific validation messages if the form has client-side validation
            outcome = 'Failure';
            details = 'Remained on login page as expected.';
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            outcome = 'Failure';
            details = `Test resulted in ${outcome} unexpectedly: ${errorMessage}. Current URL: ${page.url()}`;
            throw error;
        } finally {
            logAttempt(username, action, 'Failure', details);
        }
    });
});