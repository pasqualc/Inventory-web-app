import { AppPage } from './app.po';
import { browser, logging, element, By } from 'protractor';

describe('Inventory Manager App', () => {
	let page: AppPage;

	beforeEach(async () => {
		page = new AppPage();
		await page.navigateTo();
		await page.removeUserToken();
	});

	it('should allow for viewing books when a user logs in', async () => {
		await page.navigateTo();
		await page.login('user', 'pw');
		await element(By.css('#view-books-button')).click();

		let viewBookButtons = await element.all(By.css('.view-book'));
		expect(viewBookButtons.length).toBeTruthy();
	});

	it('should allow for editing/deleting books only when an admin logs in', async () => {
		await page.navigateTo();
		await page.login('user', 'pw');
		await element(By.css('#view-books-button')).click();
		let editBookButtons = await element.all(By.css('.edit-book'));
		let deleteBookButtons = await element.all(By.css('.edit-book'));
		expect(editBookButtons.length).toBeFalsy();
		expect(deleteBookButtons.length).toBeFalsy();

		await page.removeUserToken();

		await page.navigateTo();
		await page.login('admin', 'pw');
		await element(By.css('#view-books-button')).click();
		editBookButtons = await element.all(By.css('.edit-book'));
		deleteBookButtons = await element.all(By.css('.edit-book'));
		expect(editBookButtons.length).toBeTruthy();
		expect(deleteBookButtons.length).toBeTruthy();
	});

	it('should be required to login as an admin to create a new book', async () => {
		await page.navigateTo();
		await page.login('user', 'pw');
		expect(element(By.css('#book-list-component'))).toBeTruthy();
		let createBookButton = await element.all(By.css('#create-book'));
		expect(createBookButton.length).toEqual(0);

		await page.removeUserToken();
		await page.navigateTo();
		await page.login('admin', 'pw');
		expect(element(By.css('#view-books-button'))).toBeTruthy();
		await element(By.css('#view-books-button')).click();
		expect(element(By.css('#book-list-component'))).toBeTruthy();
		expect(await element.all(By.css('#create-book'))).toBeTruthy();
	});
});
