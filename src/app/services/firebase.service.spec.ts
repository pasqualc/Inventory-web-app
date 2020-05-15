import { TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirebaseService } from './firebase.service';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../../environments/environment';
import { of } from 'rxjs';

class MockAngularFirestore {
	collection(url: string) {
		return {
			add(data: any) {
				return new Promise((resolve, reject) => {
					resolve({ id: 'id' });
				});
			},
			valueChanges(options: any) {
				return of([]);
			},
			doc(id: string) {
				return {
					delete() {
						return new Promise((resolve, reject) => {
							resolve(true);
						});
					},
					set(data: any) {
						return new Promise((resolve, reject) => {
							resolve(true);
						});
					}
				};
			}
		};
	}

	doc(url: string) {
		return {
			update(data: any) {
				return new Promise((resolve, reject) => {
					resolve(true);
				});
			},
			valueChanges() {
				return of([ { id: 'id', data: 'value' } ]);
			}
		};
	}

	addProduct(product: any, bookId: string, sheetId: string) {
		return new Promise(async (resolve, reject) => {
			try {
				if (!product) throw new Error('Invalid args');
				if (!bookId) throw new Error('Invalid args');
				if (!sheetId) throw new Error('Invalid args');
				resolve(true);
			} catch (error) {
				resolve(false);
			}
		});
	}

	removeProduct(productId: string, sheetId: string, bookId: string) {
		return new Promise((resolve, reject) => {
			try {
				if (!productId) throw new Error('invalid args');
				else if (!sheetId) throw new Error('invalid args');
				else if (!bookId) throw new Error('invalid args');
				resolve(true);
			} catch (error) {
				resolve(false);
			}
		});
	}
}

