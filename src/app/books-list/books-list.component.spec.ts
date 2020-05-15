import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BooksListComponent } from './books-list.component';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { of, Observable } from 'rxjs';
import { MaterialModule } from '../material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { DeleteBookDialog, ImportBookDialog } from '../dialogs/dialogs.component';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { routes } from '../app-routing.module';
import { LoginComponent } from '../login/login.component';
import { SheetEditComponent } from '../sheet-edit/sheet-edit.component';
import { BooksViewComponent } from '../books-view/books-view.component';
import { SheetsViewComponent } from '../sheets-view/sheets-view.component';
import { BookEditComponent } from '../book-edit/book-edit.component';
import { ManageUsersComponent } from '../manage-users/manage-users.component';
import { BookService } from '../services/book.service';
import { MatDialog } from '@angular/material';
import { BackendTestComponent } from '../backend-test/backend-test.component';

let routingComponents = [
	LoginComponent,
	SheetEditComponent,
	BooksViewComponent,
	SheetsViewComponent,
	BookEditComponent,
	ManageUsersComponent,
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
		return 'adminToken';
	}
	updateUserToken(token: string) {
		return token;
	}

	removeUserToken() {
		return true;
	}
}

class MockBookService {
	getBooksCollection() {
		return <Observable<any>>of([
			{ id: 'id1', name: 'value' },
			{ id: 'id2', name: 'value' },
			{ id: 'id3', name: 'value' }
		]);
	}

	getBookDocument(bookId: string) {
		try {
			if (!bookId) throw new Error('invalid args');
			return <Observable<any>>of({ id: 'id1', name: 'value' });
		} catch (error) {
			return <Observable<any>>of(false);
		}
	}

	addBook(name: string, headingFields: Array<any>) {
		return new Promise((resolve, reject) => {
			try {
				if (!name) throw new Error('invalid args');
				if (!headingFields) headingFields = new Array();
				resolve(true);
			} catch (error) {
				resolve(false);
			}
		});
	}

	updateBookName(bookId: string, name: string) {
		return new Promise((resolve, reject) => {
			try {
				if (!bookId) throw new Error('invalid args');
				if (!name) throw new Error('invalid args');
			} catch (error) {
				resolve(false);
			}
		});
	}
}

