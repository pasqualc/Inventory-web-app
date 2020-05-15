import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { BooksViewComponent } from './books-view.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { MaterialModule } from '../material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { DeleteSheetDialog, CreateSheetDialog, ExportBookDialog } from '../dialogs/dialogs.component';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { routes } from '../app-routing.module';
import { LoginComponent } from '../login/login.component';
import { SheetEditComponent } from '../sheet-edit/sheet-edit.component';
import { BooksListComponent } from '../books-list/books-list.component';
import { SheetsViewComponent } from '../sheets-view/sheets-view.component';
import { BookEditComponent } from '../book-edit/book-edit.component';
import { ManageUsersComponent } from '../manage-users/manage-users.component';
import { SheetService } from '../services/sheet.service';
import { BookService } from '../services/book.service';
import { MatDialog } from '@angular/material';
import { BackendTestComponent } from '../backend-test/backend-test.component';

let routingComponents = [
	LoginComponent,
	SheetEditComponent,
	BooksListComponent,
	SheetsViewComponent,
	BookEditComponent,
	ManageUsersComponent,
	BackendTestComponent
];

let mockBookData = {
	id: 'bookId',
	name: 'book1',
	headingFields: [
		{ name: 'member1', primary: true, text: true, type: 'text' },
		{ name: 'member2', primary: false, text: false, type: 'number' },
		{ name: 'member3', primary: false, text: true, type: 'text' }
	]
};

let mockSheetData: Array<any> = [
	{ id: 'sheet1', name: 'sheet1' },
	{ id: 'sheet2', name: 'sheet2' },
	{ id: 'sheet3', name: 'sheet3' },
	{ id: 'sheet4', name: 'sheet4' },
	{ foo: 'sheet5', name: 'sheet5' },
	{ id: 'sheet6', foo: 'sheet6' },
	{ foo: 'sheet7', bar: 'sheet7' }
];

class MockSheetService {
	getSheetCollection() {
		return <Observable<any>>of(mockSheetData);
	}
}

class MockBookService {
	getBookDocument(id: string) {
		return <Observable<any>>of(mockBookData);
	}
}

