import { TestBed } from '@angular/core/testing';
import { BookService } from './book.service';
import { FirebaseService } from './firebase.service';
import { of } from 'rxjs';

class MockFirebaseService {
	isValidBookName(bookName: string) {
		return new Promise((resolve, reject) => {
			try {
				if (!bookName) throw new Error('invalid args');
				resolve(true);
			} catch (error) {
				resolve(false);
			}
		});
	}

	addProduct(product: any, bookId: string, sheetId: string) {
		return new Promise((resolve, reject) => {
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

	addSheet(sheetName: string, headingFields: Array<any>, bookId: string) {
		return new Promise((resolve, reject) => {
			try {
				if (!bookId) throw new Error('invalid args');
				if (!sheetName) throw new Error('invalid args');
				if (!headingFields) headingFields = [];
				resolve(true);
			} catch (error) {
				resolve(false);
			}
		});
	}

	addBook(name: string, headingFields: Array<any>) {
		return new Promise((resolve, reject) => {
			try {
				if (!name) throw new Error('invalid args');
				if (!headingFields) throw new Error('invalid args');
				resolve(true);
			} catch (error) {
				resolve(false);
			}
		});
	}

	getSheetCollection(bookId: string) {
		return of([ { id: 'sheet1' }, { id: 'sheet2' }, { id: 'sheet3' } ]);
	}

	getDefaultProducts(bookId: string) {
		return of([
			{ id: 'default1', data: 'defaultproduct' },
			{ id: 'default2', data: 'defaultproduct' },
			{ id: 'default3', data: 'defaultproduct' }
		]);
	}

	removeProductsCollection(bookId: string, sheetId: string) {
		return new Promise((resolve, reject) => {
			try {
				if (!bookId) throw new Error('a invalid args');
				else if (!sheetId) throw new Error('b invalid args');
				resolve(true);
			} catch (error) {
				resolve(false);
			}
		});
	}

	removeSheet(bookId: string, sheetId: string) {
		return new Promise((resolve, reject) => {
			try {
				if (!bookId) throw new Error('c invalid args');
				else if (!sheetId) throw new Error('d invalid args');
				resolve(true);
			} catch (error) {
				resolve(false);
			}
		});
	}

	getBookDocument(bookId: string) {
		try {
			if (!bookId) throw new Error('invalid arg');
			return of(true);
		} catch (error) {
			return of(false);
		}
	}

	removeDefaultProduct(productId: string, bookId: string) {
		return new Promise((resolve, reject) => {
			try {
				if (!productId) throw new Error('e invlaid args');
				else if (!bookId) throw new Error('f invlaid args');
				resolve(true);
			} catch (error) {
				resolve(false);
			}
		});
	}

	removeBook(bookId: string) {
		return new Promise((resolve, reject) => {
			try {
				if (!bookId) throw new Error('g invalid args');
				resolve(true);
			} catch (error) {
				resolve(false);
			}
		});
	}

	getBooksCollection() {
		return of([ true ]);
	}

	updateBookProducts(bookId: string, updatedProducts: Array<any>) {
		return new Promise((resolve, reject) => {
			try {
				if (!bookId) throw new Error('invalid args');
				if (!updatedProducts || !updatedProducts.length) throw new Error('invalid args');
				resolve(true);
			} catch (error) {
				resolve(false);
			}
		});
	}

	updateBookHeader(bookId: string, updatedHeadingFields: Array<any>) {
		return new Promise((resolve, reject) => {
			try {
				if (!bookId) throw new Error('invalid args');
				if (!updatedHeadingFields || !updatedHeadingFields.length) throw new Error('invalid args');
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
				resolve(true);
			} catch (error) {
				resolve(false);
			}
		});
	}
}

describe('BookService', () => {
	let bookId = 'bookId';
	let newField = 'newField';
	let bookName = 'bookName';
	let mockFields = [
		{ name: 'field1', primary: true, text: true, type: 'text' },
		{ name: 'field2', primary: false, text: true, type: 'text' },
		{ name: 'field3', primary: false, text: false, type: 'number' }
	];
	let mockProducts = [
		{ field1: 'value', field2: 'value', field3: 1 },
		{ field1: 'value', field2: 'value', field3: 1 },
		{ field1: 'value', field2: 'value', field3: 1 }
	];

	let mockSheets = [
		{
			products: [ { product: 'value' } ],
			headingFields: [ { field: 'vlaue' } ],
			name: 'sheet1'
		}
	];

	beforeEach(() =>
		TestBed.configureTestingModule({
			providers: [ { provide: FirebaseService, useClass: MockFirebaseService } ]
		})
	);

	it('should be created', () => {
		const service: BookService = TestBed.get(BookService);
		expect(service).toBeTruthy();
	});

	it('should have a "delete book" function', () => {
		const service: BookService = TestBed.get(BookService);

		expect(service.deleteBook).toBeTruthy();
		expect(typeof service.deleteBook).toEqual('function');
	});

	it('should have a "delete book" function that resolves with truthy data when passed a valid arg', async () => {
		const service: BookService = TestBed.get(BookService);
		let result = await service.deleteBook('validId');
		expect(result).toBeTruthy();
	});

	it('should have a "delete book" function that resolves with falsy data when given an invalid arg', async () => {
		const service: BookService = TestBed.get(BookService);
		let result = await service.deleteBook('');
		expect(result).toBeFalsy();
		result = await service.deleteBook(undefined);
		expect(result).toBeFalsy();
	});

	it('should have an "add book" function', () => {
		const service: BookService = TestBed.get(BookService);
		expect(service.addBook).toBeTruthy();
		expect(typeof service.addBook).toEqual('function');
	});

	it('should have an "add book" function that resolves with truthy data when passed a valid arg', async () => {
		const service: BookService = TestBed.get(BookService);
		let result = await service.addBook('name', [ { field: true }, { field: true } ]);
		expect(result).toBeTruthy();
		result = await service.addBook('name', []);
		expect(result).toBeTruthy();
	});

	it('should have an "add book" function that resolves with falsy data when passed an invalid arg', async () => {
		const service: BookService = TestBed.get(BookService);
		let result = await service.addBook('data', undefined);
		expect(result).toBeFalsy();
		result = await service.addBook(undefined, [ { data: true } ]);
		expect(result).toBeFalsy();
		result = await service.addBook('', [ { data: true } ]);
		expect(result).toBeFalsy();
	});

	it('should have a "get book document" function', () => {
		const service: BookService = TestBed.get(BookService);
		expect(service.getBookDocument).toBeTruthy();
		expect(typeof service.getBookDocument).toEqual('function');
	});

	it('should have a "get book document" function that receives truthy data when subsribing to the returned observable after passing a valid argument', () => {
		const service: BookService = TestBed.get(BookService);
		let result;
		service.getBookDocument('bookId').subscribe((data) => {
			result = data;
		});
		setTimeout(() => {}, 1000);
		expect(result).toBeTruthy();
	});

	it('should have a "get book document" function that receives falsy data when subsribing to the returned observable after passing an invalid argument', () => {
		const service: BookService = TestBed.get(BookService);
		let result;

		service.getBookDocument('').subscribe((data) => {
			result = data;
		});
		setTimeout(() => {}, 1000);
		expect(result).toBeFalsy();

		service.getBookDocument(undefined).subscribe((data) => {
			result = data;
		});
		setTimeout(() => {}, 1000);
		expect(result).toBeFalsy();
	});

	it('should have a "get default products" function', () => {
		const service: BookService = TestBed.get(BookService);
		expect(service.getDefaultProducts).toBeTruthy();
		expect(typeof service.getDefaultProducts).toEqual('function');
	});

	it('should have a "get default products" function that receives truthy data when subsribing to the returned observable after passing a valid argument', () => {
		const service: BookService = TestBed.get(BookService);
		let result;

		service.getDefaultProducts('bookId').subscribe((data: any) => {
			result = data;
		});
		setTimeout(() => {}, 1000);
		expect(result).toBeTruthy();
	});

	it('should have a "get default products" function that receives falsy data when subsribing to the returned observable after passing an invalid argument', () => {
		const service: BookService = TestBed.get(BookService);
		let result;

		service.getDefaultProducts('').subscribe((data: any) => {
			result = data;
		});
		setTimeout(() => {}, 1000);
		expect(result).toBeFalsy();

		service.getDefaultProducts(undefined).subscribe((data: any) => {
			result = data;
		});
		setTimeout(() => {}, 1000);
		expect(result).toBeFalsy();
	});

	it('should have a "get updated heading fields" function', () => {
		const service: BookService = TestBed.get(BookService);
		expect(service.getUpdatedHeadingFields).toBeTruthy();
		expect(typeof service.getUpdatedHeadingFields).toEqual('function');
	});

	it('should have a "get updated heading fields" function that returns an array with truthy data in it when passed valid args', () => {
		const service: BookService = TestBed.get(BookService);
		let newFieldName = 'newField';
		let updatedHeadingFields = service.getUpdatedHeadingFields(mockFields, newFieldName);
		expect(updatedHeadingFields[0]).toBeTruthy();
		updatedHeadingFields = service.getUpdatedHeadingFields([], newFieldName);
		expect(updatedHeadingFields[0]).toBeTruthy();
	});

	it('should have a "get updated heading fields" function that returns an array with falsy data in it when passed invalid args', () => {
		const service: BookService = TestBed.get(BookService);
		let newFieldName = 'newField';
		let updatedHeadingFields = service.getUpdatedHeadingFields(mockFields, '');
		expect(updatedHeadingFields[0]).toBeFalsy();
		updatedHeadingFields = service.getUpdatedHeadingFields(mockFields, undefined);
		expect(updatedHeadingFields[0]).toBeFalsy();
		updatedHeadingFields = service.getUpdatedHeadingFields(undefined, newFieldName);
		expect(updatedHeadingFields[0]).toBeFalsy();
	});

	it('should have a "get updated heading fields" function that does not add a new field if the new field name passed to it already exists in the heading fields array, also passed to it', () => {
		const service: BookService = TestBed.get(BookService);
		let newFieldName = 'field1';
		let updatedHeadingFields = <Array<any>>service.getUpdatedHeadingFields(mockFields, newFieldName);
		expect(updatedHeadingFields.length).toEqual(mockFields.length);
	});

	it('should have a "get updated products" function', () => {
		const service: BookService = TestBed.get(BookService);
		expect(service.getUpdatedProducts).toBeTruthy();
		expect(typeof service.getUpdatedProducts).toEqual('function');
	});

	it('should have a "get updated products" function that returns an array containing truthy data when passed valid args', () => {
		const service: BookService = TestBed.get(BookService);
		let mockProducts = [ { field1: 1, field2: 2 }, { field1: 4, field2: 5 } ];
		let newFieldName = 'newField';
		let updatedProducts = service.getUpdatedProducts(mockProducts, newFieldName);
		let isUpdated = true;
		updatedProducts.forEach((product) => {
			if (!product[newFieldName]) isUpdated = false;
		});
		expect(isUpdated).toBeTruthy();
	});

	it('should have a "get updated products" function that returns an array containing falsy data when passed invalid args', () => {
		const service: BookService = TestBed.get(BookService);
		let mockProducts = [ { field1: 1, field2: 2 }, { field1: 4, field2: 5 } ];
		let newFieldName = 'newField';
		let updatedProducts = service.getUpdatedProducts(undefined, newFieldName);
		expect(updatedProducts[0]).toBeFalsy();
		updatedProducts = service.getUpdatedProducts([], newFieldName);
		expect(updatedProducts[0]).toBeFalsy();
		updatedProducts = service.getUpdatedProducts(mockProducts, '');
		expect(updatedProducts[0]).toBeFalsy();
		updatedProducts = service.getUpdatedProducts(mockProducts, undefined);
		expect(updatedProducts[0]).toBeFalsy();
	});

	it('should have a "get books collection" function', () => {
		const service: BookService = TestBed.get(BookService);
		expect(service.getBooksCollection).toBeTruthy();
		expect(typeof service.getBooksCollection).toEqual('function');
	});

	it('should have a "get books collection" function returns an observable', () => {
		const service: BookService = TestBed.get(BookService);
		let obs = service.getBooksCollection();
		let arr;
		obs.subscribe((data) => {
			arr = data;
		});
		setTimeout(() => {}, 1000);
		expect(Array.isArray(arr)).toBeTruthy();
	});

	it('should have a "remove default product" function', () => {
		const service: BookService = TestBed.get(BookService);
		expect(service.removeDefaultProduct).toBeTruthy();
		expect(typeof service.removeDefaultProduct).toEqual('function');
	});

	it('should have a "remove default product" function that resolves with truthy data when passed valid args', async () => {
		const service: BookService = TestBed.get(BookService);
		let result = await service.removeDefaultProduct('productId', 'bookId');
		expect(result).toBeTruthy();
	});

	it('should have a "remove default product" function that resolves with falsy data when passed invalid args', async () => {
		const service: BookService = TestBed.get(BookService);
		let result = await service.removeDefaultProduct(undefined, 'bookId');
		expect(result).toBeFalsy();
		result = await service.removeDefaultProduct('', 'bookId');
		expect(result).toBeFalsy();
		result = await service.removeDefaultProduct('productId', undefined);
		expect(result).toBeFalsy();
		result = await service.removeDefaultProduct('productId', '');
		expect(result).toBeFalsy();
	});

	it('should have an "add book header" function', () => {
		const service: BookService = TestBed.get(BookService);
		expect(service.addBookHeader).toBeTruthy();
		expect(typeof service.addBookHeader).toEqual('function');
	});

	it('should have an "add book header" function that resolves with truthy data when passed valid args', async () => {
		const service: BookService = TestBed.get(BookService);

		let result = await service.addBookHeader(bookId, newField, mockFields, mockProducts);
		expect(result).toBeTruthy();
	});

	it('should have an "add book header" function that resolves with falsy data when passed invalid args', async () => {
		const service: BookService = TestBed.get(BookService);
		let result = await service.addBookHeader(undefined, newField, mockFields, mockProducts);
		expect(result).toBeFalsy();
		result = await service.addBookHeader('', newField, mockFields, mockProducts);
		expect(result).toBeFalsy();
		result = await service.addBookHeader(bookId, undefined, mockFields, mockProducts);
		expect(result).toBeFalsy();
		result = await service.addBookHeader(bookId, '', mockFields, mockProducts);
		expect(result).toBeFalsy();
		result = await service.addBookHeader(bookId, newField, undefined, mockProducts);
		expect(result).toBeFalsy();
		result = await service.addBookHeader(bookId, newField, mockFields, undefined);
		expect(result).toBeFalsy();
	});

	it('should have an "update book name" function', () => {
		const service: BookService = TestBed.get(BookService);
		expect(service.updateBookName).toBeTruthy();
		expect(typeof service.updateBookName).toEqual('function');
	});

	it('should have an "update book name" fucntion that resolves with truthy data when passed valid args', async () => {
		const service: BookService = TestBed.get(BookService);
		let result = await service.updateBookName(bookId, 'newBookName');
		expect(result).toBeTruthy();
	});

	it('should have an "update book name" fucntion that resolves with falsy data when passed invalid args', async () => {
		const service: BookService = TestBed.get(BookService);
		let result = await service.updateBookName(undefined, 'newBookName');
		expect(result).toBeFalsy();
		result = await service.updateBookName('', 'newBookName');
		expect(result).toBeFalsy();
		result = await service.updateBookName(bookId, undefined);
		expect(result).toBeFalsy();
		result = await service.updateBookName(bookId, '');
		expect(result).toBeFalsy();
	});

	it('should have an "add imported data to firebase" function', () => {
		const service: BookService = TestBed.get(BookService);
		expect(service.addImportedDataToFirebase).toBeTruthy();
		expect(typeof service.addImportedDataToFirebase).toEqual('function');
	});

	it('should have an "add imported data to firebase" function that resolves with truthy data when passed valid args', async () => {
		const service: BookService = TestBed.get(BookService);
		let result = await service.addImportedDataToFirebase(bookName, mockSheets);
		expect(result).toBeTruthy();
	});

	it('should have an "add imported data to firebase" function that resolves with falsy data when passed invalid args', async () => {
		const service: BookService = TestBed.get(BookService);

		let result = await service.addImportedDataToFirebase(undefined, mockSheets);
		expect(result).toBeFalsy();
		result = await service.addImportedDataToFirebase('', mockSheets);
		expect(result).toBeFalsy();
		result = await service.addImportedDataToFirebase(bookName, undefined);
		expect(result).toBeFalsy();
	});

	it('should have an "is valid book name" function', () => {
		const service: BookService = TestBed.get(BookService);
		expect(service.isValidBookName).toBeTruthy();
		expect(typeof service.isValidBookName).toEqual('function');
	});

	it('should have an "is valid book name" function that resolves with truthy data when passed valid args', async () => {
		const service: BookService = TestBed.get(BookService);
		let result = await service.isValidBookName(bookName);
		expect(result).toBeTruthy();
	});

	it('should have an "is valid book name" function that resolves with falsy data when passed invalid args', async () => {
		const service: BookService = TestBed.get(BookService);
		let result = await service.isValidBookName('');
		expect(result).toBeFalsy();
		result = await service.isValidBookName(undefined);
		expect(result).toBeFalsy();
	});
});
