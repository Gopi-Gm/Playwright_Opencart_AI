import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';

dotenv.config({ override: true });

test.describe('Users API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------
    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
    const USER_ID = Number(process.env.USER_ID ?? 1);
    const LIMIT = Number(process.env.LIMIT ?? 3);

    // ---------------------------------------------------------
    // GET - All Users (Scenario 13)
    // ---------------------------------------------------------
    test('GET - All Users @master @sanity @api', async ({ request }) => {
        const url = `${BASE_URL}${Routes.GET_ALL_USERS}`;

        const response = await test.step('Send GET request for all users', async () => {
            return await request.get(url);
        });

        await test.step('Verify status code 200', async () => {
            expect(response.status()).toBe(200);
        });

        const users = await response.json();

        await test.step('Verify response body is non-empty array', async () => {
            expect(Array.isArray(users)).toBeTruthy();
            expect(users.length).toBeGreaterThan(0);
        });

        await test.step('Validate important user fields', async () => {
            const firstUser = users[0];
            expect(firstUser).toHaveProperty('id');
            expect(firstUser).toHaveProperty('username');
            expect(firstUser).toHaveProperty('email');
            expect(firstUser).toHaveProperty('name');
            expect(firstUser).toHaveProperty('address');
            expect(firstUser).toHaveProperty('phone');
        });

        console.log('✅ All Users retrieved and validated successfully');
    });

    // ---------------------------------------------------------
    // GET - User by ID (Scenario 14)
    // ---------------------------------------------------------
    test('GET - User by ID @master @sanity @api', async ({ request }) => {
        const endpoint = Routes.GET_USER_BY_ID.replace('{id}', String(USER_ID));
        const url = `${BASE_URL}${endpoint}`;

        const response = await test.step(`Send GET request for user ID ${USER_ID}`, async () => {
            return await request.get(url);
        });

        await test.step('Verify status code 200', async () => {
            expect(response.status()).toBe(200);
        });

        const user = await response.json();

        await test.step('Verify returned user ID matches requested ID', async () => {
            expect(user.id).toBe(USER_ID);
        });

        await test.step('Validate important user properties', async () => {
            expect(user).toHaveProperty('id');
            expect(user).toHaveProperty('email');
            expect(user).toHaveProperty('username');
            expect(user).toHaveProperty('name');
            expect(user.name).toHaveProperty('firstname');
            expect(user.name).toHaveProperty('lastname');
            expect(user).toHaveProperty('address');
            expect(user).toHaveProperty('phone');
        });

        console.log(`✅ User ID ${USER_ID} retrieved and validated successfully`);
    });

    // ---------------------------------------------------------
    // GET - Users with Limit (Scenario 15)
    // ---------------------------------------------------------
    test('GET - Users with Limit @master @regression @api', async ({ request }) => {
        const endpoint = Routes.GET_USERS_WITH_LIMIT.replace('{limit}', String(LIMIT));
        const url = `${BASE_URL}${endpoint}`;

        const response = await test.step(`Send GET request with user limit ${LIMIT}`, async () => {
            return await request.get(url);
        });

        await test.step('Verify status code 200', async () => {
            expect(response.status()).toBe(200);
        });

        const users = await response.json();

        await test.step(`Verify response is array and matches count ${LIMIT}`, async () => {
            expect(Array.isArray(users)).toBeTruthy();
            expect(users.length).toBe(LIMIT);
        });

        console.log(`✅ Users limited to ${LIMIT} validated successfully`);
    });

    // ---------------------------------------------------------
    // GET - Sort Users (Scenario 16)
    // ---------------------------------------------------------
    test('GET - Sort Users Ascending and Descending @master @regression @api', async ({ request }) => {
        // Ascending
        await test.step('Verify ascending user sorting', async () => {
            const ascEndpoint = Routes.GET_USERS_SORTED.replace('{order}', 'asc');
            const ascResponse = await request.get(`${BASE_URL}${ascEndpoint}`);
            expect(ascResponse.status()).toBe(200);

            const ascUsers = await ascResponse.json();
            expect(Array.isArray(ascUsers)).toBeTruthy();
            expect(ascUsers.length).toBeGreaterThan(1);

            const ascIds: number[] = ascUsers.map((u: { id: number }) => u.id);
            for (let i = 0; i < ascIds.length - 1; i++) {
                expect(ascIds[i]).toBeLessThanOrEqual(ascIds[i + 1]);
            }
        });

        // Descending
        await test.step('Verify descending user sorting', async () => {
            const descEndpoint = Routes.GET_USERS_SORTED.replace('{order}', 'desc');
            const descResponse = await request.get(`${BASE_URL}${descEndpoint}`);
            expect(descResponse.status()).toBe(200);

            const descUsers = await descResponse.json();
            expect(Array.isArray(descUsers)).toBeTruthy();
            expect(descUsers.length).toBeGreaterThan(1);

            const descIds: number[] = descUsers.map((u: { id: number }) => u.id);
            for (let i = 0; i < descIds.length - 1; i++) {
                expect(descIds[i]).toBeGreaterThanOrEqual(descIds[i + 1]);
            }
        });

        console.log('✅ Ascending and descending user sorting validated successfully');
    });

    // ---------------------------------------------------------
    // POST - User CRUD - Create (Scenario 17)
    // ---------------------------------------------------------
    test('POST - Create User @master @regression @api', async ({ request }) => {
        const url = `${BASE_URL}${Routes.CREATE_USER}`;
        const newUser = RandomDataUtil.generateUserPayload();

        const response = await test.step('Send POST request to create a user', async () => {
            return await request.post(url, {
                data: newUser
            });
        });

        await test.step('Verify status code 201', async () => {
            expect(response.status()).toBe(201);
        });

        const createdUser = await response.json();

        await test.step('Verify generated user ID is returned', async () => {
            expect(createdUser.id).toBeTruthy();
        });

        console.log(`✅ User created successfully with ID: ${createdUser.id}`);
    });

    // ---------------------------------------------------------
    // PUT - User CRUD - Update (Scenario 18)
    // ---------------------------------------------------------
    test('PUT - Update User @master @regression @api', async ({ request }) => {
        const endpoint = Routes.UPDATE_USER.replace('{id}', String(USER_ID));
        const url = `${BASE_URL}${endpoint}`;
        const updatedPayload = RandomDataUtil.generateUserUpdatePayload();

        const response = await test.step(`Send PUT request to update user ${USER_ID}`, async () => {
            return await request.put(url, {
                data: updatedPayload
            });
        });

        await test.step('Verify status code 200', async () => {
            expect(response.status()).toBe(200);
        });

        const updatedUser = await response.json();

        await test.step('Verify response contains updated user values', async () => {
            expect(updatedUser.username).toBe(updatedPayload.username);
            expect(updatedUser.email).toBe(updatedPayload.email);
        });

        console.log(`✅ User ID ${USER_ID} updated successfully`);
    });

    // ---------------------------------------------------------
    // DELETE - User CRUD - Delete (Scenario 19)
    // ---------------------------------------------------------
    test('DELETE - Delete User @master @regression @api', async ({ request }) => {
        const endpoint = Routes.DELETE_USER.replace('{id}', String(USER_ID));
        const url = `${BASE_URL}${endpoint}`;

        const response = await test.step(`Send DELETE request for user ${USER_ID}`, async () => {
            return await request.delete(url);
        });

        await test.step('Verify status code 200', async () => {
            expect(response.status()).toBe(200);
        });

        await test.step('Validate response body contains deleted user data', async () => {
            const deletedUser = await response.json();
            expect(deletedUser.id).toBe(USER_ID);
        });

        console.log(`✅ User ID ${USER_ID} deleted successfully`);
    });
});
