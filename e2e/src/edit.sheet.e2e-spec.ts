import { AppPage } from './app.po';
import { browser, logging, element, By } from 'protractor';

describe('Inventory Manager App', () => {
	let page: AppPage;

	beforeEach(async () => {
		page = new AppPage();
		await page.navigateTo();
		await page.removeUserToken();
	});

	it('should show a message on sheet edit page stating admin permissions are required to manage sheet heading fields, when a user is logged in', async () => {
		await page.navigateTo();
		await page.login('user', 'pw');
		await element(By.css('#view-books-button')).click();
		let viewBookButtons = await element.all(By.css('.view-book'));
		viewBookButtons[0].click();
		let editSheetButtons = await element.all(By.css('.edit-sheet'));
		editSheetButtons[0].click();
		expect(element(By.css('#no-admin'))).toBeTruthy();
	});

	it('should allow a user to add a field, when an admin is logged in', async () => {
		await page.navigateTo();
		await page.login('user', 'pw');
		await element(By.css('#view-books-button')).click();
		let viewBookButtons = await element.all(By.css('.view-book'));
		viewBookButtons[0].click();
		let editSheetButtons = await element.all(By.css('.edit-sheet'));
		editSheetButtons[0].click();
		expect(element(By.css('#add-field-button'))).toBeTruthy();
	});

	it('should list individual heading fields, when an admin is logged in', async () => {
		await page.navigateTo();
		await page.login('user', 'pw');
		await element(By.css('#view-books-button')).click();
		let viewBookButtons = await element.all(By.css('.view-book'));
		viewBookButtons[0].click();
		let editSheetButtons = await element.all(By.css('.edit-sheet'));
		editSheetButtons[0].click();
		expect(element(By.css('#heading-fields'))).toBeTruthy();
	});
});
