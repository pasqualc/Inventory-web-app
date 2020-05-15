import { AppPage } from './app.po';
import { browser, logging, element, By } from 'protractor';

describe('Inventory Manager App', () => {
	let page: AppPage;

	beforeEach(async () => {
		page = new AppPage();
		await page.navigateTo();
		await page.removeUserToken();
	});

	it('should display "manage users" button when only when an admin successfully logs in', async () => {
		await page.navigateTo();
		let button = await element.all(By.css('#manage-users-button'));
		expect(button.length).toEqual(0);
		await page.login('user', 'pw');
		button = await element.all(By.css('#manage-users-button'));
		expect(button.length).toEqual(0);

		await page.removeUserToken();
		await page.navigateTo();
		await page.login('admin', 'pw');
		expect(element(By.css('#manage-users-button'))).toBeTruthy();
	});
});