class MockUserService {
	validateUser(token: string) {
		return new Promise(async (resolve, reject) => {
			if (token == 'adminToken')
				resolve({ token: 'asdf1234', permissions: 'admin', name: 'admin', message: 'login successful' });
			if (token == 'userToken')
				resolve({ token: 'asdf1234', permissions: 'user', name: 'user', message: 'login successful' });
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
}

class MockActivatedRoute {
	params = of({ id: 'bookId' });
}

describe('BooksViewComponent', () => {
	let component: BooksViewComponent;
	let fixture: ComponentFixture<BooksViewComponent>;
	let de: DebugElement;
	let dialog: MatDialog;
	let dialogSpy: any;
	let router: Router;
	let routerSpy: any;

	beforeEach(
		async(() => {
			TestBed.configureTestingModule({
				imports: [
					RouterTestingModule.withRoutes(routes),
					FormsModule,
					MaterialModule,
					BrowserAnimationsModule
				],
				declarations: [
					BooksViewComponent,
					CreateSheetDialog,
					DeleteSheetDialog,
					ExportBookDialog,
					...routingComponents
				],
				schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
				providers: [
					RouterTestingModule,
					MatDialog,
					{ provide: SheetService, useClass: MockSheetService },
					{ provide: BookService, useClass: MockBookService },
					{ provide: UserService, useClass: MockUserService },
					{ provide: ActivatedRoute, useClass: MockActivatedRoute }
				]
			})
				.overrideModule(BrowserDynamicTestingModule, {
					set: {
						entryComponents: [ CreateSheetDialog, DeleteSheetDialog, ExportBookDialog ]
					}
				})
				.compileComponents();
		})
	);

	beforeEach(async () => {
		fixture = TestBed.createComponent(BooksViewComponent);
		component = fixture.componentInstance;
		de = fixture.debugElement;
		fixture.detectChanges();
		dialog = de.injector.get(MatDialog);
		dialogSpy = spyOn(dialog, 'open').and.callFake(() => {
			return <any>true;
		});
		router = de.injector.get(Router);
		routerSpy = spyOn(router, 'navigate').and.callFake(() => {
			return <any>true;
		});
		await fixture.whenStable();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	// Test DOM

	it('should have a list item rendered to the DOM for each sheet data', () => {
		component.contentLoading = false;
		component.permissions = 'admin';
		component.sheets = mockSheetData;
		component.sort();
		fixture.detectChanges();
		expect(de.queryAll(By.css('.sheet-listing')).length).toEqual(component.sortedSheets.length);
	});

	it('should have "edit sheet" buttons for all sheets rendered on the DOM', () => {
		component.contentLoading = false;
		component.permissions = 'admin';
		component.sheets = mockSheetData;
		component.sort();
		fixture.detectChanges();
		expect(de.query(By.css('.edit-sheet'))).toBeTruthy();
		expect(de.queryAll(By.css('.edit-sheet')).length).toEqual(component.sheets.length);
	});

	it('should have "view sheet" buttons for all sheets rendered on the DOM', () => {
		component.contentLoading = false;
		component.permissions = 'admin';
		component.sheets = mockSheetData;
		component.sort();
		fixture.detectChanges();
		expect(de.query(By.css('.view-sheet'))).toBeTruthy();
		expect(de.queryAll(By.css('.view-sheet')).length).toEqual(component.sheets.length);
	});

	it('should have "delete sheet" buttons for all sheets rendered on the DOM', () => {
		component.contentLoading = false;
		component.permissions = 'admin';
		component.sheets = mockSheetData;
		component.sort();
		fixture.detectChanges();
		expect(de.query(By.css('.delete-sheet'))).toBeTruthy();
		expect(de.queryAll(By.css('.delete-sheet')).length).toEqual(component.sheets.length);
	});

	it('should have a control for sorting sheets rendered on the DOM', () => {
		component.contentLoading = false;
		fixture.detectChanges();
		expect(de.query(By.css('#sort-control'))).toBeTruthy();
	});

	it('should have a sort function', () => {
		expect(component.sort).toBeTruthy();
		expect(typeof component.sort).toEqual('function');
	});

	it('should have a export button rendered on the DOM', () => {
		component.contentLoading = false;
		fixture.detectChanges();
		expect(de.query(By.css('#export'))).toBeTruthy();
	});

	it('should have a create sheet button rendered on the DOM', () => {
		component.contentLoading = false;
		fixture.detectChanges();
		expect(de.query(By.css('#create-sheet'))).toBeTruthy();
	});

	// Test Component

	it('should have the book ID as a public string variable', () => {
		expect(component.bookId).toBeDefined();
		expect(typeof component.bookId).toEqual('string');
	});

	it('should have the book name as a public string variable', () => {
		expect(component.bookName).toBeDefined();
		expect(typeof component.bookName).toEqual('string');
	});

	it('should have the permissions level of the current user as a public string variable', () => {
		expect(component.permissions).toBeDefined();
		expect(typeof component.permissions).toEqual('string');
	});

	it('should have sheets data as a public array varaible', () => {
		expect(component.sheets).toBeTruthy();
		expect(Array.isArray(component.sheets)).toBeTruthy();
	});

	it('should have heading fields data as a public array varaible', () => {
		expect(component.headingFields).toBeTruthy();
		expect(Array.isArray(component.headingFields)).toBeTruthy();
	});

	it('should have sorted sheets data as a public array varaible', () => {
		expect(component.sortedSheets).toBeTruthy();
		expect(Array.isArray(component.sortedSheets)).toBeTruthy();
	});

	it('should have the user service injected into it', () => {
		expect(component.userService).toBeTruthy();
	});

	it('should have an "open export dialog" function', () => {
		expect(component.openExportDialog).toBeTruthy();
		expect(typeof component.openExportDialog).toEqual('function');
	});

	it('should have an "open export dialog" function that should use the injected MatDialog to open the ExportBookDialog component', () => {
		component.sheets = mockSheetData;
		component.bookId = 'bookId';
		component.openExportDialog();
		expect(dialogSpy).toHaveBeenCalled();
		expect(dialogSpy).toHaveBeenCalledWith(ExportBookDialog, {
			width: '380px',
			data: <any>{
				name: '',
				sheets: component.sheets,
				bookId: component.bookId
			}
		});
	});

	it('should have a "create sheet" function', () => {
		expect(component.createSheet).toBeTruthy();
		expect(typeof component.createSheet).toEqual('function');
	});

	it('should have an "create sheet" function that should use the injected MatDialog to open the CreateSheetDialog component', () => {
		component.sheets = mockSheetData;
		component.bookId = 'bookId';
		component.createSheet();
		expect(dialogSpy).toHaveBeenCalled();
		expect(dialogSpy).toHaveBeenCalledWith(CreateSheetDialog, {
			width: '380px',
			data: <any>{
				name: new String(),
				bookId: component.bookId,
				headingFields: component.headingFields ? component.headingFields : new Array<any>()
			}
		});
	});

	it('should have an "view sheet" function', () => {
		expect(component.viewSheet).toBeTruthy();
		expect(typeof component.viewSheet).toEqual('function');
	});

	it('should have an "view sheet" function that uses the injected router to navigate to /sheets/:bookId/:sheetId when valid args are passed in', () => {
		let sheetId = 'sheetId';
		let bookId = 'bookId';
		component.bookId = bookId;
		component.viewSheet(sheetId);
		expect(routerSpy).toHaveBeenCalled();
		expect(routerSpy).toHaveBeenCalledWith([ '/sheets', component.bookId, sheetId ]);
	});

	it('should have an "view sheet" function that does not use the injected router to navigate to /sheets/:bookId/:sheetId when invalid args are passed in', () => {
		let bookId = 'bookId';
		component.bookId = bookId;
		component.viewSheet(undefined);
		component.viewSheet('');
		expect(routerSpy).toHaveBeenCalledTimes(0);
	});

	it('should have an "edit sheet" function', () => {
		expect(component.editSheet).toBeTruthy();
		expect(typeof component.editSheet).toEqual('function');
	});

	it('should have an "edit sheet" function that uses the injected router to navigate to /sheets/edit/:bookId/:sheetId when valid args are passed in', () => {
		let sheetId = 'sheetId';
		let bookId = 'bookId';
		component.bookId = bookId;
		component.editSheet(sheetId);
		expect(routerSpy).toHaveBeenCalled();
		expect(routerSpy).toHaveBeenCalledWith([ '/sheets/edit', bookId, sheetId ]);
	});

	it('should have an "edit sheet" function that does not use the injected router to navigate to /sheets/edit/:bookId/:sheetId when invalid args are passed in', () => {
		let bookId = 'bookId';
		component.bookId = bookId;
		component.viewSheet(undefined);
		component.viewSheet('');
		expect(routerSpy).toHaveBeenCalledTimes(0);
	});

	it('should have an "delete sheet" function', () => {
		expect(component.deleteSheet).toBeTruthy();
		expect(typeof component.deleteSheet).toEqual('function');
	});

	it('should have an "delete sheet" function that should use the injected MatDialog to open the DeleteSheetDialog component when valid args are passed in', () => {
		let bookId = 'bookId';
		let sheetId = 'sheetId';
		component.sheets = mockSheetData;
		component.bookId = bookId;
		component.deleteSheet(sheetId);
		expect(dialogSpy).toHaveBeenCalled();
		expect(dialogSpy).toHaveBeenCalledWith(DeleteSheetDialog, {
			width: '380px',
			data: {
				bookId,
				sheetId
			}
		});
	});

	it('should have an "delete sheet" function that should not use the injected MatDialog to open the DeleteSheetDialog component when invalid args are passed in', () => {
		let bookId = 'bookId';
		component.sheets = mockSheetData;
		component.bookId = bookId;
		component.deleteSheet(undefined);
		component.deleteSheet('');
		expect(dialogSpy).toHaveBeenCalledTimes(0);
	});
});
