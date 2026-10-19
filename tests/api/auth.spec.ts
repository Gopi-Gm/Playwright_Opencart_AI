import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';

dotenv.config({ override: true });

test.describe('Authentication API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------
    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
    const USERNAME = process.env.USERNAME || 'mor_2314';
    const PASSWORD = process.env.PASSWORD || '83r5^_';

    // ---------------------------------------------------------
    // POST - Successful Login (Scenario 1)
    // ---------------------------------------------------------
    test('POST - Successful Login @master @sanity @api', async ({ request }) => {
        const loginUrl = `${BASE_URL}${Routes.AUTH_LOGIN}`;

        const response = await test.step('Send POST login request with valid credentials', async () => {
            return await request.post(loginUrl, {
                data: {
                    username: USERNAME,
                    password: PASSWORD
                }
            });
        });

        await test.step('Verify status code 201', async () => {
            expect(response.status()).toBe(201);
        });

        await test.step('Parse JSON response and verify token exists as non-empty string', async () => {
            const body = await response.json();
            expect(body).toHaveProperty('token');
            expect(typeof body.token).toBe('string');
            expect(body.token.trim().length).toBeGreaterThan(0);
        });

        console.log('✅ Successful Login test passed');
    });

    // ---------------------------------------------------------
    // POST - Invalid Login (Scenario 2)
    // ---------------------------------------------------------
    test('POST - Invalid Login @master @regression @api', async ({ request }) => {
        const loginUrl = `${BASE_URL}${Routes.AUTH_LOGIN}`;
        const invalidPayload = RandomDataUtil.generateInvalidLoginPayload();

        const response = await test.step('Send POST login request with invalid credentials', async () => {
            return await request.post(loginUrl, {
                data: invalidPayload
            });
        });

        await test.step('Verify status code 401', async () => {
            expect(response.status()).toBe(401);
        });

        await test.step('Verify error message is "username or password is incorrect"', async () => {
            const responseText = await response.text();
            expect(responseText.trim()).toBe('username or password is incorrect');
        });

        console.log('✅ Invalid Login test passed');
    });
});