describe('FirebaseService', () => {
	beforeEach(() =>
		TestBed.configureTestingModule({
			imports: [ AngularFireModule.initializeApp(environment.firebase) ],
			providers: [ FirebaseService, { provide: AngularFirestore, useClass: MockAngularFirestore } ]
		})
	);

	it('should be created', () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		expect(service).toBeTruthy();
	});

	it('should have a function to retrieve a products collection', () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		expect(service.getProductsCollection).toBeTruthy();
		expect(typeof service.getProductsCollection).toEqual('function');
	});

	it('should have a function to add a product to a collection', () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		expect(service.addProduct).toBeTruthy();
		expect(typeof service.addProduct).toEqual('function');
	});

	it('should have a function to add a product to a collection that returns a promise that resolves with truthy data when valid args are passed in', async () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		let result = await service.addProduct({ field1: 'data', field2: 'data', field3: 1 }, 'bookId', 'sheetId');
		expect(result).toBeTruthy();
	});

	it('should have a function to add a product to a collection that returns a promise that resolves with falsy data when invalid args are passed in', async () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		let result = await service.addProduct(undefined, 'bookId', 'sheetId');
		expect(result).toBeFalsy();
		result = await service.addProduct({ field1: 'data', field2: 'data', field3: 1 }, '', 'sheetId');
		expect(result).toBeFalsy();
		result = await service.addProduct({ field1: 'data', field2: 'data', field3: 1 }, undefined, 'sheetId');
		expect(result).toBeFalsy();
		result = await service.addProduct({ field1: 'data', field2: 'data', field3: 1 }, 'bookId', '');
		expect(result).toBeFalsy();
		result = await service.addProduct({ field1: 'data', field2: 'data', field3: 1 }, 'bookId', undefined);
		expect(result).toBeFalsy();
	});

	it('should have a function to remove a product from a collection', () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		expect(service.removeProduct).toBeTruthy();
		expect(typeof service.removeProduct).toEqual('function');
	});

	it('should have a function to remove a product from a collection that returns a promise which will resolve with truthy data when valid args are passed in', async () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		let result = await service.removeProduct('productId', 'sheetId', 'bookId');
		expect(result).toBeTruthy();
	});

	it('should have a function to remove a product from a collection that returns a promise which will resolve with falsy data when invalid args are passed in', async () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		let result = await service.removeProduct(undefined, 'sheetId', 'bookId');
		expect(result).toBeFalsy();
		result = await service.removeProduct('', 'sheetId', 'bookId');
		expect(result).toBeFalsy();
		result = await service.removeProduct('bookId', undefined, 'bookId');
		expect(result).toBeFalsy();
		result = await service.removeProduct('bookId', '', 'bookId');
		expect(result).toBeFalsy();
		result = await service.removeProduct('bookId', 'sheetId', undefined);
		expect(result).toBeFalsy();
		result = await service.removeProduct('bookId', 'sheetId', '');
		expect(result).toBeFalsy();
	});

	it('should have a function to update a product document', () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		expect(service.updateProduct).toBeTruthy();
		expect(typeof service.updateProduct).toEqual('function');
	});

	it('should have a function to update a product document that returns a promise which will resolve with truthy data when valid args are passed in', async () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		let result = await service.updateProduct({ data: 'value' }, 'bookId', 'sheetId', 'productId');
		expect(result).toBeTruthy();
	});

	it('should have a function to update a product document that returns a promise which will resolve with falsy data when invalid args are passed in', async () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		let result = await service.updateProduct(undefined, 'bookId', 'sheetId', 'productId');
		expect(result).toBeFalsy();
		result = await service.updateProduct({ data: 'value' }, undefined, 'sheetId', 'productId');
		expect(result).toBeFalsy();
		result = await service.updateProduct({ data: 'value' }, '', 'sheetId', 'productId');
		expect(result).toBeFalsy();
		result = await service.updateProduct({ data: 'value' }, 'bookId', undefined, 'productId');
		expect(result).toBeFalsy();
		result = await service.updateProduct({ data: 'value' }, 'bookId', '', 'productId');
		expect(result).toBeFalsy();
		result = await service.updateProduct({ data: 'value' }, 'bookId', 'sheetId', undefined);
		expect(result).toBeFalsy();
		result = await service.updateProduct({ data: 'value' }, 'bookId', 'sheetId', '');
		expect(result).toBeFalsy();
	});

	it('should have a function to remove an entire products collection', () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		expect(service.removeProductsCollection).toBeTruthy();
		expect(typeof service.removeProductsCollection).toEqual('function');
	});

	it('should have a function to remove an entire products collection which returns a promise that will resolve with truthy data when valid args are passed in', async () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		let result = await service.removeProductsCollection('bookId', 'sheetId');
		expect(result).toBeTruthy();
	});

	it('should have a function to remove an entire products collection which returns a promise that will resolve with falsy data when invalid args are passed in', async () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		let result = await service.removeProductsCollection(undefined, 'sheetId');
		expect(result).toBeFalsy();
		result = await service.removeProductsCollection('', 'sheetId');
		expect(result).toBeFalsy();
		result = await service.removeProductsCollection('bookId', undefined);
		expect(result).toBeFalsy();
		result = await service.removeProductsCollection('bookId', '');
		expect(result).toBeFalsy();
	});

	it('should have a function to get a sheet document from a collection', () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		expect(service.getSheetDocument).toBeTruthy();
		expect(typeof service.getSheetDocument).toEqual('function');
	});

	it('should have a function to get a sheet collection', () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		expect(service.getSheetCollection).toBeTruthy();
		expect(typeof service.getSheetCollection).toEqual('function');
	});

	it('should have a function to add a sheet document to a collection', () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		expect(service.addSheet).toBeTruthy();
		expect(typeof service.addSheet).toEqual('function');
	});

	it('should have a function to add a sheet document to a collection that returns a promise which resolves with a string that has a length greater than one when valid args are passed in', async () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		let result: string = await service.addSheet('sheetName', [], 'bookId');
		expect(typeof result).toEqual('string');
		expect(result.length).toBeGreaterThan(1);
	});

	it('should have a function to add a sheet document to a collection that returns a promise which resolves with a string that has a length equal to or less than one when invalid args are passed in', async () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		let result: string = await service.addSheet(undefined, [], 'bookId');
		expect(typeof result).toEqual('string');
		expect(result.length).toBeLessThanOrEqual(1);
		result = await service.addSheet('', [], 'bookId');
		expect(typeof result).toEqual('string');
		expect(result.length).toBeLessThanOrEqual(1);
		result = await service.addSheet('sheetName', [], undefined);
		expect(typeof result).toEqual('string');
		expect(result.length).toBeLessThanOrEqual(1);
		result = await service.addSheet('sheetName', [], '');
		expect(typeof result).toEqual('string');
		expect(result.length).toBeLessThanOrEqual(1);
	});

	it('should have a function to remove a sheet document from a collection', () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		expect(service.removeSheet).toBeTruthy();
		expect(typeof service.removeSheet).toEqual('function');
	});

	it('should have a function to remove a sheet document from a collection that returns a promise which resolves with truthy data when valid args are passed in', async () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		let result = await service.removeSheet('bookId', 'sheetId');
		expect(result).toBeTruthy();
	});

	it('should have a function to remove a sheet document from a collection that returns a promise which resolves with falsy data when invalid args are passed in', async () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		let result = await service.removeSheet(undefined, 'sheetId');
		expect(result).toBeFalsy();
		result = await service.removeSheet('', 'sheetId');
		expect(result).toBeFalsy();
		result = await service.removeSheet('bookId', undefined);
		expect(result).toBeFalsy();
		result = await service.removeSheet('bookId', '');
		expect(result).toBeFalsy();
	});

	it("should have a function to update an individual product document of a sheet document's products subcollection", () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		expect(service.updateSheetProduct).toBeTruthy();
		expect(typeof service.updateSheetProduct).toEqual('function');
	});

	it("should have a function to update an individual product document of a sheet document's products subcollection that returns a promise which resolves with truthy data when valid args are passed in", async () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		let result = await service.updateSheetProduct({ data: 'value' }, 'bookId', 'sheetId', 'productId');
		expect(result).toBeTruthy();
	});

	it("should have a function to update an individual product document of a sheet document's products subcollection that returns a promise which resolves with falsy data when invalid args are passed in", async () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		let result = await service.updateSheetProduct(undefined, 'bookId', 'sheetId', 'productId');
		expect(result).toBeFalsy();
		result = await service.updateSheetProduct({ data: 'value' }, undefined, 'sheetId', 'productId');
		expect(result).toBeFalsy();
		result = await service.updateSheetProduct({ data: 'value' }, '', 'sheetId', 'productId');
		expect(result).toBeFalsy();
		result = await service.updateSheetProduct({ data: 'value' }, 'bookId', undefined, 'productId');
		expect(result).toBeFalsy();
		result = await service.updateSheetProduct({ data: 'value' }, 'bookId', '', 'productId');
		expect(result).toBeFalsy();
		result = await service.updateSheetProduct({ data: 'value' }, 'bookId', 'sheetId', undefined);
		expect(result).toBeFalsy();
		result = await service.updateSheetProduct({ data: 'value' }, 'bookId', 'sheetId', '');
		expect(result).toBeFalsy();
	});

	it('should have a function to update the entire products collection of a sheet document', () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		expect(service.updateSheetProducts).toBeTruthy();
		expect(typeof service.updateSheetProducts).toEqual('function');
	});

	it('should have a function to update the entire products collection of a sheet document which returns a promise that resolves with truthy data when valid args are passed in', async () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		let result = await service.updateSheetProducts('bookId', 'sheetId', [ { data: 'value' }, { data: 1 } ]);
		expect(result).toBeTruthy();
	});

	it('should have a function to update the entire products collection of a sheet document which returns a promise that resolves with falsy data when invalid args are passed in', async () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		let result = await service.updateSheetProducts(undefined, 'sheetId', [ { data: 'value' }, { data: 1 } ]);
		expect(result).toBeFalsy();
		result = await service.updateSheetProducts('', 'sheetId', [ { data: 'value' }, { data: 1 } ]);
		expect(result).toBeFalsy();
		result = await service.updateSheetProducts('bookId', undefined, [ { data: 'value' }, { data: 1 } ]);
		expect(result).toBeFalsy();
		result = await service.updateSheetProducts('bookId', '', [ { data: 'value' }, { data: 1 } ]);
		expect(result).toBeFalsy();
		result = await service.updateSheetProducts('bookId', 'sheetId', undefined);
		expect(result).toBeFalsy();
	});

	it('should have a function to get a book document from a collection', () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		expect(service.getBookDocument).toBeTruthy();
		expect(typeof service.getBookDocument).toEqual('function');
	});

	it('should have a function to get a book collection', () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		expect(service.getBooksCollection).toBeTruthy();
		expect(typeof service.getBooksCollection).toEqual('function');
	});

	it("should have a function to get a book's default products", () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		expect(service.getDefaultProducts).toBeTruthy();
		expect(typeof service.getDefaultProducts).toEqual('function');
	});

	it('should have a function to update the name field of a sheet document', () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		expect(service.updateSheetName).toBeTruthy();
		expect(typeof service.updateSheetName).toEqual('function');
	});

	it('should have a function to update the name field of a sheet document which returns a promise that resolves with truthy data when valid args are passed in', async () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		let result = await service.updateSheetName('bookId', 'sheetId', 'bookName');
		expect(result).toBeTruthy();
	});

	it('should have a function to update the name field of a sheet document which returns a promise that resolves with falsy data when invalid args are passed in', async () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		let result = await service.updateSheetName(undefined, 'sheetId', 'bookName');
		expect(result).toBeFalsy();
		result = await service.updateSheetName('', 'sheetId', 'bookName');
		expect(result).toBeFalsy();
		result = await service.updateSheetName('bookId', undefined, 'bookName');
		expect(result).toBeFalsy();
		result = await service.updateSheetName('bookId', '', 'bookName');
		expect(result).toBeFalsy();
		result = await service.updateSheetName('bookId', 'sheetId', undefined);
		expect(result).toBeFalsy();
		result = await service.updateSheetName('bookId', 'sheetId', '');
		expect(result).toBeFalsy();
	});

	it('should have a function to update the heading fields of a sheet document', () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		expect(service.updateSheetHeader).toBeTruthy();
		expect(typeof service.updateSheetHeader).toEqual('function');
	});

	it('should have a function to update the heading fields of a sheet document which should return a promise which resolves with truthy data when valid args are passed in', async () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		let result = await service.updateSheetHeader('bookId', 'sheetId', [ { data: 'field' } ]);
		expect(result).toBeTruthy();
	});

	it('should have a function to update the heading fields of a sheet document which should return a promise which resolves with falsy data when invalid args are passed in', async () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		let result = await service.updateSheetHeader(undefined, 'sheetId', [ { data: 'field' } ]);
		expect(result).toBeFalsy();
		result = await service.updateSheetHeader('', 'sheetId', [ { data: 'field' } ]);
		expect(result).toBeFalsy();
		result = await service.updateSheetHeader('bookId', undefined, [ { data: 'field' } ]);
		expect(result).toBeFalsy();
		result = await service.updateSheetHeader('bookId', '', [ { data: 'field' } ]);
		expect(result).toBeFalsy();
		result = await service.updateSheetHeader('bookId', 'sheetId', undefined);
		expect(result).toBeFalsy();
	});

	it('should have a function to update the name field of a book document', () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		expect(service.updateBookName).toBeTruthy();
		expect(typeof service.updateBookName).toEqual('function');
	});

	it('should have a function to update the name field of a book document which returns a promise that resolves with truthy data when valid args are passed in', async () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		let result = await service.updateBookName('bookId', 'bookName');
		expect(result).toBeTruthy();
	});

	it('should have a function to update the name field of a book document which returns a promise that resolves with falsy data when invalid args are passed in', async () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		let result = await service.updateBookName(undefined, 'bookName');
		expect(result).toBeFalsy();
		result = await service.updateBookName('', 'bookName');
		expect(result).toBeFalsy();
		result = await service.updateBookName('bookId', undefined);
		expect(result).toBeFalsy();
		result = await service.updateBookName('bookId', '');
		expect(result).toBeFalsy();
	});

	it('should have a function to update the name header fields of a book document', () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		expect(service.updateBookHeader).toBeTruthy();
		expect(typeof service.updateBookHeader).toEqual('function');
	});

	it('should have a function to update the name header fields of a book document which should return a promise that resolves with truthy data when valid args are passed in', async () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		let result = await service.updateBookHeader('bookId', [ { data: 'value' } ]);
		expect(result).toBeTruthy();
	});

	it('should have a function to update the name header fields of a book document which should return a promise that resolves with falsy data when invalid args are passed in', async () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		let result = await service.updateBookHeader(undefined, [ { data: 'value' } ]);
		expect(result).toBeFalsy();
		result = await service.updateBookHeader('', [ { data: 'value' } ]);
		expect(result).toBeFalsy();
		result = await service.updateBookHeader('bookId', undefined);
		expect(result).toBeFalsy();
	});

	it('should have a function to update an individual default product of a book document', () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		expect(service.updateDefaultProduct).toBeTruthy();
		expect(typeof service.updateDefaultProduct).toEqual('function');
	});

	it('should have a function to update an individual default product of a book document which should return a promise that resolves with truthy data when valid args are passed in', async () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		let result = await service.updateDefaultProduct({ data: 'value' }, 'bookId', 'productId');
		expect(result).toBeTruthy();
	});

	it('should have a function to update an individual default product of a book document which should return a promise that resolves with falsy data when invalid args are passed in', async () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		let result = await service.updateDefaultProduct(undefined, 'bookId', 'productId');
		expect(result).toBeFalsy();
		result = await service.updateDefaultProduct({ data: 'value' }, undefined, 'productId');
		expect(result).toBeFalsy();
		result = await service.updateDefaultProduct({ data: 'value' }, '', 'productId');
		expect(result).toBeFalsy();
		result = await service.updateDefaultProduct({ data: 'value' }, 'bookId', undefined);
		expect(result).toBeFalsy();
		result = await service.updateDefaultProduct({ data: 'value' }, 'bookId', '');
		expect(result).toBeFalsy();
	});

	it('should have a function to update the default products of a book document', () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		expect(service.updateBookProducts).toBeTruthy();
		expect(typeof service.updateBookProducts).toEqual('function');
	});

	it('should have a function to update the default products of a book document which should return a promise that resolves with truthy data when valid args are passed in', async () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		let result = await service.updateBookProducts('bookId', [ { data: 'value' } ]);
		expect(result).toBeTruthy();
	});

	it('should have a function to update the default products of a book document which should return a promise that resolves with falsy data when invalid args are passed in', async () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		let result = await service.updateBookProducts(undefined, [ { data: 'value' } ]);
		expect(result).toBeFalsy();
		result = await service.updateBookProducts('', [ { data: 'value' } ]);
		expect(result).toBeFalsy();
		result = await service.updateBookProducts('bookId', undefined);
		expect(result).toBeFalsy();
	});

	it('should have a function to remove a default product from a book document', () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		expect(service.removeDefaultProduct).toBeTruthy();
		expect(typeof service.removeDefaultProduct).toEqual('function');
	});

	it('should have a function to remove a default product from a book document which should return a promise that resolves with truthy data when valid args are passed in', async () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		let result = await service.removeDefaultProduct('productId', 'bookdId');
		expect(result).toBeTruthy();
	});

	it('should have a function to remove a default product from a book document which should return a promise that resolves with falsy data when invalid args are passed in', async () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		let result = await service.removeDefaultProduct(undefined, 'bookdId');
		expect(result).toBeFalsy();
		result = await service.removeDefaultProduct('', 'bookdId');
		expect(result).toBeFalsy();
		result = await service.removeDefaultProduct('productId', undefined);
		expect(result).toBeFalsy();
		result = await service.removeDefaultProduct('productId', '');
		expect(result).toBeFalsy();
	});

	it('should have a function to remove a book document', () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		expect(service.removeBook).toBeTruthy();
		expect(typeof service.removeBook).toEqual('function');
	});

	it('should have a function to remove a book document which should return a promise that resolves with truthy data when valid args are passed in', async () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		let result = await service.removeBook('bookId');
		expect(result).toBeTruthy();
	});

	it('should have a function to remove a book document which should return a promise that resolves with falsy data when invalid args are passed in', async () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		let result = await service.removeBook(undefined);
		expect(result).toBeFalsy();
		result = await service.removeBook('');
		expect(result).toBeFalsy();
	});

	it('should have a function to add a book document', () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		expect(service.addBook).toBeTruthy();
		expect(typeof service.addBook).toEqual('function');
	});

	it('should have a function to add a book document which should return a promise that resolves with truthy data when valid args are passed in', async () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		let result = await service.addBook('bookName', []);
		expect(result).toBeTruthy();
	});

	it('should have a function to add a book document which should return a promise that resolves with falsy data when invalid args are passed in', async () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		let result = await service.addBook(undefined, []);
		expect(result).toBeFalsy();
		result = await service.addBook('', []);
		expect(result).toBeFalsy();
		result = await service.addBook('bookName', undefined);
		expect(result).toBeFalsy();
	});

	it('should have a function to add a default product to a book document', () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		expect(service.addDefaultProduct).toBeTruthy();
		expect(typeof service.addDefaultProduct).toEqual('function');
	});

	it('should have a function to add a default product to a book document which should return a promise that resolves with truthy data when valid args are passed in', async () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		let result = await service.addDefaultProduct({ data: 'value' }, 'bookId');
		expect(result).toBeTruthy();
	});

	it('should have a function to add a default product to a book document which should return a promise that resolves with falsy data when invalid args are passed in', async () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		let result = await service.addDefaultProduct(undefined, 'bookId');
		expect(result).toBeFalsy();
		result = await service.addDefaultProduct({ data: 'value' }, undefined);
		expect(result).toBeFalsy();
		result = await service.addDefaultProduct({ data: 'value' }, '');
		expect(result).toBeFalsy();
	});

	it('should have a function to validate a book name', () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		expect(service.isValidBookName).toBeTruthy();
		expect(typeof service.isValidBookName).toEqual('function');
	});

	it('should have a function to validate a book name which should return a promise that resolves with truthy data when valid args are passed in', async () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		let result = await service.isValidBookName('bookName');
		expect(result).toBeTruthy();
	});

	it('should have a function to validate a book name which should return a promise that resolves with falsy data when invalid args are passed in', async () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		let result = await service.isValidBookName(undefined);
		expect(result).toBeFalsy();
		result = await service.isValidBookName('');
		expect(result).toBeFalsy();
	});

	it('should have a function to update an individual user document', () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		expect(service.updateUser).toBeTruthy();
		expect(typeof service.updateUser).toEqual('function');
	});

	it('should have a function to update an individual user document which should return a promise that resolves with truthy data when valid args are passed in', async () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		let result = await service.updateUser({ id: 'userid', data: 'value' });
		expect(result).toBeTruthy();
	});

	it('should have a function to update an individual user document which should return a promise that resolves with falsy data when invalid args are passed in', async () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		let result = await service.updateUser(undefined);
		expect(result).toBeFalsy();
	});

	it('should have a function to delete an individual user document', () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		expect(service.deleteUser).toBeTruthy();
		expect(typeof service.deleteUser).toEqual('function');
	});

	it('should have a function to delete an individual user document which should return a promise that resolves with truthy data when valid args are passed in', async () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		let result = await service.deleteUser('userId');
		expect(result).toBeTruthy();
	});

	it('should have a function to delete an individual user document which should return a promise that resolves with falsy data when invalid args are passed in', async () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		let result = await service.deleteUser(undefined);
		expect(result).toBeFalsy();
		result = await service.deleteUser('');
		expect(result).toBeFalsy();
	});

	it('should have a function to add an individual user document', () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		expect(service.addUser).toBeTruthy();
		expect(typeof service.addUser).toEqual('function');
	});

	it('should have a function to add an individual user document which should return a promise that resolves with truthy data when valid args are passed in', async () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		let result = await service.addUser({ data: 'value' });
		expect(result).toBeTruthy();
	});

	it('should have a function to add an individual user document which should return a promise that resolves with falsy data when invalid args are passed in', async () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		let result = await service.addUser(undefined);
		expect(result).toBeFalsy();
	});

	it('should have a function to get a user collection', () => {
		const service: FirebaseService = TestBed.get(FirebaseService);
		expect(service.getUsers).toBeTruthy();
		expect(typeof service.getUsers).toEqual('function');
	});
});
