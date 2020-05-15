import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { Observable, of } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class SheetService {
	constructor(public firebaseService: FirebaseService) {}

	getSheetDocument(bookId: string, sheetId: string) {
		try {
			if (!bookId || !sheetId) throw new Error('invalid args');
			return <Observable<any>>this.firebaseService.getSheetDocument(bookId, sheetId);
		} catch (error) {
			console.log(error);
			return <Observable<any>>of(false);
		}
	}

	getSheetCollection(bookId: string) {
		try {
			if (!bookId) throw new Error('invalid args');
			return this.firebaseService.getSheetCollection(bookId);
		} catch (error) {
			console.log(error);
			return <Observable<any>>of(false);
		}
	}

	deleteSheet(bookId: string, idToRemove: string) {
		return new Promise((resolve, reject) => {
			try {
				if (!bookId || !idToRemove) throw new Error('invalid args');
				this.firebaseService.removeProductsCollection(bookId, idToRemove);
				this.firebaseService.removeSheet(bookId, idToRemove);
				resolve(true);
			} catch (error) {
				console.log(error);
				resolve(false);
			}
		});
	}

	addSheet(sheetName: string, headingFields: Array<any>, bookId: string) {
		return new Promise(async (resolve, reject) => {
			try {
				if (!sheetName || !headingFields || !bookId) throw new Error('invalid args');
				let sheetId = await this.firebaseService.addSheet(sheetName, headingFields, bookId);
				if (!sheetId) throw new Error('received bad ID');
				this.firebaseService.getDefaultProducts(bookId).subscribe((defaultProducts) => {
					if (!defaultProducts) resolve(false);
					else {
						defaultProducts.forEach((product) => {
							this.firebaseService.addProduct(product, bookId, sheetId).catch((error) => {
								console.log(error);
							});
						});
						resolve(true);
					}
				});
			} catch (error) {
				console.log(error);
				resolve(false);
			}
		});
	}

	getUpdatedHeadingFields(headingFields: Array<any>, newFieldName: string) {
		if (!newFieldName || !headingFields) return new Array();
		else {
			let updatedHeadingFields = [ ...headingFields ];
			let isNew = true;
			headingFields.forEach((field) => {
				if (field.name == newFieldName) isNew = false;
			});
			if (isNew) updatedHeadingFields.push({ name: newFieldName, primary: false, text: true, type: 'text' });
			return updatedHeadingFields;
		}
	}

	getUpdatedProducts(defaultProducts: Array<any>, newFieldName: string) {
		let newProducts = defaultProducts ? [ ...defaultProducts ] : new Array();
		if (newFieldName)
			newProducts.forEach((product) => {
				product[newFieldName] = '[No value]';
			});
		return newProducts;
	}

	addSheetHeader(
		bookId: string,
		sheetId: string,
		fieldName: string,
		headingFields: Array<any>,
		products: Array<any>
	) {
		return new Promise(async (resolve, reject) => {
			try {
				if (
					!bookId ||
					!sheetId ||
					!fieldName ||
					!headingFields ||
					!headingFields.length ||
					!products ||
					!products.length
				)
					throw new Error('invalid args');

				let updatedHeadingFields = this.getUpdatedHeadingFields([ ...headingFields ], fieldName);

				let updatedProducts = this.getUpdatedProducts(products, fieldName);

				if (!await this.firebaseService.updateSheetProducts(bookId, sheetId, updatedProducts)) resolve(false);
				if (!await this.firebaseService.updateSheetHeader(bookId, sheetId, updatedHeadingFields))
					resolve(false);
				resolve(true);
			} catch (error) {
				console.log(error);
				resolve(false);
			}
		});
	}

	updateSheetName(bookId: string, sheetId: string, name: string) {
		return new Promise(async (resolve, reject) => {
			try {
				if (!bookId || !sheetId || !name) throw new Error('invalid args');
				await this.firebaseService.updateSheetName(bookId, sheetId, name);
				resolve(true);
			} catch (error) {
				console.log(error);
				resolve(false);
			}
		});
	}
}
