import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { SheetsViewComponent } from './sheets-view.component';
import { Observable, of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialModule } from '../material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SheetParseService } from '../services/sheet.parse.service';
import { UserService } from '../services/user.service';
import { routes } from '../app-routing.module';
import { LoginComponent } from '../login/login.component';
import { SheetEditComponent } from '../sheet-edit/sheet-edit.component';
import { BooksListComponent } from '../books-list/books-list.component';
import { BooksViewComponent } from '../books-view/books-view.component';
import { BookEditComponent } from '../book-edit/book-edit.component';
import { ManageUsersComponent } from '../manage-users/manage-users.component';
import { FormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';
import { SheetService } from '../services/sheet.service';
import { ProductService } from '../services/product.service';
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

export interface HeadingField {
	name: string;
	text: boolean;
}

class MockSheetParseService {
	mockFormattedProducts: Array<any> = [
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

	formatProducts(mockBookData: Array<any>, headingFields: Array<any>) {
		return this.mockFormattedProducts;
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
		return 'adminToken';
		// return 'userToken';
	}

	updateUserToken(token: string) {
		return token;
	}

	removeUserToken() {
		return true;
	}
}

class MockSheetService {
	mockSheetData: any = {
		id: 'bookId',
		name: 'sheet1',
		headingFields: [
			{ name: 'field1', text: true, type: 'text' },
			{ name: 'field2', text: false, type: 'number' },
			{ name: 'field3', text: true, type: 'text' }
		]
	};
	getSheetDocument() {
		return of(this.mockSheetData);
	}
}

class MockProductService {
	mockProductData: Array<any> = [
		{ id: 'id1', productName: 'product1', field1: 'unit1', field2: 30, field3: undefined },
		{ id: 'id2', productName: 'product2', field1: 'unit2', field2: 30, field3: 'vendor2' },
		{ id: 'id3', productName: 'product3', field1: 'unit3', field2: 30, field3: 'vendor3' },
		{ id: 'id4', productName: 'product4', field1: 'unit4', field2: 30, field3: 'vendor4' },
		{ id: 'id5', productName: 'product5', field1: 'unit5', field2: 30, field3: 'vendor5' },
		{ id: 'id6', productName: 'product6', field1: 'unit6', field2: 30, field3: 'vendor6' },
		{ id: 'id10', productName: 'product10', foobar: 'unit10', field2: 30, field3: 'vendor10' }
	];

	getProductsCollection(bookId: string, sheetId: string) {
		try {
			if (!bookId || !sheetId) throw new Error('invalid args');
			return <Observable<any>>of([
				{ id: 'id1', data: 'value' },
				{ id: 'id2', data: 'value' },
				{ id: 'id2', data: 'value' }
			]);
		} catch (error) {
			return <Observable<any>>of(false);
		}
	}
}

class MockActivatedRoute {
	params = of({ id: 'sheetId', book: 'bookId' });
}

describe('SheetsViewComponent', () => {
	let component: SheetsViewComponent;
	let de: DebugElement;
	let fixture: ComponentFixture<SheetsViewComponent>;
	let router: Router;
	let routerSpy: any;

	let mockHeadingFields: Array<any> = [
		{ name: 'field1', primary: false, type: 'text', text: true },
		{ name: 'field2', primary: false, type: 'number', text: false },
		{ name: 'field3', primary: true, type: 'text', text: true }
	];

	beforeEach(
		async(() => {
			TestBed.configureTestingModule({
				providers: [
					{ provide: ActivatedRoute, useClass: MockActivatedRoute },
					{ provide: SheetParseService, useClass: MockSheetParseService },
					{ provide: SheetService, useClass: MockSheetService },
					{ provide: ProductService, useClass: MockProductService },
					{ provide: UserService, useClass: MockUserService }
				],
				imports: [
					RouterTestingModule.withRoutes(routes),
					MaterialModule,
					BrowserAnimationsModule,
					FormsModule,
					MatSortModule,
					HttpClientTestingModule
				],
				declarations: [ SheetsViewComponent, ...routingComponents ],
				schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(SheetsViewComponent);
		component = fixture.componentInstance;
		de = fixture.debugElement;
		fixture.detectChanges();
		router = de.injector.get(Router);
		routerSpy = spyOn(router, 'navigate').and.callFake(() => {
			return <any>true;
		});
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	// Test DOM elements

	it('should have table column for each heading field', () => {
		expect(de.queryAll(By.css('.field-head')).length).toEqual(component.headingFields.length);
	});

	it('should have a table for displaying sheet data', () => {
		component.contentLoading = false;
		fixture.detectChanges();
		expect(de.query(By.css('#products-table'))).toBeTruthy();
	});

	// // Test component.ts

	it('should have current book ID in a public string variable', () => {
		expect(component.bookId).toBeDefined();
		expect(typeof component.bookId).toEqual('string');
	});

	it('should have current sheet heading field data in a public array variable', () => {
		expect(component.headingFields).toBeDefined();
		expect(Array.isArray(component.headingFields)).toBeTruthy();
	});

	it('should have product data in a public array variable', () => {
		expect(component.products).toBeDefined();
		expect(Array.isArray(component.products)).toBeTruthy();
	});

	it('should have current user permissions level in a public string variable', () => {
		expect(component.permissions).toBeDefined();
		expect(typeof component.permissions).toEqual('string');
	});

	it('should have current user sheet ID in a public string variable', () => {
		expect(component.sheetId).toBeDefined();
		expect(typeof component.sheetId).toEqual('string');
	});

	it('should have current sheet product data sorted in a public array variable', () => {
		expect(component.sortedProducts).toBeDefined();
		expect(Array.isArray(component.sortedProducts)).toBeTruthy();
	});

	it('should have a "set product data" function to assign a value to missing fields', () => {
		component.products = undefined;
		component.sortedProducts = undefined;
		let processedProducts = component.processProducts(
			[
				{ id: 'id1', productName: 'product1', field1: 'unit1', field2: 30, field3: undefined },
				{ id: 'id1', productName: 'product1', field1: 'unit1', field2: undefined, field3: 'value3' }
			],
			mockHeadingFields
		);
		expect(processedProducts[0].field3).toEqual('[NO VALUE]');
		expect(processedProducts[1].field2).toEqual(0);
	});

	it('should have an Router injected into it', () => {
		expect(component.router).toBeTruthy();
	});

	it('should have an ActivatedRoute injected into it', () => {
		expect(component.route).toBeTruthy();
	});

	it('should have the sheet parse service injected into it', () => {
		expect(component.sp).toBeTruthy();
	});

	it('should have the sheet service injected into it', () => {
		expect(component.sheetService).toBeTruthy();
	});

	it('should have the product service injected into it', () => {
		expect(component.productService).toBeTruthy();
	});

	it('should have the user service injected into it', () => {
		expect(component.userService).toBeTruthy();
	});

	it('should have an "edit sheet" function', () => {
		expect(component.editSheet).toBeTruthy();
		expect(typeof component.editSheet).toEqual('function');
	});

	it('should have a "sort data" function', () => {
		expect(component.sortData).toBeTruthy();
		expect(typeof component.sortData).toEqual('function');
	});

	it('should have a "compare string" function for sorting product data', () => {
		expect(component.compareStr).toBeTruthy();
		expect(typeof component.compareStr).toEqual('function');
	});

	it('should have a "compare number" function for sorting product data', () => {
		expect(component.compareNum).toBeTruthy();
		expect(typeof component.compareNum).toEqual('function');
	});
});
