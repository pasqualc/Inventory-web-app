import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BookEditComponent } from './book-edit.component';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { from, of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from '../material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import {
	NoHeaderDialog,
	AddHeadingFieldDialog,
	AddProductDialog,
	EditFieldDialog,
	EditProductDialog
} from '../dialogs/dialogs.component';
import { UserService } from '../services/user.service';
import { routes } from '../app-routing.module';
import { LoginComponent } from '../login/login.component';
import { SheetEditComponent } from '../sheet-edit/sheet-edit.component';
import { BooksViewComponent } from '../books-view/books-view.component';
import { SheetsViewComponent } from '../sheets-view/sheets-view.component';
import { BooksListComponent } from '../books-list/books-list.component';
import { ManageUsersComponent } from '../manage-users/manage-users.component';
import { BookService } from '../services/book.service';
import { SheetService } from '../services/sheet.service';
import { BackendTestComponent } from '../backend-test/backend-test.component';

let routingComponents = [
	LoginComponent,
	SheetEditComponent,
	BooksViewComponent,
	SheetsViewComponent,
	BookEditComponent,
	ManageUsersComponent,
	BooksListComponent,
	BackendTestComponent
];

export interface HeadingField {
	name: string;
	text: boolean;
}

export interface Book {
	id: string;
	name: string;
	headingFields: Array<HeadingField>;
}

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
}

class MockSheetService {}

class MockBookService {
	getBookDocument(bookId: string) {
		return of([ { data: 'value' } ]);
	}

	getDefaultProducts(bookId: string) {
		return of([ [ { data: 'value' }, { data: 'value' }, { data: 'value' } ] ]);
	}

	addook(data: any) {
		return new Promise((resolve, reject) => {
			if (data) resolve('bookId');
			else reject(new Error('invalid args'));
		});
	}

	updateBookName(newName: string) {
		return new Promise((resolve, reject) => {
			if (newName && newName.length) resolve(true);
			else reject(new Error('invalid args'));
		});
	}
}

