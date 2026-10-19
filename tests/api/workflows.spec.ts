import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';

dotenv.config({ override: true });

test.describe('End-to-End API Workflows', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------
    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
    const USER_ID = Number(process.env.USER_ID ?? 1);

    // ---------------------------------------------------------
    // Workflow - Product CRUD Workflow (Scenario 32)
    // ---------------------------------------------------------
    test('WORKFLOW - Product CRUD Workflow (Create -> Update -> Delete) @master @regression @api @end-to-end', async ({ request }) => {
        let createdProductId: number;
        const newProductPayload = RandomDataUtil.generateProductPayload();

        // 1. Create Product
        await test.step('1) Create a product using CREATE_PRODUCT', async () => {
            const createUrl = `${BASE_URL}${Routes.CREATE_PRODUCT}`;
            const createResponse = await request.post(createUrl, {
                data: newProductPayload
            });

            expect(createResponse.status()).toBe(201);
            const createdData = await createResponse.json();
            expect(createdData.id).toBeTruthy();
            createdProductId = createdData.id;
            console.log(`Created product with ID: ${createdProductId}`);
        });

        // 2. Update Product using the created ID
        await test.step('2) Update the product using UPDATE_PRODUCT with captured ID', async () => {
            const updateEndpoint = Routes.UPDATE_PRODUCT.replace('{id}', String(createdProductId));
            const updateUrl = `${BASE_URL}${updateEndpoint}`;
            const updatedPayload = {
                ...newProductPayload,
                title: `Updated - ${newProductPayload.title}`,
                price: newProductPayload.price + 10
            };

            const updateResponse = await request.put(updateUrl, {
                data: updatedPayload
            });

            expect(updateResponse.status()).toBe(200);
            const updatedData = await updateResponse.json();
            expect(updatedData.title).toBe(updatedPayload.title);
            expect(updatedData.price).toBe(updatedPayload.price);
        });

        // 3. Delete Product using the created ID
        await test.step('3) Delete the product using DELETE_PRODUCT with captured ID', async () => {
            const deleteEndpoint = Routes.DELETE_PRODUCT.replace('{id}', String(createdProductId));
            const deleteUrl = `${BASE_URL}${deleteEndpoint}`;

            const deleteResponse = await request.delete(deleteUrl);
            expect(deleteResponse.status()).toBe(200);
        });

        console.log(`✅ Product CRUD Workflow completed successfully for ID ${createdProductId}`);
    });

    // ---------------------------------------------------------
    // Workflow - User CRUD Workflow (Scenario 33)
    // ---------------------------------------------------------
    test('WORKFLOW - User CRUD Workflow (Create -> Update -> Delete) @master @regression @api @end-to-end', async ({ request }) => {
        let createdUserId: number;
        const newUserPayload = RandomDataUtil.generateUserPayload();

        // 1. Create User
        await test.step('1) Create a user using CREATE_USER', async () => {
            const createUrl = `${BASE_URL}${Routes.CREATE_USER}`;
            const createResponse = await request.post(createUrl, {
                data: newUserPayload
            });

            expect(createResponse.status()).toBe(201);
            const createdData = await createResponse.json();
            expect(createdData.id).toBeTruthy();
            createdUserId = createdData.id;
            console.log(`Created user with ID: ${createdUserId}`);
        });

        // 2. Update User using the created ID
        await test.step('2) Update the user using UPDATE_USER with captured ID', async () => {
            const updateEndpoint = Routes.UPDATE_USER.replace('{id}', String(createdUserId));
            const updateUrl = `${BASE_URL}${updateEndpoint}`;
            const updatedPayload = {
                ...newUserPayload,
                username: `workflow-${newUserPayload.username}`
            };

            const updateResponse = await request.put(updateUrl, {
                data: updatedPayload
            });

            expect(updateResponse.status()).toBe(200);
            const updatedData = await updateResponse.json();
            expect(updatedData.username).toBe(updatedPayload.username);
        });

        // 3. Delete User using the created ID
        await test.step('3) Delete the user using DELETE_USER with captured ID', async () => {
            const deleteEndpoint = Routes.DELETE_USER.replace('{id}', String(createdUserId));
            const deleteUrl = `${BASE_URL}${deleteEndpoint}`;

            const deleteResponse = await request.delete(deleteUrl);
            expect(deleteResponse.status()).toBe(200);
        });

        console.log(`✅ User CRUD Workflow completed successfully for ID ${createdUserId}`);
    });

    // ---------------------------------------------------------
    // Workflow - Cart CRUD Workflow (Scenario 34)
    // ---------------------------------------------------------
    test('WORKFLOW - Cart CRUD Workflow (Create -> Update -> Delete) @master @regression @api @end-to-end', async ({ request }) => {
        let createdCartId: number;
        const newCartPayload = RandomDataUtil.generateCartPayload(USER_ID);

        // 1. Create Cart
        await test.step('1) Create a cart using CREATE_CART', async () => {
            const createUrl = `${BASE_URL}${Routes.CREATE_CART}`;
            const createResponse = await request.post(createUrl, {
                data: newCartPayload
            });

            expect(createResponse.status()).toBe(201);
            const createdData = await createResponse.json();
            expect(createdData.id).toBeTruthy();
            expect(createdData.userId).toBe(newCartPayload.userId);
            expect(createdData.products.length).toBe(newCartPayload.products.length);
            createdCartId = createdData.id;
            console.log(`Created cart with ID: ${createdCartId}`);
        });

        // 2. Update Cart using the created ID
        await test.step('2) Update the cart using UPDATE_CART with captured ID', async () => {
            const updateEndpoint = Routes.UPDATE_CART.replace('{id}', String(createdCartId));
            const updateUrl = `${BASE_URL}${updateEndpoint}`;
            const updatedQuantity = 7;
            const updatedPayload = {
                userId: USER_ID,
                date: '2020-03-01',
                products: [
                    {
                        productId: 1,
                        quantity: updatedQuantity
                    }
                ]
            };

            const updateResponse = await request.put(updateUrl, {
                data: updatedPayload
            });

            expect(updateResponse.status()).toBe(200);
            const updatedData = await updateResponse.json();
            expect(updatedData.products[0].quantity).toBe(updatedQuantity);
        });

        // 3. Delete Cart using the created ID
        await test.step('3) Delete the cart using DELETE_CART with captured ID', async () => {
            const deleteEndpoint = Routes.DELETE_CART.replace('{id}', String(createdCartId));
            const deleteUrl = `${BASE_URL}${deleteEndpoint}`;

            const deleteResponse = await request.delete(deleteUrl);
            expect(deleteResponse.status()).toBe(200);
        });

        console.log(`✅ Cart CRUD Workflow completed successfully for ID ${createdCartId}`);
    });
});
