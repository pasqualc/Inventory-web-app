import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { Observable, of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SheetEditComponent } from './sheet-edit.component';
import { MaterialModule } from '../material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserService } from '../services/user.service';
import { routes } from '../app-routing.module';
import { BooksViewComponent } from '../books-view/books-view.component';
import { ManageUsersComponent } from '../manage-users/manage-users.component';
import { BooksListComponent } from '../books-list/books-list.component';
import { SheetsViewComponent } from '../sheets-view/sheets-view.component';
import { BookEditComponent } from '../book-edit/book-edit.component';
import { LoginComponent } from '../login/login.component';
import { SheetService } from '../services/sheet.service';
import { ProductService } from '../services/product.service';
import { SheetParseService } from '../services/sheet.parse.service';
import { MatDialog } from '@angular/material';
import { BackendTestComponent } from '../backend-test/backend-test.component';
import {
	AddProductDialog,
	EditFieldDialog,
	EditProductDialog,
	AddHeadingFieldDialog
} from '../dialogs/dialogs.component';

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

export interface HeadingField {
	name: string;
	text: boolean;
}

export interface Book {
	id: string;
	productName: string;
	headingFields: Array<HeadingField>;
}

class MockActivatedRoute {
	params = of({ id: 'sheetId', book: 'bookId' });
}

class MockSheetParseService {
	formatProducts(products: Array<any>, headingFields: Array<any>) {
		return new Array();
	}
}

class MockSheetService {
	getSheetDocument(bookId: string, sheetId: string) {
		try {
			if (!bookId || !sheetId) throw new Error('invalid args');
			return <Observable<any>>of({
				name: 'sheet1',
				headingFields: [
					{ name: 'field1', primary: true, text: true, type: 'text' },
					{ name: 'field2', primary: false, text: true, type: 'text' }
				]
			});
		} catch (error) {
			return <Observable<any>>of(false);
		}
	}

	updateSheetName(bookId: string, sheetId: string, name: string) {
		return new Promise((resolve, reject) => {
			try {
				if (!bookId || !sheetId || !name) throw new Error('invalid args');
				resolve(true);
			} catch (error) {
				resolve(false);
			}
		});
	}
}

