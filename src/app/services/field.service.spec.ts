import { TestBed } from '@angular/core/testing';
import { FieldService } from './field.service';
import { FirebaseService } from './firebase.service';
import { SheetParseService } from './sheet.parse.service';
class mockFirebaseService {
	updateSheetHeader(bookId: string, sheetId: string, updatedFields: Array<any>) {
		return new Promise((resolve, reject) => {
			if (bookId.length > 0 && sheetId.length) resolve(true);
			else reject(new Error('invalid args'));
		});
	}

	updateSheetProducts(bookId: string, sheetId: string, updatedProducts: Array<any>) {
		return new Promise((resolve, reject) => {
			if (bookId.length > 0 && sheetId.length) resolve(true);
			else reject(new Error('invalid args'));
		});
	}

	updateBookHeader(bookId: string, updatedFields: Array<any>) {
		return new Promise((resolve, reject) => {
			if (bookId.length) resolve(true);
			else reject(new Error('invalid args'));
		});
	}

	updateBookProducts(bookId: string, updatedProducts: Array<any>) {
		return new Promise((resolve, reject) => {
			if (bookId.length) resolve(true);
			else reject(new Error('invalid args'));
		});
	}
}

class mockSheetParseService {
	formatProducts(products: Array<any>, headingFields: Array<any>) {
		if (products && headingFields)
			return [
				{ data: 'product1', productName: 'value1', id: 'id1' },
				{ data: 'product2', productName: 'value2', id: 'id2' },
				{ data: 'product3', productName: 'value3', id: 'id3' }
			];
		else return [];
	}

	parseProducts(formattedProducts: Array<any>) {
		if (formattedProducts)
			return [
				{ field1: 'product1', field2: 'value1', field3: 1 },
				{ fiedl1: 'product2', field2: 'value2', field3: 2 },
				{ field1: 'product3', field2: 'value3', field3: 3 }
			];
		else [];
	}
}

