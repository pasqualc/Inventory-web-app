import { AppPage } from './app.po';
import { browser, logging, element, By } from 'protractor';

describe('Inventory Manager App', () => {
	let page: AppPage;

	beforeEach(async () => {
		page = new AppPage();
		await page.navigateTo();
		await page.removeUserToken();
	});

	it('should allow for viewing/editing sheets when a user logs in', async () => {
		await page.navigateTo();
		await page.login('user', 'pw');
		await element(By.css('#view-books-button')).click();
		let viewBookButtons = await element.all(By.css('.view-book'));
		viewBookButtons[0].click();

		let viewSheetButtons = await element.all(By.css('.view-sheet'));
		let editSheetButtons = await element.all(By.css('.edit-sheet'));
		expect(viewSheetButtons.length).toBeTruthy();
		expect(editSheetButtons.length).toBeTruthy();
	});

	it('should allow for deleting sheets only when an admin logs in', async () => {
		await page.navigateTo();
		await page.login('user', 'pw');
		await element(By.css('#view-books-button')).click();
		let viewBookButtons = await element.all(By.css('.view-book'));
		viewBookButtons[0].click();
		let deleteSheetButtons = await element.all(By.css('.delete-sheet'));
		expect(deleteSheetButtons.length).toBeFalsy();

		await page.removeUserToken();

		await page.navigateTo();
		await page.login('admin', 'pw');
		await element(By.css('#view-books-button')).click();
		viewBookButtons = await element.all(By.css('.view-book'));
		viewBookButtons[0].click();
		deleteSheetButtons = await element.all(By.css('.delete-sheet'));
		expect(deleteSheetButtons.length).toBeTruthy();
	});
});
