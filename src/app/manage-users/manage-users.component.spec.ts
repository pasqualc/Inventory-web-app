import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../material.module';
import { ManageUsersComponent } from './manage-users.component';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { UserService } from '../services/user.service';
import { routes } from '../app-routing.module';
import { FormsModule } from '@angular/forms';
import { BooksViewComponent } from '../books-view/books-view.component';
import { SheetEditComponent } from '../sheet-edit/sheet-edit.component';
import { BooksListComponent } from '../books-list/books-list.component';
import { SheetsViewComponent } from '../sheets-view/sheets-view.component';
import { BookEditComponent } from '../book-edit/book-edit.component';
import { LoginComponent } from '../login/login.component';
import { EditUserDialog, DeleteUserDialog } from '../dialogs/dialogs.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
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

let mockUsersData = [
	{ username: 'username1', name: 'user1', password: 'password1', permissions: 'user' },
	{ username: 'username2', name: 'user2', password: 'password2', permissions: 'user' },
	{ username: 'username3', name: 'user3', password: 'password3', permissions: 'admin' }
];

class MockUserService {
	getUsers() {
		return of(mockUsersData);
	}

	validateUser(token: string) {
		return new Promise(async (resolve, reject) => {
			if (token == 'admin')
				resolve({ token: 'adminToken', permissions: 'admin', name: 'admin', message: 'login successful' });
			if (token == 'user')
				resolve({ token: 'userToken', permissions: 'user', name: 'user', message: 'login successful' });
			else resolve({ token: false, message: 'Invalid token' });
		});
	}
	getUserToken() {
		return 'adminToken';
	}
	updateUserToken(token: string) {
		return token;
	}

	removeUserToken() {
		return true;
	}
}