describe('FieldService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				{ provide: FirebaseService, useClass: mockFirebaseService },
				{ provide: SheetParseService, useClass: mockSheetParseService }
			]
		});
	});

	it('should be created', () => {
		const service = TestBed.get(FieldService);

		expect(service).toBeTruthy();
	});

	it('should have a "delete field" function that resolves with truthy result when called with appropriate data', async () => {
		const service = TestBed.get(FieldService);

		expect(service.deleteField).toBeTruthy();
		expect(typeof service.deleteField).toEqual('function');

		const result1 = await service.deleteField(
			'bookid',
			'sheetid',
			{ name: 'fieldToRemove' },
			[ { name: 'field1' } ],
			[ { name: 'product1' } ]
		);
		expect(result1).toBeTruthy();

		const result2 = await service.deleteField(
			'bookid',
			undefined,
			{ name: 'fieldToRemove' },
			[ { name: 'field1' } ],
			[ { name: 'product1' } ]
		);
		expect(result2).toBeTruthy();

		const result3 = await service.deleteField(undefined, undefined, undefined, undefined, undefined);
		expect(result3).toBeFalsy();
	});

	it('should have a "remove field" function that removes any matching object from array', () => {
		const service = TestBed.get(FieldService);

		expect(service.removeFieldFromFields).toBeTruthy();
		expect(typeof service.removeFieldFromFields).toEqual('function');
		let headingFields = [ { name: 'goodField1' }, { name: 'goodField2' }, { name: 'badField' } ];
		let fieldToRemove = headingFields[2];
		let updatedHeadingFields = service.removeFieldFromFields(headingFields, fieldToRemove);

		expect(Array.isArray(updatedHeadingFields)).toBeTruthy();
		expect(updatedHeadingFields.length).toBeLessThan(headingFields.length);
	});

	it('should have an "remove field from products" function that updates product data', () => {
		const service = TestBed.get(FieldService);

		expect(service.removeFieldFromProducts).toBeTruthy();
		expect(typeof service.removeFieldFromProducts).toEqual('function');
		let fieldToRemove = { name: 'field2remove' };
		let products = [
			{ field1: 'adsf', field2remove: 'asdf' },
			{ field1: 'adsf', field2remove: 'asdf' },
			{ field1: 'adsf', field2remove: 'asdf' }
		];
		let updatedProducts = service.removeFieldFromProducts(products, fieldToRemove);
		let fieldIsRemoved = true;
		updatedProducts.forEach((product: any) => {
			if (product[fieldToRemove.name]) fieldIsRemoved = false;
		});
		expect(fieldIsRemoved).toBeTruthy();
	});

	it('should have a "save field" function that resolves with truthy data when called with valid data', async () => {
		const service = TestBed.get(FieldService);

		let headingFields = [
			{ name: 'field1', primary: true, text: true, type: 'text' },
			{ name: 'field2', primary: false, text: true, type: 'text' },
			{ name: 'field3', primary: false, text: false, type: 'number' }
		];
		let originalFieldData = headingFields[1];
		let fieldToUpdate = { name: 'newField', primary: true, text: true, type: 'text' };
		let products = [
			{ field1: 'product1', field2: 'value1', field3: 1 },
			{ fiedl1: 'product2', field2: 'value2', field3: 2 },
			{ field1: 'product3', field2: 'value3', field3: 3 }
		];

		expect(service.saveField).toBeTruthy();
		expect(typeof service.saveField).toEqual('function');
		expect(
			await service.saveField('bookId', 'sheetId', fieldToUpdate, originalFieldData, headingFields, products)
		).toBeTruthy();
		expect(
			await service.saveField('bookId', undefined, fieldToUpdate, originalFieldData, headingFields, products)
		).toBeTruthy();
	});

	it('should have a "save field" function that resolves with falsy data when called with invalid data', async () => {
		const service = TestBed.get(FieldService);

		let headingFields = [
			{ name: 'field1', primary: true, text: true, type: 'text' },
			{ name: 'field2', primary: false, text: true, type: 'text' },
			{ name: 'field3', primary: false, text: false, type: 'number' }
		];
		let originalFieldData = headingFields[1];
		let fieldToUpdate = { name: 'newField', primary: true, text: true, type: 'text' };
		let products = [
			{ field1: 'product1', field2: 'value1', field3: 1 },
			{ fiedl1: 'product2', field2: 'value2', field3: 2 },
			{ field1: 'product3', field2: 'value3', field3: 3 }
		];

		expect(
			await service.saveField(undefined, undefined, fieldToUpdate, originalFieldData, headingFields, products)
		).toBeFalsy();
		expect(
			await service.saveField(undefined, 'sheetid', fieldToUpdate, originalFieldData, headingFields, products)
		).toBeFalsy();
		expect(
			await service.saveField('bookId', 'sheetid', undefined, originalFieldData, headingFields, products)
		).toBeFalsy();
		expect(
			await service.saveField('bookId', 'sheetid', fieldToUpdate, undefined, headingFields, products)
		).toBeFalsy();
		expect(
			await service.saveField('bookId', 'sheetid', fieldToUpdate, originalFieldData, undefined, products)
		).toBeFalsy();
		expect(
			await service.saveField('bookId', 'sheetid', fieldToUpdate, originalFieldData, headingFields, undefined)
		).toBeFalsy();
	});

	it('should have a "replace field in fields" function that replaces old field data with new', () => {
		const service = TestBed.get(FieldService);

		let newField = { name: 'fieldToUpdate', primary: false, type: 'text', text: true };

		let headingFields = [
			{ name: 'field1', primary: true, type: 'text', text: true },
			{ name: 'fieldToUpdate', primary: false, type: 'number', text: false },
			{ name: 'field3', primary: false, type: 'text', text: true }
		];

		let originalData = headingFields[1];

		expect(service.replaceFieldInFields).toBeTruthy();
		expect(typeof service.replaceFieldInFields).toEqual('function');
		expect(
			headingFields[1].name == newField.name &&
				headingFields[1].primary == newField.primary &&
				headingFields[1].type == newField.type &&
				headingFields[1].text == newField.text
		).toBeFalsy();

		let updatedFields = service.replaceFieldInFields(headingFields, originalData, newField);

		expect(
			updatedFields[1].name == newField.name &&
				updatedFields[1].primary == newField.primary &&
				updatedFields[1].type == newField.type &&
				updatedFields[1].text == newField.text
		).toBeTruthy();
	});

	it('should have a "set primary" function that sets only field as primary', () => {
		const service = TestBed.get(FieldService);

		expect(service.setPrimary).toBeTruthy();
		expect(typeof service.setPrimary).toEqual('function');

		let headingFields = [
			{ name: 'field1', primary: true, type: 'text', text: true },
			{ name: 'field2', primary: false, type: 'number', text: false },
			{ name: 'field3', primary: false, type: 'text', text: true }
		];

		let fieldToUpdate1 = headingFields[0];

		let updatedFields = service.setPrimary(headingFields, fieldToUpdate1);

		let numPrimary = 0;
		updatedFields.forEach((field) => {
			if (field.primary) numPrimary++;
		});

		expect(numPrimary).toEqual(1);

		let fieldToUpdate2 = [ 1 ];

		updatedFields = service.setPrimary(headingFields, fieldToUpdate2);

		numPrimary = 0;
		updatedFields.forEach((field) => {
			if (field.primary) numPrimary++;
		});
		expect(numPrimary).toEqual(1);
	});

	it('should have an "update field name" function', () => {
		const service = TestBed.get(FieldService);
		expect(service.updateFieldName).toBeTruthy();
		expect(typeof service.updateFieldName).toEqual('function');
	});

	it('should have an "update field name" function that replaces the name of a field with a new value', () => {
		const service = TestBed.get(FieldService);
		let fieldToChange = { name: 'updated', primary: true, type: 'text', text: true };
		let originalFieldData = { name: 'toupdate', primary: true, type: 'text', text: true };
		let products = [
			{ toupdate: 'value', field: 'value' },
			{ toupdate: 'value', field: 'value' },
			{ toupdate: 'value', field: 'value' },
			{ toupdate: 'value', field: 'value' }
		];

		let updatedProducts = service.updateFieldName(products, fieldToChange, originalFieldData);
		let updateSuccess = true;
		updatedProducts.forEach((product) => {
			if (product[originalFieldData.name]) updateSuccess = false;
			else if (!product[fieldToChange.name]) updateSuccess = false;
		});
		expect(updateSuccess).toBeTruthy();
		fieldToChange.name = 'toupdate';
		products = [
			{ toupdate: 'value', field: 'value' },
			{ toupdate: 'value', field: 'value' },
			{ toupdate: 'value', field: 'value' },
			{ toupdate: 'value', field: 'value' }
		];
		updatedProducts = service.updateFieldName(products, fieldToChange, originalFieldData);
		updateSuccess = true;
		updatedProducts.forEach((product) => {
			if (!product[originalFieldData.name] || !product[fieldToChange.name]) updateSuccess = false;
		});
		expect(updateSuccess).toBeTruthy();
	});
});
