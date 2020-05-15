import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from '../services/user.service';
import { routes } from '../app-routing.module';
import { MatSortModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { BooksViewComponent } from '../books-view/books-view.component';
import { SheetEditComponent } from '../sheet-edit/sheet-edit.component';
import { BooksListComponent } from '../books-list/books-list.component';
import { SheetsViewComponent } from '../sheets-view/sheets-view.component';
import { BookEditComponent } from '../book-edit/book-edit.component';
import { ManageUsersComponent } from '../manage-users/manage-users.component';
import { BackendTestComponent } from '../backend-test/backend-test.component';

let routingComponents = [
	LoginComponent,
	SheetEditComponent,
	BooksListComponent,
	SheetsViewComponent,
	BookEditComponent,
	ManageUsersComponent,
	BooksViewComponent,
	BackendTestComponent
];

class MockUserService {
	validateUser(token: string) {
		return new Promise(async (resolve, reject) => {
			if (token == 'adminToken')
				resolve({ token: 'adminToken', permissions: 'admin', name: 'admin', message: 'login successful' });
			if (token == 'userToken')
				resolve({ token: 'userToken', permissions: 'user', name: 'user', message: 'login successful' });
			else resolve({ token: false, message: 'Invalid token' });
		});
	}
	getUserToken() {
		return 'userToken';
	}
	updateUserToken(token: string) {
		return token;
	}

	removeUserToken() {
		return true;
	}

	login(username: string, password: string) {
		return new Promise((resolve, reject) => {
			try {
				if (!username) throw new Error('invalid args');
				if (!password) throw new Error('invalid args');
				resolve({ user: { token: 'userToken', permissions: 'user', name: 'user' } });
			} catch (error) {
				console.log(error);
				resolve(false);
			}
		});
	}
}

describe('LoginComponent', () => {
	let component: LoginComponent;
	let de: DebugElement;
	let fixture: ComponentFixture<LoginComponent>;
	let mockSuccessfulValidation = { token: 'userToken', permissions: 'user', name: 'userName' };
	let mockFailedValidation = {};
	beforeEach(
		async(() => {
			TestBed.configureTestingModule({
				imports: [ RouterTestingModule.withRoutes(routes), FormsModule, MatSortModule ],
				declarations: [ LoginComponent, ...routingComponents ],
				schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
				providers: [ { provide: UserService, useClass: MockUserService } ]
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(LoginComponent);
		component = fixture.componentInstance;
		de = fixture.debugElement;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	// Test DOM

	it('should have a username input rendered to the DOM', () => {
		component.loggedIn = false;
		component.showLoginSpinner = false;
		fixture.detectChanges();
		expect(de.query(By.css('#username'))).toBeTruthy();
	});

	it('should have a password input rendered to the DOM', () => {
		component.loggedIn = false;
		component.showLoginSpinner = false;
		fixture.detectChanges();
		expect(de.query(By.css('#password'))).toBeTruthy();
	});

	it('should have a login button rendered to the DOM', () => {
		component.loggedIn = false;
		component.showLoginSpinner = false;
		fixture.detectChanges();
		expect(de.query(By.css('#login-button'))).toBeTruthy();
	});

	it('should only show the "view books" button when user is logged in', () => {
		component.loggedIn = false;
		component.showLoginSpinner = false;
		fixture.detectChanges();
		expect(de.query(By.css('#view-books-button'))).toBeFalsy();
		component.loggedIn = true;
		fixture.detectChanges();
		expect(de.query(By.css('#view-books-button'))).toBeTruthy();
	});

	it('should only show the "manage users" button when admin is logged in', () => {
		component.loggedIn = false;
		component.showLoginSpinner = false;
		component.permissions = 'user';
		fixture.detectChanges();
		expect(de.query(By.css('#manage-users-button'))).toBeFalsy();
		component.loggedIn = true;
		component.permissions = 'admin';
		fixture.detectChanges();
		expect(de.query(By.css('#manage-users-button'))).toBeTruthy();
	});

	it('should only show the "logout" button when user is logged in', () => {
		component.loggedIn = false;
		component.showLoginSpinner = false;
		fixture.detectChanges();
		expect(de.query(By.css('#logout-button'))).toBeFalsy();
		component.loggedIn = true;
		fixture.detectChanges();
		expect(de.query(By.css('#logout-button'))).toBeTruthy();
	});

	// Test Component

	it('should have the username as a public string variable', () => {
		expect(component.username).toBeDefined();
		expect(typeof component.username).toEqual('string');
	});

	it('should have the password as a public string variable', () => {
		expect(component.password).toBeDefined();
		expect(typeof component.password).toEqual('string');
	});

	it('should have the header of the login modal as a public string variable', () => {
		expect(component.loginHeader).toBeDefined();
		expect(typeof component.loginHeader).toEqual('string');
	});

	it('should have the current user permissions level as a public string variable', () => {
		expect(component.permissions).toBeDefined();
		expect(typeof component.permissions).toEqual('string');
	});

	it('should have a function to handle the result of user initial user validation', () => {
		expect(component.handleValidationResult).toBeTruthy();
		expect(typeof component.handleValidationResult).toEqual('function');
	});

	it('should have a function to handle the result of a successful user validation by hiding the login spinner on the DOM', () => {
		component.showLoginSpinner = true;
		fixture.detectChanges();
		expect(de.query(By.css('mat-spinner'))).toBeTruthy();
		component.handleValidationResult(mockSuccessfulValidation);
		fixture.detectChanges();
		expect(component.showLoginSpinner).toBeFalsy();
		expect(de.query(By.css('mat-spinner'))).toBeFalsy();
	});

	it('should have a function to handle the result of a successful user validation by changing the "logged in" status to true', () => {
		component.loggedIn = false;
		expect(component.loggedIn).toBeFalsy();
		component.handleValidationResult(mockSuccessfulValidation);
		expect(component.loggedIn).toBeTruthy();
	});

	it('should have a function to handle the result of a failed user validation by setting "logged in" status to false', () => {
		component.loggedIn = true;
		expect(component.loggedIn).toBeTruthy();
		component.handleValidationResult(mockFailedValidation);
		expect(component.loggedIn).toBeFalsy();
	});

	it('should have a function to handle the result of a successful user validation by changing the text of the login modal header', () => {
		expect(component.loginHeader).toEqual('Login');
		component.handleValidationResult(mockSuccessfulValidation);
		fixture.detectChanges();
		expect(component.loginHeader).toEqual(`Welcome ${mockSuccessfulValidation.name}!`);
	});

	it('should have a function to handle the result of a successful user validation by changing the current user permissions level', () => {
		expect(component.permissions).toEqual('');
		component.handleValidationResult(mockSuccessfulValidation);
		expect(component.permissions).toEqual(mockSuccessfulValidation.permissions);
	});

	it('should have a "login" function', () => {
		expect(component.login).toBeTruthy();
		expect(typeof component.login).toEqual('function');
	});

	it('should have a "login" function that changes the current user permissions level when valid username and password are entered', async () => {
		expect(component.permissions.length).toBeFalsy();
		component.username = 'username';
		component.password = 'password';
		await component.login();
		expect(component.permissions.length).toBeTruthy();
	});

	it('should have a "login" function that changes the login modal header text when valid username and password are entered', async () => {
		expect(component.loginHeader).toEqual('Login');
		component.username = 'username';
		component.password = 'password';
		await component.login();
		expect(component.loginHeader == 'Login').toBeFalsy();
	});

	it('should have a "login" function that changes the "logged in" status to true when valid username and password are entered', async () => {
		expect(component.loggedIn).toBeFalsy();
		component.username = 'username';
		component.password = 'password';
		await component.login();
		expect(component.loggedIn).toBeTruthy();
	});

	it('should have a "logout" function', () => {
		expect(component.logout).toBeTruthy();
		expect(typeof component.logout).toEqual('function');
	});

	it('should have a "logout" function that sets the "logged in" status to false', () => {
		component.loggedIn = true;
		expect(component.loggedIn).toBeTruthy();
		component.logout();
		expect(component.loggedIn).toBeFalsy();
	});

	it('should have a "logout" function that sets the login modal header text  to "Login"', () => {
		component.loginHeader = 'foo';
		expect(component.loginHeader != 'Login').toBeTruthy();
		component.logout();
		expect(component.loginHeader).toEqual('Login');
	});

	it('should have "UserValidatorService" injected into it', () => {
		expect(component.userService).toBeTruthy();
	});

	it('should have a "validate login data" function', () => {
		expect(component.validateLoginData).toBeTruthy();
		expect(typeof component.validateLoginData).toEqual('function');
	});

	it('should have a "validate login data" function which should require a password to login', () => {
		expect(component.validateLoginData('username', undefined)).toBeFalsy();
		expect(component.validateLoginData('username', '')).toBeFalsy();
	});

	it('should have a "validate login data" function which should require a username to login', () => {
		expect(component.validateLoginData(undefined, 'password')).toBeFalsy();
		expect(component.validateLoginData('', 'password')).toBeFalsy();
	});
});
