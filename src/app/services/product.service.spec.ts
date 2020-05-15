import { TestBed } from '@angular/core/testing';
import { ProductService } from './product.service';
import { SheetParseService } from './sheet.parse.service';
import { FirebaseService } from './firebase.service';

class MockSheetParseService {
	parseProducts(formattedProducts: Array<any>) {
		return [ { id: 'id', field1: 'data', field2: 'data', field3: 1 } ];
	}
}

class MockFirebaseService {
	addDefaultProduct(product: any, bookId: string) {
		return new Promise((resolve, reject) => {
			try {
				if (!product || !bookId) throw new Error('invalid args');

				resolve(true);
			} catch (error) {
				resolve(false);
			}
		});
	}

	addProduct(product: any, bookId: string, sheetId: string) {
		return new Promise((resolve, reject) => {
			try {
				if (!product || !bookId || !sheetId) throw new Error('Invalid args');
				resolve(true);
			} catch (error) {
				resolve(false);
			}
		});
	}

	updateSheetProduct(product: any, bookId: string, sheetId: string, productId: string) {
		return new Promise((resolve, reject) => {
			try {
				if (!product || !bookId || !sheetId || !productId) throw new Error('Invalid args');
				resolve(true);
			} catch (error) {
				resolve(false);
			}
		});
	}

	updateDefaultProduct(product: any, bookId: string, productId: string) {
		return new Promise((resolve, reject) => {
			try {
				if (!product || !bookId || !productId) throw new Error('invalid args');
				resolve(true);
			} catch (error) {
				resolve(false);
			}
		});
	}
	removeProduct(productId: string, sheetId: string, bookId: string) {
		return new Promise((resolve, reject) => {
			try {
				if (!productId || !sheetId || !bookId) throw new Error('invalid args');
				resolve(true);
			} catch (error) {
				resolve(false);
			}
		});
	}

	removeDefaultProduct(productId: string, bookId: string) {
		return new Promise((resolve, reject) => {
			try {
				if (!productId || !!bookId) throw new Error('invlaid args');
				resolve(true);
			} catch (error) {
				resolve(false);
			}
		});
	}
}

describe('ProductService', () => {
	beforeEach(() =>
		TestBed.configureTestingModule({
			providers: [
				{ provide: SheetParseService, useClass: MockSheetParseService },
				{ provide: FirebaseService, useClass: MockFirebaseService }
			]
		})
	);

	it('should be created', () => {
		const service: ProductService = TestBed.get(ProductService);
		expect(service).toBeTruthy();
	});

	it('should have a "get products collection" function', () => {
		const service: ProductService = TestBed.get(ProductService);
		expect(service.getProductsCollection).toBeTruthy();
		expect(typeof service.getProductsCollection).toEqual('function');
	});

	it('should have an "add default product" function', () => {
		const service: ProductService = TestBed.get(ProductService);
		expect(service.addDefaultProduct).toBeTruthy();
		expect(typeof service.addDefaultProduct).toEqual('function');
	});

	it('should have an "add default product" function which should return a promise that resolve with truthy data when valid args are passed', async () => {
		const service: ProductService = TestBed.get(ProductService);
		let result = await service.addDefaultProduct('bookId', [ { value: 'value' } ]);
		expect(result).toBeTruthy();
	});

	it('should have an "add default product" function which should return a promise that resolve with falsy data when invalid args are passed', async () => {
		const service: ProductService = TestBed.get(ProductService);
		let result = await service.addDefaultProduct(undefined, []);
		expect(result).toBeFalsy();
		result = await service.addDefaultProduct('', []);
		expect(result).toBeFalsy();
		result = await service.addDefaultProduct('bookId', undefined);
		expect(result).toBeFalsy();
	});

	it('should have an "add product" function', () => {
		const service: ProductService = TestBed.get(ProductService);
		expect(service.addProduct).toBeTruthy();
		expect(typeof service.addProduct).toEqual('function');
	});

	it('should have an "add product" function which should return a promise that resolves with truthy data when valid args are passed in', async () => {
		const service: ProductService = TestBed.get(ProductService);
		let result = await service.addProduct('bookId', 'sheetId', [ { value: 'value' } ], undefined);
		expect(result).toBeTruthy();
		result = await service.addProduct('bookId', 'sheetId', undefined, { data: 'value' });
		expect(result).toBeTruthy();
	});

	it('should have an "add product" function which should return a promise that resolves with falsy data when invalid args are passed in', async () => {
		const service: ProductService = TestBed.get(ProductService);
		let result = await service.addProduct('bookId', 'sheetId', undefined, undefined);
		expect(result).toBeFalsy();
		result = await service.addProduct('bookId', 'sheetId', [], undefined);
		expect(result).toBeFalsy();
		result = await service.addProduct(undefined, 'sheetId', [ { value: 'value' } ], undefined);
		expect(result).toBeFalsy();
		result = await service.addProduct('', 'sheetId', [ { value: 'value' } ], undefined);
		expect(result).toBeFalsy();
		result = await service.addProduct('bookId', undefined, [ { value: 'value' } ], undefined);
		expect(result).toBeFalsy();
		result = await service.addProduct('bookId', '', [ { value: 'value' } ], undefined);
		expect(result).toBeFalsy();
	});

	it('should have a "save product" function', () => {
		const service: ProductService = TestBed.get(ProductService);
		expect(service.saveProduct).toBeTruthy();
		expect(typeof service.saveProduct).toEqual('function');
	});

	it('should have a "save product" function which should return a promise that resolves with truthy data when valid args are passed in', async () => {
		const service: ProductService = TestBed.get(ProductService);
		let result = await service.saveProduct('bookId', 'sheetId', {});
		expect(result).toBeTruthy();
	});

	it('should have a "save product" function which should return a promise that resolves with falsy data when invalid args are passed in', async () => {
		const service: ProductService = TestBed.get(ProductService);
		let result = await service.saveProduct(undefined, 'sheetId', {});
		expect(result).toBeFalsy();
		result = await service.saveProduct('', 'sheetId', {});
		expect(result).toBeFalsy();
		result = await service.saveProduct('bookId', 'sheetId', undefined);
		expect(result).toBeFalsy();
	});

	it('should have a "delete product" function', () => {
		const service: ProductService = TestBed.get(ProductService);
		expect(service.deleteProduct).toBeTruthy();
		expect(typeof service.deleteProduct).toEqual('function');
	});

	it('should have a "delete product" function which should return a promise that resolves with truthy data when valid args are passed in', async () => {
		const service: ProductService = TestBed.get(ProductService);
		let result = await service.deleteProduct('bookId', 'sheetId', { id: 'id' });
		expect(result).toBeTruthy();
	});

	it('should have a "delete product" function which should return a promise that resolves with falsy data when invalid args are passed in', async () => {
		const service: ProductService = TestBed.get(ProductService);
		let result = await service.deleteProduct(undefined, 'sheetId', { id: 'id' });
		expect(result).toBeFalsy();
		result = await service.deleteProduct('', 'sheetId', { id: 'id' });
		expect(result).toBeFalsy();
		result = await service.deleteProduct('bookId', undefined, { id: 'id' });
		expect(result).toBeFalsy();
		result = await service.deleteProduct('bookId', '', { id: 'id' });
		expect(result).toBeFalsy();
		result = await service.deleteProduct('bookId', 'sheetId', undefined);
		expect(result).toBeFalsy();
	});
});
