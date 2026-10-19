import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import Ajv from 'ajv';
import { Routes } from '../../api/endpoints/routes';
import { DataProvider } from '../../utils/DataReader';

dotenv.config({ override: true });

test.describe('JSON Schema Validation API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------
    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
    const PRODUCT_ID = Number(process.env.PRODUCT_ID ?? 1);
    const USER_ID = Number(process.env.USER_ID ?? 1);
    const CART_ID = Number(process.env.CART_ID ?? 1);
    const ajv = new Ajv({ allErrors: true });

    // ---------------------------------------------------------
    // Schema - Product Response Schema (Scenario 29)
    // ---------------------------------------------------------
    test('SCHEMA - Product Response Schema @master @regression @api @schema', async ({ request }) => {
        const endpoint = Routes.GET_PRODUCT_BY_ID.replace('{id}', String(PRODUCT_ID));
        const url = `${BASE_URL}${endpoint}`;

        const response = await test.step(`Retrieve product with ID ${PRODUCT_ID}`, async () => {
            return await request.get(url);
        });

        await test.step('Verify status code 200', async () => {
            expect(response.status()).toBe(200);
        });

        const product = await response.json();

        await test.step('Validate product response against product_api_schema.json', async () => {
            const schemaPath = path.resolve(__dirname, '../../api/schemas/product_api_schema.json');
            const productSchema = DataProvider.readJson(schemaPath);
            const validate = ajv.compile(productSchema);
            const isValid = validate(product);

            if (!isValid) {
                console.error('Product schema validation errors:', validate.errors);
            }
            expect(isValid, `Product response did not match schema: ${JSON.stringify(validate.errors)}`).toBeTruthy();
        });

        console.log('✅ Product Response Schema validated successfully');
    });

    // ---------------------------------------------------------
    // Schema - User Response Schema (Scenario 30)
    // ---------------------------------------------------------
    test('SCHEMA - User Response Schema @master @regression @api @schema', async ({ request }) => {
        const endpoint = Routes.GET_USER_BY_ID.replace('{id}', String(USER_ID));
        const url = `${BASE_URL}${endpoint}`;

        const response = await test.step(`Retrieve user with ID ${USER_ID}`, async () => {
            return await request.get(url);
        });

        await test.step('Verify status code 200', async () => {
            expect(response.status()).toBe(200);
        });

        const user = await response.json();

        await test.step('Validate user response against user_api_schema.json', async () => {
            const schemaPath = path.resolve(__dirname, '../../api/schemas/user_api_schema.json');
            const userSchema = DataProvider.readJson(schemaPath);
            const validate = ajv.compile(userSchema);
            const isValid = validate(user);

            if (!isValid) {
                console.error('User schema validation errors:', validate.errors);
            }
            expect(isValid, `User response did not match schema: ${JSON.stringify(validate.errors)}`).toBeTruthy();
        });

        console.log('✅ User Response Schema validated successfully');
    });

    // ---------------------------------------------------------
    // Schema - Cart Response Schema (Scenario 31)
    // ---------------------------------------------------------
    test('SCHEMA - Cart Response Schema @master @regression @api @schema', async ({ request }) => {
        const endpoint = Routes.GET_CART_BY_ID.replace('{id}', String(CART_ID));
        const url = `${BASE_URL}${endpoint}`;

        const response = await test.step(`Retrieve cart with ID ${CART_ID}`, async () => {
            return await request.get(url);
        });

        await test.step('Verify status code 200', async () => {
            expect(response.status()).toBe(200);
        });

        const cart = await response.json();

        await test.step('Validate cart response against cart_api_schema.json', async () => {
            const schemaPath = path.resolve(__dirname, '../../api/schemas/cart_api_schema.json');
            const cartSchema = DataProvider.readJson(schemaPath);
            const validate = ajv.compile(cartSchema);
            const isValid = validate(cart);

            if (!isValid) {
                console.error('Cart schema validation errors:', validate.errors);
            }
            expect(isValid, `Cart response did not match schema: ${JSON.stringify(validate.errors)}`).toBeTruthy();
        });

        console.log('✅ Cart Response Schema validated successfully');
    });
});
