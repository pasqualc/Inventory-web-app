import { TestBed } from '@angular/core/testing';
import { SheetService } from './sheet.service';
import { FirebaseService } from './firebase.service';
import { Observable } from 'rxjs';
import { of } from 'rxjs';

class MockFirebaseService {
	getDefaultProducts(bookId: string) {
		try {
			if (!bookId) throw new Error('invalid args');

			return <Observable<any>>of([ { data: 'value' } ]);
		} catch (error) {
			return;

			<Observable<any>>of(false);
		}
	}

	updateSheetHeader(bookId: string, sheetId: string, headingFields: Array<any>) {
		return new Promise(async (resolve, reject) => {
			try {
				if (!bookId || !sheetId || !headingFields) throw new Error('invalid args');

				resolve(true);
			} catch (error) {
				resolve(false);
			}
		});
	}

	updateSheetProducts(bookId: string, sheetId: string, updatedProducts: Array<any>) {
		return new Promise((resolve, reject) => {
			try {
				if (!bookId || !sheetId || !updatedProducts) throw new Error('invalid args');

				resolve(true);
			} catch (error) {
				resolve(false);
			}
		});
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

	addProduct(product: any, bookId: string, sheetId: string) {
		return new Promise((resolve, reject) => {
			try {
				if (!product || !bookId || !sheetId) throw new Error('invalid args');

				resolve(true);
			} catch (error) {
				resolve(false);
			}
		});
	}

	addSheet(sheetName: string, headingFields: Array<any>, bookId: string) {
		return new Promise((resolve, reject) => {
			try {
				if (!sheetName || !headingFields || !bookId) throw new Error('invalid args');
				resolve('sheetId');
			} catch (error) {
				resolve(false);
			}
		});
	}

	removeSheet(bookId: string, idToRemove: string) {
		return new Promise((resolve, reject) => {
			try {
				if (!bookId || !idToRemove) throw new Error('invalid args');
				resolve(true);
			} catch (error) {
				resolve(false);
			}
		});
	}

	removeProductsCollection(bookId: string, idToRemove: string) {
		return new Promise((resolve, reject) => {
			try {
				if (!bookId || !idToRemove) throw new Error('invalid args');
				resolve(true);
			} catch (error) {
				resolve(false);
			}
		});
	}

	getSheetDocument(bookId: string, sheetId: string) {
		try {
			if (!bookId || !sheetId) throw new Error('invalid args');
			return <Observable<any>>of({ id: 'id1', data: 'value' });
		} catch (error) {
			return <Observable<any>>of(false);
		}
	}

	getSheetCollection(bookId: string) {
		try {
			if (!bookId || !bookId.length) throw new Error('invalid args');
			return <Observable<any>>of([ { id: 'id1', data: 'value' }, { id: 'id2', data: 'value' } ]);
		} catch (error) {
			return <Observable<any>>of(false);
		}
	}
}

describe('SheetService', () => {
	let mockHeadingFields = [
		{ name: 'field1', primary: true, text: true, type: 'text' },
		{ name: 'field2', primary: false, text: true, type: 'text' },
		{ name: 'field3', primary: false, text: false, type: 'number' }
	];

	let mockProducts = [
		{ field1: 'value', field2: 'value', field3: 1 },
		{ field1: 'value', field2: 'value', field3: 1 },
		{ field1: 'value', field2: 'value', field3: 1 }
	];

	beforeEach(() =>
		TestBed.configureTestingModule({
			providers: [ { provide: FirebaseService, useClass: MockFirebaseService } ]
		})
	);

	it('should be created', () => {
		const service: SheetService = TestBed.get(SheetService);
		expect(service).toBeTruthy();
	});

	it('should have a "get sheet document" function', () => {
		const service: SheetService = TestBed.get(SheetService);

		expect(service.getSheetDocument).toBeTruthy();
		expect(typeof service.getSheetDocument).toEqual('function');
	});

	it('should have a "get sheet collection" function', () => {
		const service: SheetService = TestBed.get(SheetService);

		expect(service.getSheetCollection).toBeTruthy();
		expect(typeof service.getSheetCollection).toEqual('function');
	});

	it('should have a "delete sheet" function', () => {
		const service: SheetService = TestBed.get(SheetService);
		expect(service.deleteSheet).toBeTruthy();
		expect(typeof service.deleteSheet).toEqual('function');
	});

	it('should have a "delete sheet" function which should return a promise that resolves with truthy data when valid args are passed in', async () => {
		const service: SheetService = TestBed.get(SheetService);
		let result = await service.deleteSheet('bookId', 'idToRemove');
		expect(result).toBeTruthy();
	});

	it('should have a "delete sheet" function which should return a promise that resolves with falsy data when invalid args are passed in', async () => {
		const service: SheetService = TestBed.get(SheetService);
		let result = await service.deleteSheet(undefined, 'idToRemove');
		expect(result).toBeFalsy();
		result = await service.deleteSheet('', 'idToRemove');
		expect(result).toBeFalsy();
		result = await service.deleteSheet('bookId', undefined);
		expect(result).toBeFalsy();
		result = await service.deleteSheet('bookId', '');
		expect(result).toBeFalsy();
	});

	it('should have an "add sheet" function', () => {
		const service: SheetService = TestBed.get(SheetService);
		expect(service.addSheet).toBeTruthy();
		expect(typeof service.addSheet).toEqual('function');
	});

	it('should have an "add sheet" function which should return promise that resolve with truthy data when valid args are passed in', async () => {
		const service: SheetService = TestBed.get(SheetService);
		let result = await service.addSheet('sheetName', [], 'bookId');
		expect(result).toBeTruthy();
	});

	it('should have an "add sheet" function which should return promise that resolve with falsy data when invalid args are passed in', async () => {
		const service: SheetService = TestBed.get(SheetService);
		let result = await service.addSheet(undefined, [], 'bookId');
		expect(result).toBeFalsy();
		result = await service.addSheet('', [], 'bookId');
		expect(result).toBeFalsy();
		result = await service.addSheet('sheetName', undefined, 'bookId');
		expect(result).toBeFalsy();
		result = await service.addSheet('sheetName', [], undefined);
		expect(result).toBeFalsy();
		result = await service.addSheet('sheetName', [], '');
		expect(result).toBeFalsy();
	});

	it('should have a "get updated heading fields" function', () => {
		const service: SheetService = TestBed.get(SheetService);

		expect(service.getUpdatedHeadingFields).toBeTruthy();
		expect(typeof service.getUpdatedHeadingFields).toBeTruthy();
	});

	it('should have a "get updated heading fields" function that returns an array with new field added if a field with the same name does not already exist in the input headingFields array', () => {
		const service: SheetService = TestBed.get(SheetService);

		let updatedHeadingFields = service.getUpdatedHeadingFields([ ...mockHeadingFields ], 'newField');
		expect(updatedHeadingFields.length).toBeGreaterThan(mockHeadingFields.length);
		expect(Array.isArray(updatedHeadingFields)).toBeTruthy();

		updatedHeadingFields = service.getUpdatedHeadingFields([ ...mockHeadingFields ], 'field1');
		expect(updatedHeadingFields.length).toEqual(updatedHeadingFields.length);
		expect(Array.isArray(updatedHeadingFields)).toBeTruthy();
	});

	it('should have a "get updated heading fields" function that returns an empty array when args are invalid or undefined', () => {
		const service: SheetService = TestBed.get(SheetService);

		let updatedHeadingFields = service.getUpdatedHeadingFields(undefined, 'newField');
		expect(updatedHeadingFields.length).toEqual(0);
		expect(Array.isArray(updatedHeadingFields)).toBeTruthy();

		updatedHeadingFields = service.getUpdatedHeadingFields([], undefined);
		expect(updatedHeadingFields.length).toEqual(0);
		expect(Array.isArray(updatedHeadingFields)).toBeTruthy();

		updatedHeadingFields = service.getUpdatedHeadingFields([], '');
		expect(updatedHeadingFields.length).toEqual(0);
		expect(Array.isArray(updatedHeadingFields)).toBeTruthy();
	});

	it('should have a "get updated products" function', () => {
		const service: SheetService = TestBed.get(SheetService);

		expect(service.getUpdatedProducts).toBeTruthy();
		expect(typeof service.getUpdatedProducts).toBeTruthy();
	});

	it('should have a "get updated products" function that returns an array that asigns a default string value to newFieldName member in all products in input array', () => {
		const service: SheetService = TestBed.get(SheetService);
		let newFieldName = 'newField';
		let isUndefined = true;
		mockProducts.forEach((product) => {
			if (product[newFieldName]) isUndefined = false;
		});
		expect(isUndefined).toBeTruthy();
		let updatedProducts = service.getUpdatedProducts(mockProducts, newFieldName);
		expect(Array.isArray(updatedProducts)).toBeTruthy();
		expect(updatedProducts.length).toEqual(mockProducts.length);
		let isDefined = true;
		updatedProducts.forEach((product) => {
			if (!product[newFieldName]) isDefined = false;
		});
		expect(isDefined).toBeTruthy();
	});

	it('should have a "get updated products" function that returns an empty array  when invalid args are passed in', () => {
		const service: SheetService = TestBed.get(SheetService);

		let updatedProducts = service.getUpdatedProducts(undefined, 'foo');
		expect(Array.isArray(updatedProducts)).toBeTruthy();
		expect(updatedProducts.length).toEqual(0);
		updatedProducts = service.getUpdatedProducts([], undefined);
		expect(Array.isArray(updatedProducts)).toBeTruthy();
		expect(updatedProducts.length).toEqual(0);
		updatedProducts = service.getUpdatedProducts([], '');
		expect(Array.isArray(updatedProducts)).toBeTruthy();
		expect(updatedProducts.length).toEqual(0);
	});

	it('should have a "add sheet header" function', () => {
		const service: SheetService = TestBed.get(SheetService);

		expect(service.addSheetHeader).toBeTruthy();
		expect(typeof service.addSheetHeader).toEqual('function');
	});

	it('should have an "add sheet header" function that returns a promise which should resolve with truthy data when valid args are passed in', async () => {
		const service: SheetService = TestBed.get(SheetService);

		let result = await service.addSheetHeader('bookId', 'sheetId', 'fieldName', mockHeadingFields, mockProducts);
		expect(result).toBeTruthy();
	});

	it('should have an "add sheet header" function that returns a promise which should resolve with falsy data when invalid args are passed in', async () => {
		const service: SheetService = TestBed.get(SheetService);

		let result = await service.addSheetHeader(undefined, 'sheetId', 'fieldName', mockHeadingFields, mockProducts);
		expect(result).toBeFalsy();
		result = await service.addSheetHeader('', 'sheetId', 'fieldName', mockHeadingFields, mockProducts);
		expect(result).toBeFalsy();
		result = await service.addSheetHeader('bookId', undefined, 'fieldName', [], []);
		expect(result).toBeFalsy();
		result = await service.addSheetHeader('bookId', '', 'fieldName', [], []);
		expect(result).toBeFalsy();
		result = await service.addSheetHeader('bookId', 'sheetId', undefined, [], []);
		expect(result).toBeFalsy();
		result = await service.addSheetHeader('bookId', 'sheetId', '', [], []);
		expect(result).toBeFalsy();
		result = await service.addSheetHeader('bookId', 'sheetId', 'fieldName', undefined, []);
		expect(result).toBeFalsy();
		result = await service.addSheetHeader('bookId', 'sheetId', 'fieldName', [], undefined);
		expect(result).toBeFalsy();
	});

	it('should have an "update sheet name" function', () => {
		const service: SheetService = TestBed.get(SheetService);
		expect(service.updateSheetName).toBeTruthy();
		expect(typeof service.updateSheetName).toEqual('function');
	});

	it('should have an "update sheet name" function which returns a promise that should resolve with truthy data when valid args are passed in', async () => {
		const service: SheetService = TestBed.get(SheetService);
		let result = await service.updateSheetName('bookId', 'sheetId', 'name');
		expect(result).toBeTruthy();
	});

	it('should have an "update sheet name" function which returns a promsie that should resolve with falsy data when invalid args are passed in', async () => {
		const service: SheetService = TestBed.get(SheetService);
		let result = await service.updateSheetName(undefined, 'sheetId', 'name');
		expect(result).toBeFalsy();
		result = await service.updateSheetName('', 'sheetId', 'name');
		expect(result).toBeFalsy();
		result = await service.updateSheetName('bookId', undefined, 'name');
		expect(result).toBeFalsy();
		result = await service.updateSheetName('bookId', '', 'name');
		expect(result).toBeFalsy();
		result = await service.updateSheetName('bookId', 'sheetId', undefined);
		expect(result).toBeFalsy();
		result = await service.updateSheetName('bookId', 'sheetId', '');
		expect(result).toBeFalsy();
	});
});