describe('BooksListComponent', () => {
	let component: BooksListComponent;
	let de: DebugElement;
	let fixture: ComponentFixture<BooksListComponent>;
	let router: Router;
	let routerSpy: any;
	let dialog: MatDialog;
	let dialogSpy: any;
	let mockBookData: Array<any> = [
		{ id: 'book1', name: 'abook1' },
		{ id: 'book2', name: 'dbook2' },
		{ id: 'book3', name: 'cbook3' }
	];

	beforeEach(
		async(() => {
			TestBed.configureTestingModule({
				imports: [
					RouterTestingModule.withRoutes(routes),
					FormsModule,
					MaterialModule,
					BrowserAnimationsModule
				],
				declarations: [ BooksListComponent, DeleteBookDialog, ImportBookDialog, ...routingComponents ],
				schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
				providers: [
					{ provide: BookService, useClass: MockBookService },
					{ provide: UserService, useClass: MockUserService }
				]
			})
				.overrideModule(BrowserDynamicTestingModule, {
					set: {
						entryComponents: [ DeleteBookDialog, ImportBookDialog ]
					}
				})
				.compileComponents();
		})
	);

	beforeEach(async () => {
		fixture = TestBed.createComponent(BooksListComponent);
		component = fixture.componentInstance;
		de = fixture.debugElement;
		fixture.detectChanges();
		router = de.injector.get(Router);
		routerSpy = spyOn(router, 'navigate').and.callFake(() => {
			return <any>true;
		});
		dialog = de.injector.get(MatDialog);
		dialogSpy = spyOn(dialog, 'open').and.callFake(() => {
			return <any>true;
		});
		await fixture.whenStable();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	// Test DOM

	it('should have a sorting control rendered on the DOM', () => {
		component.contentLoading = false;
		fixture.detectChanges();
		expect(de.query(By.css('#sort-control'))).toBeTruthy();
	});

	it('should have an import button rendered on the DOM', () => {
		component.contentLoading = false;
		fixture.detectChanges();
		expect(de.query(By.css('#import'))).toBeTruthy();
	});

	it('should have a create book button rendered on the DOM', () => {
		component.contentLoading = false;
		component.permissions = 'admin';
		fixture.detectChanges();
		expect(de.query(By.css('#create-book'))).toBeTruthy();
	});

	it('should have a view button on each book rendered to the DOM', () => {
		component.books = mockBookData;
		component.sort();
		component.contentLoading = false;
		fixture.detectChanges();
		expect(de.queryAll(By.css('.view-book')).length).toEqual(component.sortedBooks.length);
	});

	it('should have an edit button on each book list item rendered to the DOM', () => {
		component.books = mockBookData;
		component.sort();
		component.permissions = 'admin';
		component.contentLoading = false;
		fixture.detectChanges();
		expect(de.queryAll(By.css('.edit-book')).length).toEqual(component.sortedBooks.length);
	});

	it('should have a delete button on each book list item rendered to the DOM', () => {
		component.books = mockBookData;
		component.sort();
		component.permissions = 'admin';
		component.contentLoading = false;
		fixture.detectChanges();
		expect(de.queryAll(By.css('.delete-book')).length).toEqual(component.sortedBooks.length);
	});

	it('should render all of the books to the DOM', () => {
		component.books = mockBookData;
		component.sort();
		component.contentLoading = false;
		fixture.detectChanges();
		expect(de.queryAll(By.css('.book')).length).toEqual(component.sortedBooks.length);
	});

	// Test Component

	it('should have book data as a public array variable', () => {
		expect(component.books).toBeDefined();
		expect(Array.isArray(component.books)).toBeTruthy();
		expect(component.books.length == mockBookData.length);
	});

	it('should have sorted book data as a public array variable', () => {
		expect(component.sortedBooks).toBeDefined();
		expect(Array.isArray(component.sortedBooks)).toBeTruthy();
		expect(component.sortedBooks.length == mockBookData.length);
	});

	it('should have sorting order as a public string variable', () => {
		expect(component.sortOrder).toBeDefined();
		expect(typeof component.sortOrder).toEqual('string');
	});

	it('should have current user permissions level as a public string variable', () => {
		expect(component.permissions).toBeDefined();
		expect(typeof component.permissions).toEqual('string');
	});

	it('should have a "create book" function', () => {
		expect(component.createBook).toBeTruthy();
		expect(typeof component.createBook).toEqual('function');
	});

	it('should have a "create book" function that should use the injected router to navigate to "/books/edit/new"', () => {
		component.createBook();
		expect(routerSpy).toHaveBeenCalled();
		expect(routerSpy).toHaveBeenCalledWith([ '/books/edit', 'new' ]);
	});

	it('should have an "open book" function', () => {
		expect(component.openBook).toBeTruthy();
		expect(typeof component.openBook).toEqual('function');
	});

	it('should have a "open book" function that should use the injected router to "/books/${bookId}"', () => {
		let id = 'bookId';
		component.openBook(id);
		expect(routerSpy).toHaveBeenCalled();
		expect(routerSpy).toHaveBeenCalledWith([ '/books', id ]);
	});

	it('should have an "edit book" function', () => {
		expect(component.editBook).toBeTruthy();
		expect(typeof component.editBook).toEqual('function');
	});

	it('should have a "edit book" function that should use the injected router to "/books/${bookId}"', () => {
		let id = 'bookId';
		component.editBook(id);
		expect(routerSpy).toHaveBeenCalled();
		expect(routerSpy).toHaveBeenCalledWith([ '/books/edit', id ]);
	});

	it('should have a "delete book" function', () => {
		expect(component.deleteBook).toBeTruthy();
		expect(typeof component.deleteBook).toEqual('function');
	});

	it('should have a "delete book" function which should use the injected MatDialog object to open the DeleteBookDialog component when valid args is passed in', () => {
		let id = 'bookId';
		component.deleteBook(id);
		expect(dialogSpy).toHaveBeenCalled();
		expect(dialogSpy).toHaveBeenCalledWith(DeleteBookDialog, {
			width: '380px',
			data: {
				id: id,
				confirm: false
			}
		});
	});

	it('should have a "delete book" function which should not use the injected MatDialog object to open the DeleteBookDialog component when invalid args is passed in', () => {
		component.deleteBook(undefined);
		expect(dialogSpy).toHaveBeenCalledTimes(0);
		component.deleteBook('');
		expect(dialogSpy).toHaveBeenCalledTimes(0);
	});

	it('should have an "import book" function', () => {
		expect(component.importBook).toBeTruthy();
		expect(typeof component.importBook).toEqual('function');
	});

	it('should have an "import book" function which should use the injected MatDialog object to open the ImportBookDialog component when valid args is passed in', () => {
		component.importBook();
		expect(dialogSpy).toHaveBeenCalled();
		expect(dialogSpy).toHaveBeenCalledWith(ImportBookDialog, {
			width: '380px',
			data: {
				importedBook: {
					name: 'New Book'
				}
			}
		});
	});

	it('should have a sort function', () => {
		expect(component.sort).toBeTruthy();
		expect(typeof component.sort == 'function').toBeTruthy();
	});

	it('should have a sort function that sorts component.books by name (direction corresponds to component.sortOrder) and places the sorted array in component.sortedBooks', () => {
		component.books = mockBookData;
		component.sortOrder = 'ascending';
		component.sort();
		expect(component.sortedBooks.length).toEqual(component.books.length);
		expect(component.sortedBooks[0].name).toBeLessThan(component.sortedBooks[1].name);
		expect(component.sortedBooks[1].name).toBeLessThan(component.sortedBooks[2].name);

		component.books = mockBookData;
		component.sortOrder = 'descending';
		component.sort();
		expect(component.sortedBooks.length).toEqual(component.books.length);
		expect(component.sortedBooks[0].name).toBeGreaterThan(component.sortedBooks[1].name);
		expect(component.sortedBooks[1].name).toBeGreaterThan(component.sortedBooks[2].name);

		component.books = mockBookData;
		component.sortOrder = 'none';
		component.sort();
		expect(component.sortedBooks.length).toEqual(component.books.length);
		expect(component.sortedBooks[0].name).toEqual(mockBookData[0].name);
		expect(component.sortedBooks[1].name).toEqual(mockBookData[1].name);
		expect(component.sortedBooks[2].name).toEqual(mockBookData[2].name);
	});
});
