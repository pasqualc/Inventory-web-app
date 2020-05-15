import { Injectable } from '@angular/core';
import { SheetParseService } from './sheet.parse.service';
import { FirebaseService } from './firebase.service';
import { Observable, of } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class ProductService {
	constructor(public sp: SheetParseService, public firebaseService: FirebaseService) {}

	getProductsCollection(bookId: string, sheetId: string) {
		try {
			if (!bookId || !sheetId) throw new Error('invalid args');
			return <Observable<any>>this.firebaseService.getProductsCollection(bookId, sheetId);
		} catch (error) {
			console.log(error);
			return <Observable<any>>of(false);
		}
	}

	addDefaultProduct(bookId: string, formattedData: Array<any>) {
		return new Promise(async (resolve, reject) => {
			try {
				if (!bookId || !formattedData) throw new Error('invalid args');
				let parsedProduct = this.sp.parseProducts([
					{ data: formattedData, productName: formattedData[0].value }
				])[0];
				let result = await this.firebaseService.addDefaultProduct(parsedProduct, bookId);
				if (result) resolve(true);
				else resolve(false);
			} catch (error) {
				console.log(error);
				resolve(false);
			}
		});
	}

	addProduct(bookId: string, sheetId: string, formattedData?: Array<any>, parsedData?: any) {
		return new Promise(async (resolve, reject) => {
			try {
				if (!bookId || !sheetId) throw new Error('invalid args');

				let parsedProduct;
				if (formattedData)
					parsedProduct = this.sp.parseProducts([
						{ data: formattedData, productName: formattedData[0].value }
					])[0];
				else parsedProduct = parsedData;
				let result = await this.firebaseService.addProduct(parsedProduct, bookId, sheetId);
				if (result) resolve(true);
				else resolve(false);
			} catch (error) {
				console.log(error);
				resolve(false);
			}
		});
	}

	saveProduct(bookId: string, sheetId: string, productToUpdate: any) {
		return new Promise(async (resolve, reject) => {
			try {
				if (!bookId || !productToUpdate) throw new Error('invalid args');
				let parsedProduct = this.sp.parseProducts([ productToUpdate ])[0];
				let productId = parsedProduct.id;
				delete parsedProduct.id;

				if (sheetId) {
					let result = await this.firebaseService.updateSheetProduct(
						parsedProduct,
						bookId,
						sheetId,
						productId
					);
					if (result) resolve(true);
					else resolve(false);
				} else {
					let result = await this.firebaseService.updateDefaultProduct(parsedProduct, bookId, productId);
					if (result) resolve(true);
					else resolve(false);
				}
			} catch (error) {
				console.log(error);
				resolve(false);
			}
		});
	}

	deleteProduct(bookId: string, sheetId: string, productToRemove: any) {
		return new Promise(async (resolve, reject) => {
			try {
				if (!bookId || !productToRemove) throw new Error('invalid args');
				if (sheetId) {
					let result = await this.firebaseService.removeProduct(productToRemove.id, sheetId, bookId);
					if (result) resolve(true);
					else resolve(false);
				} else {
					let result = await this.firebaseService.removeDefaultProduct(productToRemove.id, bookId);
					if (result) resolve(true);
					else resolve(false);
				}
			} catch (error) {
				console.log(error);
				resolve(false);
			}
		});
	}
}
