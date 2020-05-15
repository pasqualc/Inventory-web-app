import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { SheetParseService } from './sheet.parse.service';

@Injectable({
	providedIn: 'root'
})
export class FieldService {
	constructor(public firebaseService: FirebaseService, public sp: SheetParseService) {}

	removeFieldFromFields(headingFields: Array<any>, fieldToRemove: any) {
		let updatedFields = [];
		headingFields.forEach((field) => {
			if (field != fieldToRemove) updatedFields.push(field);
		});
		return updatedFields;
	}

	removeFieldFromProducts(products: Array<any>, fieldToRemove: any) {
		let updatedProducts = [];
		products.forEach((product) => {
			let newProduct = { ...product };
			delete newProduct[fieldToRemove.name];
			updatedProducts.push(newProduct);
		});
		return updatedProducts;
	}

	deleteField(bookId: string, sheetId: string, fieldToRemove: any, headingFields: Array<any>, products: Array<any>) {
		return new Promise((resolve, reject) => {
			if (bookId && fieldToRemove && headingFields && products) {
				let updatedFields = this.removeFieldFromFields(headingFields, fieldToRemove);
				let updatedProducts = this.removeFieldFromProducts(products, fieldToRemove);
				if (sheetId) {
					this.firebaseService
						.updateSheetProducts(bookId, sheetId, updatedProducts)
						.then((result) => {
							if (result) {
								this.firebaseService
									.updateSheetHeader(bookId, sheetId, updatedFields)
									.then((result) => {
										if (result) {
											resolve(true);
										}
									})
									.catch((error) => {
										console.log(error);
										resolve(false);
									});
							} else {
								resolve(false);
							}
						})
						.catch((error) => {
							console.log(error);
							resolve(false);
						});
				} else {
					this.firebaseService
						.updateBookProducts(bookId, updatedProducts)
						.then((result) => {
							if (result) {
								this.firebaseService
									.updateBookHeader(bookId, updatedFields)
									.then((result) => {
										if (result) {
											resolve(true);
										}
									})
									.catch((error) => {
										console.log(error);
										resolve(false);
									});
							} else {
								resolve(false);
							}
						})
						.catch((error) => {
							console.log(error);
							resolve(false);
						});
				}
			} else {
				resolve(false);
			}
		});
	}

	replaceFieldInFields(headingFields: Array<any>, fieldToReplace: any, newField: any) {
		let newHeadingFields = [];
		headingFields.forEach((field) => {
			if (field != fieldToReplace) {
				field.text = field.type == 'text' ? true : false;
				newHeadingFields.push(field);
			} else {
				newField.text = newField.type == 'text' ? true : false;
				newHeadingFields.push(newField);
			}
		});
		return newHeadingFields;
	}

	setPrimary(headingFields: Array<any>, fieldToUpdate: any) {
		if (fieldToUpdate.primary) {
			headingFields.forEach((field) => {
				if (field != fieldToUpdate) field.primary = false;
			});
		} else {
			let noPrimary = true;
			headingFields.forEach((field) => {
				if (field.primary) noPrimary = false;
			});
			if (noPrimary) headingFields[1].primary = true;
		}
		return headingFields;
	}

	updateFieldName(products: Array<any>, fieldToUpdate: any, originalFieldData: any) {
		if (fieldToUpdate.name != originalFieldData.name) {
			products.forEach((product: any) => {
				product[fieldToUpdate.name] = product[originalFieldData.name];
				delete product[originalFieldData.name];
			});
		}
		return products;
	}

	saveField(
		bookId: string,
		sheetId: string,
		fieldToUpdate: any,
		originalFieldData: any,
		headingFields: Array<any>,
		products: Array<any>
	) {
		return new Promise((resolve, reject) => {
			if (bookId && fieldToUpdate && originalFieldData && headingFields && products) {
				let newHeadingFields = this.replaceFieldInFields(headingFields, originalFieldData, fieldToUpdate);
				newHeadingFields = this.setPrimary(newHeadingFields, fieldToUpdate);
				products = this.updateFieldName(products, fieldToUpdate, originalFieldData);
				let formattedProducts = this.sp.formatProducts(products, newHeadingFields);
				let updatedProducts;
				if (formattedProducts) {
					updatedProducts = this.sp.parseProducts(formattedProducts);
				} else {
					updatedProducts = [];
				}
				if (sheetId) {
					this.firebaseService
						.updateSheetHeader(bookId, sheetId, [ ...newHeadingFields ])
						.then(() => {
							this.firebaseService
								.updateSheetProducts(bookId, sheetId, updatedProducts)
								.then(() => {
									resolve(true);
								})
								.catch((error) => {
									throw error;
								});
						})
						.catch((error) => {
							console.log('Update book header ERROR --', error);
							resolve(false);
						});
				} else {
					this.firebaseService
						.updateBookHeader(bookId, [ ...newHeadingFields ])
						.then(() => {
							this.firebaseService
								.updateBookProducts(bookId, updatedProducts)
								.then(() => {
									resolve(true);
								})
								.catch((error) => {
									throw error;
								});
						})
						.catch((error) => {
							console.log('Update book header ERROR --', error);
							resolve(false);
						});
				}
			} else {
				resolve(false);
			}
		});
	}
}
