import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';

dotenv.config({ override: true });

test.describe('Products API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------
    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
    const PRODUCT_ID = Number(process.env.PRODUCT_ID ?? 1);
    const LIMIT = Number(process.env.LIMIT ?? 3);

    // ---------------------------------------------------------
    // GET - All Products (Scenario 3)
    // ---------------------------------------------------------
    test('GET - All Products @master @sanity @api', async ({ request }) => {
        const url = `${BASE_URL}${Routes.GET_ALL_PRODUCTS}`;

        const response = await test.step('Send GET request to retrieve all products', async () => {
            return await request.get(url);
        });

        await test.step('Verify status code 200', async () => {
            expect(response.status()).toBe(200);
        });

        const products = await response.json();

        await test.step('Verify response body is a non-empty array', async () => {
            expect(Array.isArray(products)).toBeTruthy();
            expect(products.length).toBeGreaterThan(0);
        });

        await test.step('Validate important fields for products', async () => {
            const firstProduct = products[0];
            expect(firstProduct).toHaveProperty('id');
            expect(firstProduct).toHaveProperty('title');
            expect(firstProduct).toHaveProperty('price');
            expect(firstProduct).toHaveProperty('category');
            expect(firstProduct).toHaveProperty('image');
        });

        console.log('✅ All Products retrieved and validated successfully');
    });

    // ---------------------------------------------------------
    // GET - Product by ID (Scenario 4)
    // ---------------------------------------------------------
    test('GET - Product by ID @master @sanity @api', async ({ request }) => {
        const endpoint = Routes.GET_PRODUCT_BY_ID.replace('{id}', String(PRODUCT_ID));
        const url = `${BASE_URL}${endpoint}`;

        const response = await test.step(`Send GET request for product ID ${PRODUCT_ID}`, async () => {
            return await request.get(url);
        });

        await test.step('Verify status code 200', async () => {
            expect(response.status()).toBe(200);
        });

        const product = await response.json();

        await test.step('Verify returned ID matches requested ID', async () => {
            expect(product.id).toBe(PRODUCT_ID);
        });

        await test.step('Validate important product properties', async () => {
            expect(product).toHaveProperty('id');
            expect(product).toHaveProperty('title');
            expect(product).toHaveProperty('price');
            expect(product).toHaveProperty('category');
            expect(product).toHaveProperty('description');
            expect(product).toHaveProperty('image');
        });

        console.log(`✅ Product ID ${PRODUCT_ID} retrieved and validated successfully`);
    });

    // ---------------------------------------------------------
    // GET - Products with Limit (Scenario 5)
    // ---------------------------------------------------------
    test('GET - Products with Limit @master @regression @api', async ({ request }) => {
        const endpoint = Routes.GET_PRODUCTS_WITH_LIMIT.replace('{limit}', String(LIMIT));
        const url = `${BASE_URL}${endpoint}`;

        const response = await test.step(`Send GET request with limit ${LIMIT}`, async () => {
            return await request.get(url);
        });

        await test.step('Verify status code 200', async () => {
            expect(response.status()).toBe(200);
        });

        const products = await response.json();

        await test.step(`Verify response is array and matches limit ${LIMIT}`, async () => {
            expect(Array.isArray(products)).toBeTruthy();
            expect(products.length).toBe(LIMIT);
        });

        console.log(`✅ Products limited to ${LIMIT} validated successfully`);
    });

    // ---------------------------------------------------------
    // GET - Sort Products Ascending (Scenario 6)
    // ---------------------------------------------------------
    test('GET - Sort Products Ascending @master @regression @api', async ({ request }) => {
        const endpoint = Routes.GET_PRODUCTS_SORTED.replace('{order}', 'asc');
        const url = `${BASE_URL}${endpoint}`;

        const response = await test.step('Send GET request for ascending products', async () => {
            return await request.get(url);
        });

        await test.step('Verify status code 200', async () => {
            expect(response.status()).toBe(200);
        });

        const products = await response.json();

        await test.step('Extract product IDs and verify ascending order', async () => {
            expect(Array.isArray(products)).toBeTruthy();
            expect(products.length).toBeGreaterThan(1);
            const ids: number[] = products.map((p: { id: number }) => p.id);
            for (let i = 0; i < ids.length - 1; i++) {
                expect(ids[i]).toBeLessThanOrEqual(ids[i + 1]);
            }
        });

        console.log('✅ Ascending products sorting validated successfully');
    });

    // ---------------------------------------------------------
    // GET - Sort Products Descending (Scenario 7)
    // ---------------------------------------------------------
    test('GET - Sort Products Descending @master @regression @api', async ({ request }) => {
        const endpoint = Routes.GET_PRODUCTS_SORTED.replace('{order}', 'desc');
        const url = `${BASE_URL}${endpoint}`;

        const response = await test.step('Send GET request for descending products', async () => {
            return await request.get(url);
        });

        await test.step('Verify status code 200', async () => {
            expect(response.status()).toBe(200);
        });

        const products = await response.json();

        await test.step('Extract product IDs and verify descending order', async () => {
            expect(Array.isArray(products)).toBeTruthy();
            expect(products.length).toBeGreaterThan(1);
            const ids: number[] = products.map((p: { id: number }) => p.id);
            for (let i = 0; i < ids.length - 1; i++) {
                expect(ids[i]).toBeGreaterThanOrEqual(ids[i + 1]);
            }
        });

        console.log('✅ Descending products sorting validated successfully');
    });

    // ---------------------------------------------------------
    // GET - All Product Categories (Scenario 8)
    // ---------------------------------------------------------
    test('GET - All Product Categories @master @sanity @api', async ({ request }) => {
        const url = `${BASE_URL}${Routes.GET_ALL_CATEGORIES}`;

        const response = await test.step('Send GET request for all categories', async () => {
            return await request.get(url);
        });

        await test.step('Verify status code 200', async () => {
            expect(response.status()).toBe(200);
        });

        const categories = await response.json();

        await test.step('Verify response is non-empty array of categories', async () => {
            expect(Array.isArray(categories)).toBeTruthy();
            expect(categories.length).toBeGreaterThan(0);
            categories.forEach((cat: unknown) => {
                expect(typeof cat).toBe('string');
            });
        });

        console.log('✅ Product categories retrieved and validated successfully');
    });

    // ---------------------------------------------------------
    // GET - Products by Category (Scenario 9)
    // ---------------------------------------------------------
    test('GET - Products by Category @master @regression @api', async ({ request }) => {
        const category = 'electronics';
        const endpoint = Routes.GET_PRODUCTS_BY_CATEGORY.replace('{category}', category);
        const url = `${BASE_URL}${endpoint}`;

        const response = await test.step(`Send GET request for category: ${category}`, async () => {
            return await request.get(url);
        });

        await test.step('Verify status code 200', async () => {
            expect(response.status()).toBe(200);
        });

        const products = await response.json();

        await test.step(`Verify response is array and all items belong to ${category}`, async () => {
            expect(Array.isArray(products)).toBeTruthy();
            expect(products.length).toBeGreaterThan(0);
            products.forEach((product: { category: string }) => {
                expect(product.category.toLowerCase()).toBe(category.toLowerCase());
            });
        });

        console.log(`✅ Products by category "${category}" validated successfully`);
    });

    // ---------------------------------------------------------
    // POST - Product CRUD - Create (Scenario 10)
    // ---------------------------------------------------------
    test('POST - Create Product @master @regression @api', async ({ request }) => {
        const url = `${BASE_URL}${Routes.CREATE_PRODUCT}`;
        const newProduct = RandomDataUtil.generateProductPayload();

        const response = await test.step('Send POST request to create a product', async () => {
            return await request.post(url, {
                data: newProduct
            });
        });

        await test.step('Verify status code 201', async () => {
            expect(response.status()).toBe(201);
        });

        const createdProduct = await response.json();

        await test.step('Verify generated product ID is returned', async () => {
            expect(createdProduct.id).toBeTruthy();
        });

        await test.step('Verify submitted product information is present in response', async () => {
            expect(createdProduct.title).toBe(newProduct.title);
            expect(createdProduct.price).toBe(newProduct.price);
            expect(createdProduct.category).toBe(newProduct.category);
            expect(createdProduct.description).toBe(newProduct.description);
        });

        console.log(`✅ Product created successfully with ID: ${createdProduct.id}`);
    });

    // ---------------------------------------------------------
    // PUT - Product CRUD - Update (Scenario 11)
    // ---------------------------------------------------------
    test('PUT - Update Product @master @regression @api', async ({ request }) => {
        const endpoint = Routes.UPDATE_PRODUCT.replace('{id}', String(PRODUCT_ID));
        const url = `${BASE_URL}${endpoint}`;
        const updatedPayload = RandomDataUtil.generateUpdatedProductPayload();

        const response = await test.step(`Send PUT request to update product ${PRODUCT_ID}`, async () => {
            return await request.put(url, {
                data: updatedPayload
            });
        });

        await test.step('Verify status code 200', async () => {
            expect(response.status()).toBe(200);
        });

        const updatedProduct = await response.json();

        await test.step('Verify response contains updated values and matching ID', async () => {
            expect(updatedProduct.id).toBe(PRODUCT_ID);
            expect(updatedProduct.title).toBe(updatedPayload.title);
            expect(updatedProduct.price).toBe(updatedPayload.price);
            expect(updatedProduct.category).toBe(updatedPayload.category);
        });

        console.log(`✅ Product ID ${PRODUCT_ID} updated successfully`);
    });

    // ---------------------------------------------------------
    // DELETE - Product CRUD - Delete (Scenario 12)
    // ---------------------------------------------------------
    test('DELETE - Delete Product @master @regression @api', async ({ request }) => {
        const endpoint = Routes.DELETE_PRODUCT.replace('{id}', String(PRODUCT_ID));
        const url = `${BASE_URL}${endpoint}`;

        const response = await test.step(`Send DELETE request for product ${PRODUCT_ID}`, async () => {
            return await request.delete(url);
        });

        await test.step('Verify status code 200', async () => {
            expect(response.status()).toBe(200);
        });

        await test.step('Validate response body contains deleted product data', async () => {
            const deletedProduct = await response.json();
            expect(deletedProduct.id).toBe(PRODUCT_ID);
        });

        console.log(`✅ Product ID ${PRODUCT_ID} deleted successfully`);
    });
});
