import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';

dotenv.config({ override: true });

test.describe('Carts API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------
    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
    const CART_ID = Number(process.env.CART_ID ?? 1);
    const USER_ID = Number(process.env.USER_ID ?? 1);
    const LIMIT = Number(process.env.LIMIT ?? 3);
    const START_DATE = process.env.START_DATE || '2019-12-10';
    const END_DATE = process.env.END_DATE || '2020-10-10';

    // ---------------------------------------------------------
    // GET - All Carts (Scenario 20)
    // ---------------------------------------------------------
    test('GET - All Carts @master @sanity @api', async ({ request }) => {
        const url = `${BASE_URL}${Routes.GET_ALL_CARTS}`;

        const response = await test.step('Send GET request for all carts', async () => {
            return await request.get(url);
        });

        await test.step('Verify status code 200', async () => {
            expect(response.status()).toBe(200);
        });

        const carts = await response.json();

        await test.step('Verify response body is non-empty array', async () => {
            expect(Array.isArray(carts)).toBeTruthy();
            expect(carts.length).toBeGreaterThan(0);
        });

        await test.step('Validate cart structure', async () => {
            const firstCart = carts[0];
            expect(firstCart).toHaveProperty('id');
            expect(firstCart).toHaveProperty('userId');
            expect(firstCart).toHaveProperty('date');
            expect(firstCart).toHaveProperty('products');
            expect(Array.isArray(firstCart.products)).toBeTruthy();
        });

        console.log('✅ All Carts retrieved and validated successfully');
    });

    // ---------------------------------------------------------
    // GET - Cart by ID (Scenario 21)
    // ---------------------------------------------------------
    test('GET - Cart by ID @master @sanity @api', async ({ request }) => {
        const endpoint = Routes.GET_CART_BY_ID.replace('{id}', String(CART_ID));
        const url = `${BASE_URL}${endpoint}`;

        const response = await test.step(`Send GET request for cart ID ${CART_ID}`, async () => {
            return await request.get(url);
        });

        await test.step('Verify status code 200', async () => {
            expect(response.status()).toBe(200);
        });

        const cart = await response.json();

        await test.step('Verify returned cart ID matches requested ID', async () => {
            expect(cart.id).toBe(CART_ID);
        });

        await test.step('Validate cart properties', async () => {
            expect(cart).toHaveProperty('id');
            expect(cart).toHaveProperty('userId');
            expect(cart).toHaveProperty('date');
            expect(cart).toHaveProperty('products');
        });

        console.log(`✅ Cart ID ${CART_ID} retrieved and validated successfully`);
    });

    // ---------------------------------------------------------
    // GET - Carts by Date Range (Scenario 22)
    // ---------------------------------------------------------
    test('GET - Carts by Date Range @master @regression @api', async ({ request }) => {
        const endpoint = Routes.GET_CARTS_BY_DATE_RANGE
            .replace('{startdate}', START_DATE)
            .replace('{enddate}', END_DATE);
        const url = `${BASE_URL}${endpoint}`;

        const response = await test.step(`Send GET request for date range ${START_DATE} to ${END_DATE}`, async () => {
            return await request.get(url);
        });

        await test.step('Verify status code 200', async () => {
            expect(response.status()).toBe(200);
        });

        const carts = await response.json();

        await test.step('Verify response is array and records fall within date range', async () => {
            expect(Array.isArray(carts)).toBeTruthy();
            const startTimestamp = new Date(START_DATE).getTime();
            const endTimestamp = new Date(END_DATE).getTime();

            carts.forEach((cart: { date: string }) => {
                const cartTimestamp = new Date(cart.date).getTime();
                expect(cartTimestamp).toBeGreaterThanOrEqual(startTimestamp);
                expect(cartTimestamp).toBeLessThanOrEqual(endTimestamp);
            });
        });

        console.log(`✅ Carts within date range ${START_DATE} - ${END_DATE} validated successfully`);
    });

    // ---------------------------------------------------------
    // GET - User Cart (Scenario 23)
    // ---------------------------------------------------------
    test('GET - User Cart @master @regression @api', async ({ request }) => {
        const targetUserId = 2;
        const endpoint = Routes.GET_USER_CART.replace('{userId}', String(targetUserId));
        const url = `${BASE_URL}${endpoint}`;

        const response = await test.step(`Send GET request for carts of user ID ${targetUserId}`, async () => {
            return await request.get(url);
        });

        await test.step('Verify status code 200', async () => {
            expect(response.status()).toBe(200);
        });

        const carts = await response.json();

        await test.step(`Verify response is array and carts belong to user ${targetUserId}`, async () => {
            expect(Array.isArray(carts)).toBeTruthy();
            carts.forEach((cart: { userId: number }) => {
                expect(cart.userId).toBe(targetUserId);
            });
        });

        console.log(`✅ Carts for user ID ${targetUserId} validated successfully`);
    });

    // ---------------------------------------------------------
    // GET - Carts with Limit (Scenario 24)
    // ---------------------------------------------------------
    test('GET - Carts with Limit @master @regression @api', async ({ request }) => {
        const endpoint = Routes.GET_CARTS_WITH_LIMIT.replace('{limit}', String(LIMIT));
        const url = `${BASE_URL}${endpoint}`;

        const response = await test.step(`Send GET request with cart limit ${LIMIT}`, async () => {
            return await request.get(url);
        });

        await test.step('Verify status code 200', async () => {
            expect(response.status()).toBe(200);
        });

        const carts = await response.json();

        await test.step(`Verify response is array and count matches ${LIMIT}`, async () => {
            expect(Array.isArray(carts)).toBeTruthy();
            expect(carts.length).toBe(LIMIT);
        });

        console.log(`✅ Carts limited to ${LIMIT} validated successfully`);
    });

    // ---------------------------------------------------------
    // GET - Sort Carts (Scenario 25)
    // ---------------------------------------------------------
    test('GET - Sort Carts Ascending and Descending @master @regression @api', async ({ request }) => {
        // Ascending
        await test.step('Verify ascending cart sorting', async () => {
            const ascEndpoint = Routes.GET_CARTS_SORTED.replace('{order}', 'asc');
            const ascResponse = await request.get(`${BASE_URL}${ascEndpoint}`);
            expect(ascResponse.status()).toBe(200);

            const ascCarts = await ascResponse.json();
            expect(Array.isArray(ascCarts)).toBeTruthy();
            expect(ascCarts.length).toBeGreaterThan(1);

            const ascIds: number[] = ascCarts.map((c: { id: number }) => c.id);
            for (let i = 0; i < ascIds.length - 1; i++) {
                expect(ascIds[i]).toBeLessThanOrEqual(ascIds[i + 1]);
            }
        });

        // Descending
        await test.step('Verify descending cart sorting', async () => {
            const descEndpoint = Routes.GET_CARTS_SORTED.replace('{order}', 'desc');
            const descResponse = await request.get(`${BASE_URL}${descEndpoint}`);
            expect(descResponse.status()).toBe(200);

            const descCarts = await descResponse.json();
            expect(Array.isArray(descCarts)).toBeTruthy();
            expect(descCarts.length).toBeGreaterThan(1);

            const descIds: number[] = descCarts.map((c: { id: number }) => c.id);
            for (let i = 0; i < descIds.length - 1; i++) {
                expect(descIds[i]).toBeGreaterThanOrEqual(descIds[i + 1]);
            }
        });

        console.log('✅ Ascending and descending cart sorting validated successfully');
    });

    // ---------------------------------------------------------
    // POST - Cart CRUD - Create (Scenario 26)
    // ---------------------------------------------------------
    test('POST - Create Cart @master @regression @api', async ({ request }) => {
        const url = `${BASE_URL}${Routes.CREATE_CART}`;
        const newCartPayload = RandomDataUtil.generateCartPayload(USER_ID);

        const response = await test.step('Send POST request to create a cart', async () => {
            return await request.post(url, {
                data: newCartPayload
            });
        });

        await test.step('Verify status code 201', async () => {
            expect(response.status()).toBe(201);
        });

        const createdCart = await response.json();

        await test.step('Verify cart ID is returned', async () => {
            expect(createdCart.id).toBeTruthy();
        });

        await test.step('Verify response contains expected user ID and products', async () => {
            expect(createdCart.userId).toBe(newCartPayload.userId);
            expect(createdCart.products.length).toBe(newCartPayload.products.length);
        });

        console.log(`✅ Cart created successfully with ID: ${createdCart.id}`);
    });

    // ---------------------------------------------------------
    // PUT - Cart CRUD - Update (Scenario 27)
    // ---------------------------------------------------------
    test('PUT - Update Cart @master @regression @api', async ({ request }) => {
        const endpoint = Routes.UPDATE_CART.replace('{id}', String(CART_ID));
        const url = `${BASE_URL}${endpoint}`;
        const updatedCartPayload = {
            userId: USER_ID,
            date: '2020-01-15',
            products: [
                {
                    productId: 1,
                    quantity: 10
                }
            ]
        };

        const response = await test.step(`Send PUT request to update cart ${CART_ID}`, async () => {
            return await request.put(url, {
                data: updatedCartPayload
            });
        });

        await test.step('Verify status code 200', async () => {
            expect(response.status()).toBe(200);
        });

        const updatedCart = await response.json();

        await test.step('Verify updated quantity is reflected in response', async () => {
            expect(updatedCart.id).toBe(CART_ID);
            expect(updatedCart.products[0].quantity).toBe(10);
        });

        console.log(`✅ Cart ID ${CART_ID} updated successfully`);
    });

    // ---------------------------------------------------------
    // DELETE - Cart CRUD - Delete (Scenario 28)
    // ---------------------------------------------------------
    test('DELETE - Delete Cart @master @regression @api', async ({ request }) => {
        const endpoint = Routes.DELETE_CART.replace('{id}', String(CART_ID));
        const url = `${BASE_URL}${endpoint}`;

        const response = await test.step(`Send DELETE request for cart ${CART_ID}`, async () => {
            return await request.delete(url);
        });

        await test.step('Verify status code 200', async () => {
            expect(response.status()).toBe(200);
        });

        await test.step('Validate response body contains deleted cart data', async () => {
            const deletedCart = await response.json();
            expect(deletedCart.id).toBe(CART_ID);
        });

        console.log(`✅ Cart ID ${CART_ID} deleted successfully`);
    });
});
