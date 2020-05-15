import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { of, Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class BookService {
	constructor(public firebaseService: FirebaseService) {}

	addBook(name: string, headingFields: Array<any>) {
		if (!name || !headingFields) {
			return Promise.resolve(false);
		} else {
			return this.firebaseService.addBook(name, headingFields);
		}
	}

	deleteBook(idToRemove: string) {
		return new Promise(async (resolve, reject) => {
			try {
				if (!idToRemove) throw new Error('invalid args');
				// delete sheets
				this.firebaseService.getSheetCollection(idToRemove).subscribe((sheets) => {
					if (sheets)
						sheets.forEach((sheet) => {
							try {
								this.firebaseService.removeProductsCollection(idToRemove, sheet.id);
								this.firebaseService.removeSheet(idToRemove, sheet.id);
							} catch (error) {
								console.log('Failed to remove sheet or sheet-product', error);
							}
						});
				});

				// delete defaultproducts
				this.firebaseService.getDefaultProducts(idToRemove).subscribe((defaultProducts) => {
					if (defaultProducts)
						defaultProducts.forEach((defaultProduct) => {
							this.firebaseService.removeDefaultProduct(defaultProduct.id, idToRemove).catch((error) => {
								console.log('Failed to remove default product', error);
							});
						});
				});

				// delete the book itself
				this.firebaseService
					.removeBook(idToRemove)
					.then((result) => {
						if (result) resolve(true);
						else resolve(false);
					})
					.catch((error) => {
						console.log('Failed to remove book', error);
						resolve(false);
					});
			} catch (error) {
				console.log(error);
				resolve(false);
			}
		});
	}

	getBookDocument(bookId: string) {
		try {
			if (!bookId) throw new Error('invalid ID');
			return this.firebaseService.getBookDocument(bookId);
		} catch (error) {
			console.log(error);
			return of(false);
		}
	}

	getDefaultProducts(bookId: string) {
		try {
			if (!bookId) throw new Error('invalid ID');
			return <Observable<any>>this.firebaseService.getDefaultProducts(bookId);
		} catch (error) {
			console.log(error);
			return <Observable<any>>of(false);
		}
	}

	getUpdatedHeadingFields(headingFields: Array<any>, newFieldName: string) {
		try {
			if (!headingFields) throw new Error('invalid args');
			if (!newFieldName) throw new Error('invalid args');
			let updatedHeadingFields = [ ...headingFields ];
			let isNew = true;
			headingFields.forEach((field) => {
				if (field.name == newFieldName) isNew = false;
			});
			if (isNew) updatedHeadingFields.push({ name: newFieldName, primary: false, text: true, type: 'text' });
			return updatedHeadingFields;
		} catch (error) {
			console.log(error);
			return false;
		}
	}

	getUpdatedProducts(defaultProducts: Array<any>, newFieldName: string) {
		try {
			if (!defaultProducts) throw new Error('invalid args');
			if (!newFieldName) throw new Error('invalid args');
			let newProducts = [ ...defaultProducts ];
			newProducts.forEach((product) => {
				product[newFieldName] = '[No value]';
			});
			return newProducts;
		} catch (error) {
			console.log(error);
			return [ false ];
		}
	}

	getBooksCollection() {
		return this.firebaseService.getBooksCollection();
	}

	removeDefaultProduct(productId: string, bookId: string) {
		return new Promise((resolve, reject) => {
			try {
				if (!productId) throw new Error('invalid args');
				if (!bookId) throw new Error('invalid args');
				this.firebaseService.removeDefaultProduct(productId, bookId).then((result) => {
					if (result) resolve(true);
					else resolve(false);
				});
			} catch (error) {
				console.log(error);
				resolve(false);
			}
		});
	}

	addBookHeader(bookId: string, fieldName: string, headingFields: Array<any>, defaultProducts: Array<any>) {
		return new Promise((resolve, reject) => {
			try {
				if (!bookId) throw new Error('invalid args');
				if (!fieldName) throw new Error('invalid args');
				if (!headingFields) throw new Error('invalid args');
				if (!defaultProducts) throw new Error('invalid args');

				let updatedHeadingFields = this.getUpdatedHeadingFields([ ...headingFields ], fieldName);

				let updatedProducts = this.getUpdatedProducts(defaultProducts, fieldName);

				if (updatedHeadingFields && updatedProducts)
					this.firebaseService.updateBookProducts(bookId, <Array<any>>updatedProducts).then((result) => {
						if (result) {
							this.firebaseService
								.updateBookHeader(bookId, <Array<any>>updatedHeadingFields)
								.then((result) => {
									if (result) resolve(true);
									else resolve(false);
								});
						} else {
							resolve(false);
						}
					});
			} catch (error) {
				console.log(error);
				resolve(false);
			}
		});
	}

	updateBookName(id: string, name: string) {
		return this.firebaseService.updateBookName(id, name);
	}

	addImportedDataToFirebase(bookName: string, parsedSheets: Array<any>) {
		return new Promise(async (resolve, reject) => {
			try {
				if (!bookName) throw new Error('invalid args');
				if (!parsedSheets) throw new Error('invalid args');
				let bookId: string = await (<Promise<string>>this.addBook(bookName, parsedSheets[0].headingFields));
				parsedSheets.forEach(async (sheet) => {
					let sheetData = { ...sheet };
					delete sheetData.products;
					this.firebaseService
						.addSheet(sheetData.name, sheetData.headingFields, bookId)
						.then((sheetId: string) => {
							try {
								if (sheetId.length <= 1) throw new Error('sheet failed to add');
								sheet.products.forEach((product: any) => {
									this.firebaseService.addProduct(product, bookId, sheetId).catch((error: Error) => {
										console.log('IMPORT BOOK ERROR', error);
									});
								});
							} catch (error) {
								console.log(error);
							}
						})
						.catch((error) => {
							console.log(error);
						});
				});
				resolve(true);
			} catch (error) {
				console.log(error);
				resolve(false);
			}
		});
	}

	isValidBookName(bookName: string) {
		return this.firebaseService.isValidBookName(bookName);
	}
}
