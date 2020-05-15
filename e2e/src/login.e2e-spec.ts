import { AppPage } from './app.po';
import { browser, logging, element, By } from 'protractor';

describe('Inventory Manager App', () => {
	let page: AppPage;

	beforeEach(async () => {
		page = new AppPage();
		await page.navigateTo();
		await page.removeUserToken();
	});

	it('should display "login" on login screen header', async () => {
		await page.navigateTo();
		expect(element(By.css('app-root #card-header')).getText()).toEqual('Login');
	});

	it('should display a welcome message on login screen header when a user logs in with valid credentials', async () => {
		await page.navigateTo();

		expect(element(By.css('app-root #card-header')).getText()).toEqual('Login');

		await page.login('user', 'pw');
		let loginHeaderText = await element(By.css('app-root #card-header')).getText();
		let splitHeaderText = loginHeaderText.split(' ');
		expect(splitHeaderText[0]).toEqual('Welcome');
		expect(splitHeaderText.length).toBeGreaterThan(1);
	});

	it('should display "view books" button when user successfully logs in', async () => {
		await page.navigateTo();
		let button = await element.all(By.css('#view-books-button'));
		expect(button.length).toEqual(0);

		await page.login('user', 'pw');
		expect(element(By.css('#view-books-button'))).toBeTruthy();
	});

	it('should display "logout" button when user successfully logs in', async () => {
		await page.navigateTo();
		let button = await element.all(By.css('#logout-button'));
		expect(button.length).toEqual(0);

		await page.login('user', 'pw');
		expect(element(By.css('#logout-button'))).toBeTruthy();
	});

	it('should display "login" on login screen header after a user logs out', async () => {
		await page.navigateTo();
		await page.login('user', 'pw');
		expect(element(By.css('#logout-button'))).toBeTruthy();
		element(By.css('#logout-button')).click();
		expect(element(By.css('#logout-button'))).toBeTruthy();
		expect(element(By.css('app-root #card-header')).getText()).toEqual('Login');
	});
});