describe('ManageUsersComponent', () => {
	let component: ManageUsersComponent;
	let fixture: ComponentFixture<ManageUsersComponent>;
	let de: DebugElement;
	let dialog: MatDialog;
	let dialogSpy: any;
	beforeEach(
		async(() => {
			TestBed.configureTestingModule({
				imports: [
					RouterTestingModule.withRoutes(routes),
					FormsModule,
					MatDialogModule,
					MaterialModule,
					BrowserAnimationsModule
				],
				declarations: [ ManageUsersComponent, ...routingComponents ],
				providers: [ { provide: UserService, useClass: MockUserService } ]
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(ManageUsersComponent);
		component = fixture.componentInstance;
		de = fixture.debugElement;
		fixture.detectChanges();
		dialog = fixture.debugElement.injector.get(MatDialog);
		dialogSpy = spyOn(dialog, 'open').and.callFake(() => {
			return <any>true;
		});
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	// Test DOM

	it('should have a "create user" button rendered on the DOM', () => {
		component.contentLoading = false;
		fixture.detectChanges();
		expect(de.query(By.css('#create-user'))).toBeTruthy();
	});

	it('should have a list for user data rendered on the DOM', () => {
		component.contentLoading = false;
		fixture.detectChanges();
		expect(de.query(By.css('#user-list'))).toBeTruthy();
	});

	it('should have a listing for each user, in users public array variable, rendered on the DOM', () => {
		component.contentLoading = false;
		component.users = mockUsersData;
		fixture.detectChanges();
		expect(de.query(By.css('.user'))).toBeTruthy();
		expect(de.queryAll(By.css('.user')).length).toEqual(component.users.length);
	});

	it('should have an edit button, for each user in users public array variable, rendered on the DOM', () => {
		component.contentLoading = false;
		component.users = mockUsersData;
		fixture.detectChanges();
		expect(de.query(By.css('.user .edit-book'))).toBeTruthy();
		expect(de.queryAll(By.css('.user .edit-book')).length).toEqual(component.users.length);
	});

	it('should have a delete button, for each user in users public array variable, rendered on the DOM', () => {
		component.contentLoading = false;
		component.users = mockUsersData;
		fixture.detectChanges();
		expect(de.query(By.css('.user .delete-book'))).toBeTruthy();
		expect(de.queryAll(By.css('.user .delete-book')).length).toEqual(component.users.length);
	});

	it('should have the username, of each user in users public array variable, rendered on the DOM', () => {
		component.contentLoading = false;
		component.users = mockUsersData;
		fixture.detectChanges();
		expect(de.query(By.css('.user .username'))).toBeTruthy();
		expect(de.queryAll(By.css('.user .username')).length).toEqual(component.users.length);
	});

	it('should have the permissions level, of each user in users public array variable, rendered on the DOM', () => {
		component.contentLoading = false;
		component.users = mockUsersData;
		fixture.detectChanges();
		expect(de.query(By.css('.user .permissions'))).toBeTruthy();
		expect(de.queryAll(By.css('.user .permissions')).length).toEqual(component.users.length);
	});

	// Test Component

	it('should have an "edit user" function', () => {
		expect(component.editUser).toBeTruthy();
		expect(typeof component.editUser).toEqual('function');
	});

	it('should have an "edit user" function which should open the injected MatDialog with the EditUserDialog component when valid args are passed in', () => {
		let mockUser = { id: 'id', name: 'name', username: 'username', password: 'password', permissions: 'admin' };
		component.editUser({ ...mockUser });
		expect(dialogSpy).toHaveBeenCalled();
		expect(dialogSpy).toHaveBeenCalledWith(EditUserDialog, {
			width: '380px',
			data: <any>{
				user: {
					id: mockUser.id,
					username: mockUser.username,
					name: mockUser.name,
					password: '',
					oldPassword: mockUser.password,
					permissions: mockUser.permissions
				}
			}
		});
	});

	it('should have an "edit user" function which should not open the injected MatDialog when invalid args are passed in', () => {
		component.editUser(undefined);
		expect(dialogSpy).toHaveBeenCalledTimes(0);
		component.editUser({ name: 'name', username: 'username', permissions: 'admin' });
		expect(dialogSpy).toHaveBeenCalledTimes(0);
	});

	it('should have an "delete user" function', () => {
		expect(component.deleteUser).toBeTruthy();
		expect(typeof component.deleteUser).toEqual('function');
	});

	it('should have an "delete user" function which should open the injected MatDialog with the DeleteUserDialog component when valid args are passed in', () => {
		let mockUser = { id: 'id', name: 'name', username: 'username', password: 'password', permissions: 'admin' };
		component.deleteUser(mockUser);
		expect(dialogSpy).toHaveBeenCalled();
		expect(dialogSpy).toHaveBeenCalledWith(DeleteUserDialog, {
			width: '380px',
			data: <any>{
				id: mockUser.id
			}
		});
	});

	it('should have an "delete user" function which should not open the injected MatDialog when invalid args are passed in', () => {
		component.deleteUser({ name: 'name', username: 'username', password: 'password', permissions: 'admin' });
		expect(dialogSpy).toHaveBeenCalledTimes(0);
		component.deleteUser({
			id: ''
		});
		expect(dialogSpy).toHaveBeenCalledTimes(0);
		component.deleteUser(undefined);
		expect(dialogSpy).toHaveBeenCalledTimes(0);
	});

	it('should have an "create user" function', () => {
		expect(component.createUser).toBeTruthy();
		expect(typeof component.createUser).toEqual('function');
	});

	it('should have an "create user" function which should open the injected MatDialog with the EditUserDialog component when valid args are passed in', () => {
		let mockUser = {
			username: '',
			name: '',
			password: '',
			permissions: 'user'
		};
		component.createUser();
		expect(dialogSpy).toHaveBeenCalled();
		expect(dialogSpy).toHaveBeenCalledWith(EditUserDialog, {
			width: '380px',
			data: <any>{ user: mockUser }
		});
	});
});
