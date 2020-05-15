import { browser, By, element } from 'protractor';

export class AppPage {
	navigateTo(url?: string) {
		if (url) return browser.get(browser.baseUrl + 'url') as Promise<any>;
		else return browser.get(browser.baseUrl) as Promise<any>;
	}

	removeUserToken() {
		return browser.executeScript("sessionStorage.removeItem('user@p3project');");
	}

	setUserToken() {
		return browser.executeScript("sessionStorage.setItem('user@p3project', 'user');");
	}

	setAdminToken() {
		return browser.executeScript("sessionStorage.setItem('user@p3project', 'admin');");
	}

	async login(username: string, password: string) {
		await element(By.css('#username')).sendKeys(username);
		await element(By.css('#password')).sendKeys(password);
		await element(By.css('#login-button')).click();
		return Promise.resolve();
	}
}