class MockProductService {
	getProductsCollection(bookId: string, sheetId: string) {
		try {
			if (!bookId || !sheetId) throw new Error('invalid args');
			return <Observable<any>>of([
				{ id: 'id1', data: 'value' },
				{ id: 'id2', data: 'value' },
				{ id: 'id3', data: 'value' }
			]);
		} catch (error) {
			return <Observable<any>>of(false);
		}
	}
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

describe('SheetComponent', () => {
	let component: SheetEditComponent;
	let de: DebugElement;
	let fixture: ComponentFixture<SheetEditComponent>;
	let router: Router;
	let routerSpy: any;
	let dialog: MatDialog;
	let dialogSpy: any;

	let mockHeadingFields = [
		{ name: 'field1', primary: true, text: true, type: 'text' },
		{ name: 'field2', primary: false, text: true, type: 'text' },
		{ name: 'field3', primary: false, text: false, type: 'number' }
	];

	let mockProducts = [
		{ field1: 'vvalue', field2: 'value', field3: 1 },
		{ field1: 'evalue', field2: 'value', field3: 1 },
		{ field1: 'avalue', field2: 'value', field3: 1 }
	];

	let mockSheetData: any = {
		id: 'sheetId',
		name: 'sheet1',
		headingFields: [
			{ name: 'afield1', primary: true, text: true, type: 'text' },
			{ name: 'zfield2', primary: false, text: false, type: 'number' },
			{ name: 'xfield3', primary: false, text: true, type: 'text' }
		]
	};

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

	beforeEach(
		async(() => {
			TestBed.configureTestingModule({
				imports: [
					RouterTestingModule.withRoutes(routes),
					MaterialModule,
					FormsModule,
					BrowserAnimationsModule
				],
				declarations: [ SheetEditComponent, ...routingComponents ],
				schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
				providers: [
					{ provide: ActivatedRoute, useClass: MockActivatedRoute },
					{ provide: SheetParseService, useClass: MockSheetParseService },
					{ provide: SheetService, useClass: MockSheetService },
					{ provide: ProductService, useClass: MockProductService },
					{ provide: UserService, useClass: MockUserService }
				]
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(SheetEditComponent);
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
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	// Test DOM elements

	it('should have the book ID in a public string variable', () => {
		expect(component.bookId).toBeDefined();
		expect(typeof component.bookId).toEqual('string');
	});

	it('should have the default products in a public array variable', () => {
		expect(component.defaultProducts).toBeDefined();
		expect(Array.isArray(component.defaultProducts)).toBeTruthy();
	});

	it('should have the formatted products in a public array variable', () => {
		expect(component.formattedProducts).toBeDefined();
		expect(Array.isArray(component.formattedProducts)).toBeTruthy();
	});

	it('should have the heading fields in a public array variable', () => {
		expect(component.headingFields).toBeDefined();
		expect(Array.isArray(component.headingFields)).toBeTruthy();
	});

	it('should have the products in a public array variable', () => {
		expect(component.products).toBeDefined();
		expect(Array.isArray(component.products)).toBeTruthy();
	});

	it('should have the current user permissions level in a public string variable', () => {
		expect(component.permissions).toBeDefined();
		expect(typeof component.bookId).toEqual('string');
	});

	it('should have the sheet ID in a public string variable', () => {
		expect(component.sheetId).toBeDefined();
		expect(typeof component.sheetId).toEqual('string');
	});

	it('should have the sheet name in a public string variable', () => {
		expect(component.sheetName).toBeDefined();
		expect(typeof component.sheetName).toEqual('string');
	});

	it('should have the sort order in a public string variable', () => {
		expect(component.sortOrder).toBeDefined();
		expect(typeof component.sortOrder).toEqual('string');
	});

	it('should have a "save name" button rendered to the DOM', () => {
		component.contentLoading = false;
		fixture.detectChanges();
		expect(de.query(By.css('#save-name-button'))).toBeTruthy();
	});

	it('should have a function for sorting strings', () => {
		expect(component.compareStr).toBeTruthy();
		expect(typeof component.compareStr).toEqual('function');
	});

	it('should have a function for sorting numbers', () => {
		expect(component.compareNum).toBeTruthy();
		expect(typeof component.compareNum).toEqual('function');
	});

	it('should have a sheet name input rendered to the DOM', () => {
		component.contentLoading = false;
		fixture.detectChanges();
		expect(de.query(By.css('#sheet-name-input'))).toBeTruthy();
	});

	it('should have an "add field" button rendered to the DOM', () => {
		component.contentLoading = false;
		component.permissions = 'admin';
		fixture.detectChanges();
		expect(de.query(By.css('#add-field-button'))).toBeTruthy();
	});

	it('should have an "add product" button rendered to the DOM', () => {
		component.contentLoading = false;
		fixture.detectChanges();
		expect(de.query(By.css('#add-product-button'))).toBeTruthy();
	});

	it('should have all header fields rendered to the DOM', () => {
		component.handleHeadingFieldsData(mockSheetData.headingFields);
		component.contentLoading = false;
		component.permissions = 'admin';
		fixture.detectChanges();
		expect(de.queryAll(By.css('.heading-field')).length).toEqual(component.headingFields.length);
	});

	it('should have all products rendered to the DOM', () => {
		component.formattedProducts = mockFormattedProducts;
		component.contentLoading = false;
		fixture.detectChanges();
		expect(de.queryAll(By.css('.product')).length).toEqual(component.formattedProducts.length);
	});

	// Test component.ts
	it('should have a "handle heading fields data" function', () => {
		expect(component.handleHeadingFieldsData).toBeTruthy();
		expect(typeof component.handleHeadingFieldsData).toEqual('function');
		component.handleHeadingFieldsData(mockSheetData.headingFields);
		expect(component.headingFields.length).toEqual(mockSheetData.headingFields.length);
		expect(component.headingFields[0].primary).toBeTruthy();
	});

	it('should have a "hide update messages" function', () => {
		expect(component.hideUpdateMessages).toBeTruthy();
		expect(typeof component.hideUpdateMessages).toEqual('function');
		component.updateNameFailure = true;
		component.updateNameSuccess = true;
		component.hideUpdateMessages();
		expect(component.updateNameFailure).toBeFalsy();
		expect(component.updateNameSuccess).toBeFalsy();
	});

	it('should have a "open product create dialog" function', () => {
		expect(component.openProductCreateDialog).toBeTruthy();
		expect(typeof component.openProductCreateDialog).toEqual('function');
	});

	it('should have a "open product create dialog" function which should open the injected MatDialog with the AddProductDialog when there are valid book ID and sheet ID values are passed in', () => {
		let bookId = 'bookId';
		let sheetId = 'sheetId';
		component.bookId = bookId;
		component.sheetId = sheetId;
		component.headingFields = [];
		component.openProductCreateDialog();
		expect(dialogSpy).toHaveBeenCalled();
		expect(dialogSpy).toHaveBeenCalledWith(AddProductDialog, {
			width: '380px',
			data: {
				formattedData: [],
				bookId: bookId,
				sheetId: sheetId
			}
		});
	});

	it('should have a "open product create dialog" function which should not open the injected MatDialog when there are invalid book ID or sheet ID values are passed in', () => {
		component.bookId = undefined;
		component.sheetId = undefined;
		component.headingFields = [];
		component.openProductCreateDialog();
		expect(dialogSpy).toHaveBeenCalledTimes(0);
		component.bookId = '';
		component.sheetId = '';
		component.openProductCreateDialog();
		expect(dialogSpy).toHaveBeenCalledTimes(0);
	});

	it('should have a "save sheet name" function', () => {
		expect(component.saveSheetName).toBeTruthy();
		expect(typeof component.saveSheetName).toEqual('function');
	});

	it('should have a "save sheet name" function which should set "update name success" value to true when valid book ID, sheet ID, and sheet name values are passed in', async () => {
		component.updateNameSuccess = false;
		component.bookId = 'bookId';
		component.sheetId = 'sheetId';
		component.sheetName = 'sheetName';
		await component.saveSheetName();
		expect(component.updateNameSuccess).toBeTruthy();
	});

	it('should have a "save sheet name" function which should set "update name failure" value to true when invalid book ID, sheet ID, or sheet name values are passed in', async () => {
		component.updateNameSuccess = false;
		component.bookId = undefined;
		component.sheetId = 'sheetId';
		component.sheetName = 'sheetName';
		await component.saveSheetName();
		expect(component.updateNameSuccess).toBeFalsy();
		component.bookId = '';
		await component.saveSheetName();
		expect(component.updateNameSuccess).toBeFalsy();
		component.bookId = 'bookId';
		component.sheetId = undefined;
		component.sheetName = 'sheetName';
		await component.saveSheetName();
		expect(component.updateNameSuccess).toBeFalsy();
		component.bookId = 'bookId';
		component.sheetId = '';
		component.sheetName = 'sheetName';
		await component.saveSheetName();
		expect(component.updateNameSuccess).toBeFalsy();
		component.bookId = 'bookId';
		component.sheetId = 'sheetId';
		component.sheetName = undefined;
		await component.saveSheetName();
		expect(component.updateNameSuccess).toBeFalsy();
		component.bookId = 'bookId';
		component.sheetId = 'sheetId';
		component.sheetName = '';
		await component.saveSheetName();
		expect(component.updateNameSuccess).toBeFalsy();
	});

	it('should have an "edit field" function', () => {
		expect(component.editField).toBeTruthy();
		expect(typeof component.editField).toEqual('function');
	});

	it('should have an "edit field" function which should open the injected MatDialog with the EditFieldDIalog component when valid args exist', () => {
		component.headingFields = mockHeadingFields;
		component.products = mockProducts;
		component.bookId = 'bookId';
		component.sheetId = 'sheetId';
		component.permissions = 'admin';
		component.editField(component.headingFields[2]);
		expect(dialogSpy).toHaveBeenCalled();
		expect(dialogSpy).toHaveBeenCalledWith(EditFieldDialog, <any>{
			width: '380px',
			data: {
				field: component.headingFields[2],
				headingFields: component.headingFields,
				products: component.products,
				bookId: component.bookId,
				sheetId: component.sheetId,
				permissions: component.permissions
			}
		});
	});

	it('should have an "edit field" function which should not open the injected MatDialog when invalid args exist', () => {
		component.headingFields = mockHeadingFields;
		component.products = mockProducts;
		component.bookId = 'bookId';
		component.sheetId = 'sheetId';
		component.permissions = 'admin';
		component.editField(undefined);
		expect(dialogSpy).toHaveBeenCalledTimes(0);
		component.headingFields = undefined;
		component.editField(mockHeadingFields[2]);
		expect(dialogSpy).toHaveBeenCalledTimes(0);
		component.headingFields = mockHeadingFields;
		component.products = undefined;
		component.editField(mockHeadingFields[2]);
		expect(dialogSpy).toHaveBeenCalledTimes(0);
		component.products = mockProducts;
		component.bookId = undefined;
		component.editField(mockHeadingFields[2]);
		expect(dialogSpy).toHaveBeenCalledTimes(0);
		component.bookId = 'bookId';
		component.sheetId = undefined;
		component.editField(mockHeadingFields[2]);
		expect(dialogSpy).toHaveBeenCalledTimes(0);
		component.sheetId = 'sheetId';
		component.permissions = undefined;
		component.editField(mockHeadingFields[2]);
		expect(dialogSpy).toHaveBeenCalledTimes(0);
	});

	it('should have an "edit product" function', () => {
		expect(component.editProduct).toBeTruthy();
		expect(typeof component.editProduct).toEqual('function');
	});

	it('should have an "edit product" function which should open the injected MatDialog with the EditProductDialog component when valid args exist', () => {
		component.headingFields = mockHeadingFields;
		component.bookId = 'bookId';
		component.sheetId = 'sheetId';
		component.permissions = 'admin';
		component.editProduct(mockProducts[2]);
		expect(dialogSpy).toHaveBeenCalled();
		expect(dialogSpy).toHaveBeenCalledWith(EditProductDialog, <any>{
			width: '380px',
			data: {
				title: 'Edit product',
				headingFields: component.headingFields,
				product: mockProducts[2],
				bookId: component.bookId,
				sheetId: component.sheetId,
				permissions: component.permissions
			}
		});
	});

	it('should have an "edit product" function which should not open the injected MatDialog component when invalid args exist', () => {
		component.headingFields = mockHeadingFields;
		component.bookId = 'bookId';
		component.sheetId = 'sheetId';
		component.permissions = 'admin';
		component.editProduct(undefined);
		expect(dialogSpy).toHaveBeenCalledTimes(0);
		component.headingFields = undefined;
		component.editProduct(mockProducts[2]);
		expect(dialogSpy).toHaveBeenCalledTimes(0);
		component.headingFields = mockHeadingFields;
		component.bookId = undefined;
		component.editProduct(mockProducts[2]);
		expect(dialogSpy).toHaveBeenCalledTimes(0);
		component.bookId = 'bookId';
		component.sheetId = undefined;
		component.editProduct(mockProducts[2]);
		expect(dialogSpy).toHaveBeenCalledTimes(0);
		component.sheetId = 'sheetId';
		component.permissions = undefined;
		component.editProduct(mockProducts[2]);
		expect(dialogSpy).toHaveBeenCalledTimes(0);
	});

	it('should have an "add header field" function', () => {
		expect(component.addHeaderField).toBeTruthy();
		expect(typeof component.addHeaderField).toEqual('function');
	});

	it('should have an "add header field" function which should open the injected MatDialog with the AddHeadingFieldDialog component when valid args exist', () => {
		component.headingFields = mockHeadingFields;
		component.products = mockProducts;
		component.bookId = 'bookId';
		component.sheetId = 'sheetId';
		component.addHeaderField();
		expect(dialogSpy).toHaveBeenCalled();
		expect(dialogSpy).toHaveBeenCalledWith(AddHeadingFieldDialog, {
			width: '380px',
			data: <any>{
				name: new String(),
				bookId: component.bookId,
				sheetId: component.sheetId,
				headingFields: component.headingFields,
				products: component.products
			}
		});
	});

	it('should have an "edit product" function which should not open the injected MatDialog component when invalid args exist', () => {
		component.headingFields = undefined;
		component.products = mockProducts;
		component.bookId = 'bookId';
		component.sheetId = 'sheetId';
		component.addHeaderField();
		expect(dialogSpy).toHaveBeenCalledTimes(0);
		component.headingFields = mockHeadingFields;
		component.products = undefined;
		component.addHeaderField();
		expect(dialogSpy).toHaveBeenCalledTimes(0);
		component.products = mockProducts;
		component.bookId = undefined;
		component.addHeaderField();
		expect(dialogSpy).toHaveBeenCalledTimes(0);
		component.bookId = 'bookId';
		component.sheetId = undefined;
		component.addHeaderField();
		expect(dialogSpy).toHaveBeenCalledTimes(0);
	});

	it('should have a "sort" function', () => {
		expect(component.sort).toBeTruthy();
		expect(typeof component.sort).toEqual('function');
	});

	it('should have a "sort" function that sorts the products array by vale of the primary heading field', () => {
		component.headingFields = [ ...mockHeadingFields ];
		component.products = [ ...mockProducts ];
		expect(
			component.products[0][mockHeadingFields[0].name] > component.products[1][mockHeadingFields[0].name]
		).toBeTruthy();
		component.sortOrder = 'ascending';
		component.sort();
		expect(
			component.products[0][mockHeadingFields[0].name] < component.products[1][mockHeadingFields[0].name]
		).toBeTruthy();
		component.products = [ ...mockProducts ];
		component.sortOrder = 'descending';
		component.sort();
		expect(
			component.products[0][mockHeadingFields[0].name] > component.products[1][mockHeadingFields[0].name]
		).toBeTruthy();
		component.products = [ ...mockProducts ];
		component.sortOrder = 'none';
		component.sort();
		expect(
			component.products[0][mockHeadingFields[0].name] == mockProducts[0][mockHeadingFields[0].name]
		).toBeTruthy();
	});
});
