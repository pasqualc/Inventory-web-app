import { TestBed } from '@angular/core/testing';
import { SheetParseService } from './sheet.parse.service';

describe('SheetParseService', () => {
	let mockFormattedProducts = [
		{
			id: 'id1',
			productName: 'value',
			data: [
				{ name: 'field1', text: true, value: 'value' },
				{ name: 'field2', text: true, value: 'value' },
				{ name: 'field3', text: false, value: 1 }
			]
		},
		{
			id: 'id2',
			productName: 'value',
			data: [
				{ name: 'field1', text: true, value: 'value' },
				{ name: 'field2', text: true, value: 'value' },
				{ name: 'field3', text: false, value: 1 }
			]
		}
	];

	let mockProducts = [
		{ id: 'id1', field1: 'value', field2: 'value', field3: 1 },
		{ id: 'id2', field1: 'value', field2: 'value', field3: 1 },
		{ id: 'id3', field1: 'value', field2: 'value', field3: 1 }
	];
	let mockHeadingFields = [
		{ name: 'field1', primary: true, type: 'text', text: true },
		{ name: 'field2', primary: false, type: 'text', text: true },
		{ name: 'field3', primary: false, type: 'number', text: false }
	];

	beforeEach(() =>
		TestBed.configureTestingModule({
			providers: [ SheetParseService ]
		})
	);

	it('should be created', () => {
		const service: SheetParseService = TestBed.get(SheetParseService);
		expect(service).toBeTruthy();
	});

	it('should have a "set heading types" function', () => {
		const service: SheetParseService = TestBed.get(SheetParseService);
		expect(service.setHeadingTypes).toBeTruthy();
		expect(typeof service.setHeadingTypes).toEqual('function');
	});

	it('should have a "set heading types" function that returns a new array', () => {
		const service: SheetParseService = TestBed.get(SheetParseService);
		let mockInputFields = [ { text: true, type: undefined }, { text: false, type: undefined } ];
		let updatedFields = service.setHeadingTypes(mockInputFields);
		expect(Array.isArray(updatedFields)).toBeTruthy();
	});

	it('should have a "set heading types" function that sets "type" value according to "text" value', () => {
		const service: SheetParseService = TestBed.get(SheetParseService);
		let mockInputFields = [ { text: true, type: undefined }, { text: false, type: undefined } ];
		let updatedFields = service.setHeadingTypes(mockInputFields);
		expect(updatedFields[0].type).toEqual('text');
		expect(updatedFields[1].type).toEqual('number');
	});

	it('should have a "set heading types" function that does not return elements missing a "text" value', () => {
		const service: SheetParseService = TestBed.get(SheetParseService);
		let mockInputFields = [ { text: true, type: undefined }, { type: undefined } ];
		let updatedFields = service.setHeadingTypes(mockInputFields);
		expect(updatedFields.length).toBeLessThan(mockInputFields.length);
	});

	it('should have a "get parsed product field" function', () => {
		const service: SheetParseService = TestBed.get(SheetParseService);
		expect(service.getParsedProductField).toBeTruthy();
		expect(typeof service.getParsedProductField).toEqual('function');
	});

	it('should have a "get parsed product field" function which should return an array when valid args are passed in', () => {
		const service: SheetParseService = TestBed.get(SheetParseService);
		let parsedField = service.getParsedProductField(
			{ field1: 'value', field2: 'value', field3: 1 },
			{ name: 'field1', text: true, type: 'text' }
		);
		expect(parsedField.name).toBeTruthy();
		expect(parsedField.value).toBeTruthy();
		expect(parsedField.text).toBeTruthy();
	});

	it('should have a "get parsed product field" function which should return falsy data when invalid args are passed in', () => {
		const service: SheetParseService = TestBed.get(SheetParseService);
		let parsedField = service.getParsedProductField(
			{ field1: 'value', field2: 'value', field3: 1 },
			{ name: 'asdf', text: true, type: 'text' }
		);
		expect(parsedField).toBeFalsy();
	});

	it('should have a "format products" function', () => {
		const service: SheetParseService = TestBed.get(SheetParseService);
		expect(service.formatProducts).toBeTruthy();
		expect(typeof service.formatProducts).toEqual('function');
	});

	it('should have a "format products" function that returns an array when valid args are passed in', () => {
		const service: SheetParseService = TestBed.get(SheetParseService);

		let result = service.formatProducts(mockProducts, mockHeadingFields);
		expect(Array.isArray(result)).toBeTruthy();
	});

	it('should have a "format products" function that returns an empty array when arg arrays have length 0 are passed in', () => {
		const service: SheetParseService = TestBed.get(SheetParseService);

		let result: Array<any> = <Array<any>>service.formatProducts([], mockHeadingFields);
		expect(Array.isArray(result)).toBeTruthy();
		expect(result.length).toEqual(0);
		result = <Array<any>>service.formatProducts(mockProducts, []);
		expect(Array.isArray(result)).toBeTruthy();
		expect(result.length).toEqual(0);
		result = <Array<any>>service.formatProducts([], []);
		expect(Array.isArray(result)).toBeTruthy();
		expect(result.length).toEqual(0);
	});

	it('should include and ID value, product name, and an array of formatted data in each element included in the array returned from the "format products" function', () => {
		const service: SheetParseService = TestBed.get(SheetParseService);

		let result = service.formatProducts(mockProducts, mockHeadingFields);
		expect(result[0].id).toBeTruthy();
		expect(result[0].productName).toBeTruthy();
		expect(result[0].data).toBeTruthy;
		expect(Array.isArray(result[0].data)).toBeTruthy;
	});

	it('should have a "format products" function that returns falsy data when invalid args are passed in', () => {
		const service: SheetParseService = TestBed.get(SheetParseService);

		let result = service.formatProducts(undefined, mockHeadingFields);
		expect(result).toBeFalsy();
		result = service.formatProducts(mockProducts, undefined);
		expect(result).toBeFalsy();
	});

	it('should have a "parse products" function', () => {
		const service: SheetParseService = TestBed.get(SheetParseService);
		expect(service.parseProducts).toBeTruthy();
		expect(typeof service.parseProducts).toEqual('function');
	});

	it('should have a "parse products" function that should return an array', () => {
		const service: SheetParseService = TestBed.get(SheetParseService);
		let result = service.parseProducts(mockFormattedProducts);
		expect(result).toBeTruthy();
		expect(Array.isArray(result));
		result = service.parseProducts([]);
		expect(result).toBeTruthy();
		expect(Array.isArray(result));
		result = service.parseProducts(undefined);
		expect(result).toBeTruthy();
		expect(Array.isArray(result));
	});

	it('should have a "get product IDs" function', () => {
		const service: SheetParseService = TestBed.get(SheetParseService);
		expect(service.getProductIds).toBeTruthy();
		expect(typeof service.getProductIds).toEqual('function');
	});

	it('should have a "get product IDs" function that returns array of product IDs taken from input array', () => {
		const service: SheetParseService = TestBed.get(SheetParseService);
		let productIds = service.getProductIds(mockProducts);
		expect(productIds.length).toEqual(mockProducts.length);
		let validIds = true;
		mockProducts.forEach((product) => {
			if (!productIds.includes(product.id)) validIds = false;
		});
		expect(validIds).toBeTruthy();
	});

	it('should have a "get product IDs" function that returns array even if the input array is undefined or empty', () => {
		const service: SheetParseService = TestBed.get(SheetParseService);
		let productIds = service.getProductIds([]);
		expect(Array.isArray(productIds)).toBeTruthy();
		expect(productIds.length).toEqual(0);
		productIds = service.getProductIds(undefined);
		expect(Array.isArray(productIds)).toBeTruthy();
		expect(productIds.length).toEqual(0);
	});
});
