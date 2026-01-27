
const { test, expect } = require('@playwright/test');

test.describe('Consultation Flow', () => {
    test.beforeEach(async ({ page }) => {
        // Login first
        await page.goto('http://localhost:5173/login');
        await page.fill('input[type="email"]', 'patient@test.com');
        await page.fill('input[type="password"]', 'password123'); // Assuming this user exists
        await page.getByRole('button', { name: /login/i }).click();
        await expect(page).toHaveURL(/.*dashboard/);
    });

    test('Full Consultation Journey', async ({ page }) => {
        // Navigate to Consultation
        await page.getByRole('link', { name: /initiate_consult/i }).click();
        await expect(page.getByText('INITIATE_PROTOCOL')).toBeVisible();

        // Start
        await page.getByRole('button', { name: /initiate_protocol/i }).click();
        await expect(page.getByText('Consultation_Active')).toBeVisible();

        // Send Message
        const input = page.getByPlaceholder('Type your symptoms...');
        await input.fill('I have a severe headache');
        await page.getByRole('button', { name: /submit/i }).click(); // Send button icon usually inside button

        // Verify Analysis
        await expect(page.getByText('Analyzing...')).toBeVisible();
        await expect(page.getByText('Analyzing...')).toBeHidden({ timeout: 20000 });

        // Handle Termination Dialog
        page.on('dialog', dialog => dialog.accept());

        // Terminate
        await page.getByRole('button', { name: /terminate_session/i }).click();

        // Verify Redirect to History or Dashboard
        // Plan said navigate('/history'), so let's check that
        await expect(page).toHaveURL(/.*history/);
    });
});
