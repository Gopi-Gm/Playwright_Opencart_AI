/**
 * Test Case: Product Search Flow
 *
 * Tags: @master @sanity @regression @web
 *
 * Steps:
 * 1) Navigate to the application
 * 2) Enter a known product name in the search field
 * 3) Submit the search
 * 4) Verify search results page is displayed with results
 * 5) Verify the expected product appears in results
 * 6) Verify product name matches the search criteria
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { Helper } from '../../utils/helper';

test('Product Search Flow @master @sanity @regression @web', async ({
    homePage,
    searchResultsPage,
}) => {
    const { productName } = Helper.getProductDetails();

    await test.step('1) Navigate to the application', async () => {
        const isHomePage = await homePage.isHomePageExists();
        expect(isHomePage).toBeTruthy();
    });

    await test.step('2) Search for the known product', async () => {
        await homePage.searchProduct(productName);
    });

    await test.step('3) Verify search results page is displayed with results', async () => {
        const hasResults = await searchResultsPage.hasResults();
        expect(hasResults).toBeTruthy();
    });

    await test.step('4) Verify the expected product appears in results', async () => {
        const titles = await searchResultsPage.getAllProductTitles();
        const found = titles.some((title) => title.toLowerCase().includes(productName.toLowerCase()));
        expect(found).toBeTruthy();
    });

    console.log('✅ ✔️ Product Search Flow completed successfully!');
});