describe('BookEditComponent', () => {
	let component: BookEditComponent;
	let de: DebugElement;
	let fixture: ComponentFixture<BookEditComponent>;

	let mockBookData: any = {
		id: 'bookId',
		name: 'book1',
		headingFields: [
			{ name: 'field1', primary: true, text: true, type: 'text' },
			{ name: 'field2', primary: false, text: false, type: 'number' },
			{ name: 'field3', primary: false, text: true, type: 'text' }
		]
	};

	let mockHeadingFields = [
		{ name: 'field1', primary: false, text: true, type: 'text' },
		{ name: 'field2', primary: true, text: true, type: 'text' },
		{ name: 'field3', primary: false, text: false, type: 'number' }
	];

	let mockFormattedProducts: Array<any> = [
		{
			id: 'id1',
			productName: 'product1',
			data: [
				{ name: 'field1', value: 'unit1', text: true },
				{ name: 'field2', value: 30, text: false },
				{ name: 'field2', value: 'vendor1', text: true }
			]
		},
		{
			id: 'id2',
			productName: 'product2',
			data: [
				{ name: 'field1', value: 'unit2', text: true },
				{ name: 'field2', value: 30, text: false },
				{ name: 'field2', value: 'vendor2', text: true }
			]
		},
		{
			id: 'id3',
			productName: 'product3',
			data: [
				{ name: 'field1', value: 'unit3', text: true },
				{ name: 'field2', value: 30, text: false },
				{ name: 'field2', value: 'vendor3', text: true }
			]
		},
		{
			id: 'id4',
			productName: 'product4',
			data: [
				{ name: 'field1', value: 'unit4', text: true },
				{ name: 'field2', value: 30, text: false },
				{ name: 'field2', value: 'vendor4', text: true }
			]
		},
		{
			id: 'id5',
			productName: 'product5',
			data: [
				{ name: 'field1', value: 'unit5', text: true },
				{ name: 'field2', value: 30, text: false },
				{ name: 'field2', value: 'vendor5', text: true }
			]
		},
		{
			id: 'id6',
			productName: 'product6',
			data: [
				{ name: 'field1', value: 'unit6', text: true },
				{ name: 'field2', value: 30, text: false },
				{ name: 'field2', value: 'vendor6', text: true }
			]
		},
		{
			id: 'id10',
			productName: 'product10',
			data: [
				{ name: 'field1', value: 'unit10', text: true },
				{ name: 'field2', value: 30, text: false },
				{ name: 'foobar', value: 'vendor10', text: true }
			]
		}
	];

	let mockActivatedRoute = {
		params: of({ id: 'bookId' })
	};

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
				declarations: [
					BookEditComponent,
					NoHeaderDialog,
					AddHeadingFieldDialog,
					AddProductDialog,
					...routingComponents
				],
				schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
				providers: [
					{ provide: UserService, useClass: MockUserService },
					{ provide: SheetService, useClass: MockSheetService },
					{ provide: ActivatedRoute, useValue: mockActivatedRoute },
					{ provide: BookService, useClass: MockBookService }
				]
			})
				.overrideModule(BrowserDynamicTestingModule, {
					set: {
						entryComponents: [ NoHeaderDialog, AddHeadingFieldDialog, AddProductDialog ]
					}
				})
				.compileComponents();
		})
	);

	beforeEach(async () => {
		fixture = TestBed.createComponent(BookEditComponent);
		component = fixture.componentInstance;
		de = fixture.debugElement;
		fixture.detectChanges();
		dialog = de.injector.get(MatDialog);
		dialogSpy = spyOn(dialog, 'open').and.callFake(() => {
			return <any>true;
		});
		fixture.whenStable();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	// Test DOM elements
	it('should have a "save name" button rendered to the DOM', () => {
		component.contentLoading = false;
		fixture.detectChanges();
		expect(de.query(By.css('#save-name-button'))).toBeTruthy();
	});

	it('should have a book name input rendered to the DOM', () => {
		component.contentLoading = false;
		fixture.detectChanges();
		expect(de.query(By.css('#book-name-input'))).toBeTruthy();
	});

	it('should have an "add field" button rendered to the DOM', () => {
		component.contentLoading = false;
		fixture.detectChanges();
		expect(de.query(By.css('#add-field-button'))).toBeTruthy();
	});

	it('should have an "add product" button rendered to the DOM', () => {
		component.contentLoading = false;
		fixture.detectChanges();
		expect(de.query(By.css('#add-product-button'))).toBeTruthy();
	});

	it('should have a all default products rendered to the DOM', () => {
		component.contentLoading = false;
		component.formattedProducts = mockFormattedProducts;
		fixture.detectChanges();
		expect(de.queryAll(By.css('.product')).length).toEqual(component.formattedProducts.length);
	});

	it('should have a all heading fields rendered to the DOM', () => {
		component.contentLoading = false;
		component.headingFields = mockBookData.headingFields;
		fixture.detectChanges();
		expect(de.queryAll(By.css('.heading-field')).length).toEqual(component.headingFields.length);
	});

	// Test Component

	it('should have the current book ID as a public string variable', () => {
		expect(component.bookId).toBeDefined();
		expect(typeof component.bookId).toEqual('string');
	});

	it('should have the current book name as a public string variable', () => {
		expect(component.bookName).toBeDefined();
		expect(typeof component.bookName).toEqual('string');
	});

	it('should have formatted book data as a public array variable', () => {
		expect(component.formattedProducts).toBeDefined();
		expect(Array.isArray(component.formattedProducts)).toBeTruthy();
	});

	it('should have current book heading fields as a public array variable', () => {
		expect(component.headingFields).toBeDefined();
		expect(Array.isArray(component.headingFields)).toBeTruthy();
	});

	it('should have current book default products as a public array variable', () => {
		expect(component.defaultProducts).toBeDefined();
		expect(Array.isArray(component.defaultProducts)).toBeTruthy();
	});

	it('should have the current user permissions level as a public string variable', () => {
		expect(component.permissions).toBeDefined();
		expect(typeof component.permissions).toEqual('string');
	});

	it('should have a "set and format default products" function', () => {
		expect(component.setAndFormatDefaultProducts).toBeTruthy();
		expect(typeof component.setAndFormatDefaultProducts).toEqual('function');
	});

	it('should have a "set and format default products" function that sets missing field values for products', () => {
		component.defaultProducts = [];
		component.formattedProducts = [];
		component.headingFields = mockBookData.headingFields;
		component.setAndFormatDefaultProducts([
			{ id: 'id1', field1: undefined, field2: 30, field3: 'value1' },
			{ id: 'id2', field1: 'value2', field2: undefined, field3: 'value3' }
		]);
		fixture.detectChanges();
		expect(component.defaultProducts.length).toEqual(2);
		expect(component.formattedProducts.length).toEqual(2);
	});

	it('should have a "set and format default products" function that sets missing field values for products', () => {
		component.headingFields = mockBookData.headingFields;
		component.setAndFormatDefaultProducts([
			{ id: 'id1', field1: undefined, field2: 30, field3: 'value1' },
			{ id: 'id2', field1: 'value2', field2: undefined, field3: 'value3' }
		]);
		fixture.detectChanges();
		expect(component.defaultProducts[0].field1 != undefined).toBeTruthy();
		expect(component.defaultProducts[0].field1).toEqual('[No value]');
		expect(component.defaultProducts[1].field2 != undefined).toBeTruthy();
		expect(component.defaultProducts[1].field2).toEqual(0);
	});

	it('should have a "process heading fields" function', () => {
		expect(component.processHeadingFields).toBeTruthy();
		expect(typeof component.processHeadingFields).toEqual('function');
	});

	it('should have a "process heading fields" function that returns an array', () => {
		let newFields = component.processHeadingFields(mockHeadingFields);
		expect(newFields).toBeTruthy();
		expect(Array.isArray(newFields)).toBeTruthy();
	});

	it('should have a "process heading fields" function that leaves the primary field at index 0 in the returned array', () => {
		let newFields = component.processHeadingFields(mockHeadingFields);
		expect(newFields[0].primary).toBeTruthy();
	});

	it('should have a "save name" function', () => {
		expect(component.saveName).toBeTruthy();
		expect(typeof component.saveName).toEqual('function');
	});

	it('should have a "save name" function that sets the updateNameSuccess variable to true when valid args are passed in', async () => {
		component.bookId = 'bookId';
		component.permissions = 'admin';
		fixture.detectChanges();
		await component.saveName('new name');
		expect(component.updateNameSuccess).toBeTruthy();
		expect(component.updateNameFailure).toBeFalsy();
	});

	it('should have a "save name" function that sets the updateNameSuccess variable to true when valid args are passed in', async () => {
		component.bookId = 'bookId';
		component.permissions = 'admin';
		fixture.detectChanges();
		await component.saveName('');
		expect(component.updateNameFailure).toBeTruthy();
		expect(component.updateNameSuccess).toBeFalsy();
		await component.saveName(undefined);
		expect(component.updateNameFailure).toBeTruthy();
		expect(component.updateNameSuccess).toBeFalsy();
	});

	it('should have a "hide update messages" function', () => {
		expect(component.hideUpdateMessages).toBeTruthy();
		expect(typeof component.hideUpdateMessages).toEqual('function');
		component.contentLoading = false;
		component.updateNameFailure = true;
		component.updateNameSuccess = true;
		fixture.detectChanges();
		expect(component.updateNameFailure).toBeTruthy();
		expect(component.updateNameSuccess).toBeTruthy();

		component.hideUpdateMessages();
		fixture.detectChanges();
		expect(component.updateNameFailure).toBeFalsy();
		expect(component.updateNameSuccess).toBeFalsy();
	});

	it('should have a "edit field" function', () => {
		expect(component.editField).toBeTruthy();
		expect(typeof component.editField).toEqual('function');
	});

	it('should have a "edit field" function that opens the injected MatDialog object with the EditFieldDialog component', () => {
		component.headingFields = <Array<any>>[];
		component.defaultProducts = <Array<any>>[];
		component.bookId = 'bookId';
		component.permissions = 'permissions';
		fixture.detectChanges();
		component.editField({ data: 'value' });
		expect(dialogSpy).toHaveBeenCalled();
		expect(dialogSpy).toHaveBeenCalledWith(EditFieldDialog, <any>{
			width: '380px',
			data: {
				field: { data: 'value' },
				headingFields: component.headingFields,
				products: component.defaultProducts,
				bookId: component.bookId,
				permissions: component.permissions
			}
		});
	});

	it('should have a "add field" function', () => {
		expect(component.addField).toBeTruthy('function');
		expect(typeof component.addField).toEqual('function');
	});

	it('should have a "add field" function that opens the injected MatDialog object with the AddHeadingFieldDialog component', () => {
		component.bookId = 'bookId';
		component.permissions = 'permissions';
		component.headingFields = <Array<any>>[];
		component.defaultProducts = <Array<any>>[];
		fixture.detectChanges();
		component.addField();
		expect(dialogSpy).toHaveBeenCalled();
		expect(dialogSpy).toHaveBeenCalledWith(AddHeadingFieldDialog, <any>{
			width: '380px',
			data: <any>{
				name: new String(),
				bookId: component.bookId,
				headingFields: component.headingFields,
				products: component.defaultProducts,
				permissions: component.permissions
			}
		});
	});

	it('should have a "edit product" function', () => {
		expect(component.editProduct).toBeTruthy();
		expect(typeof component.editProduct).toEqual('function');
	});

	it('should have a "edit product" function that opens the injected MatDialog object with the EditProductDialog component', () => {
		component.headingFields = <Array<any>>[];
		component.bookId = 'bookId';
		component.permissions = 'permissions';
		fixture.detectChanges();
		component.editProduct({ data: 'value' });
		expect(dialogSpy).toHaveBeenCalled();
		expect(dialogSpy).toHaveBeenCalledWith(EditProductDialog, <any>{
			width: '380px',
			data: {
				title: 'Edit product',
				headingFields: component.headingFields,
				product: { data: 'value' },
				bookId: component.bookId,
				permissions: component.permissions
			}
		});
	});

	it('should have an "add product" function', () => {
		expect(component.addProduct).toBeTruthy();
		expect(typeof component.addProduct).toEqual('function');
	});

	it('should have an "add product" function that opens the injected MatDialog object with the AddProductDialog component when heading fields exist', () => {
		component.headingFields = mockHeadingFields;
		let calledFields = new Array();
		for (let i = 0; i < mockHeadingFields.length; i++) {
			let field: any = { ...mockHeadingFields[i] };
			field.value = field.text ? '[No Value]' : 0;
			calledFields.push(field);
		}
		component.bookId = 'bookId';
		component.permissions = 'permissions';
		component.addProduct();
		expect(dialogSpy).toHaveBeenCalled();
		expect(dialogSpy).toHaveBeenCalledWith(AddProductDialog, <any>{
			width: '380px',
			data: {
				bookId: component.bookId,
				formattedData: calledFields,
				permissions: component.permissions
			}
		});
	});

	it('should have an "add product" function that opens the injected MatDialog object with the AddProductDialog component when heading fields exist', () => {
		component.permissions = 'permissions';
		fixture.detectChanges();
		component.addProduct();
		expect(dialogSpy).toHaveBeenCalled();
		expect(dialogSpy).toHaveBeenCalledWith(NoHeaderDialog, <any>{
			width: '380px',
			data: {
				permissions: component.permissions
			}
		});
	});
});
