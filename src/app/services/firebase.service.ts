import { Injectable, isDevMode } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { MockBookListData, MockBookDocument, MockDefaultProducts } from 'e2e/mocks/book.data';
import { MockUserData } from 'e2e/mocks/user.data';
import { MockSheetDocument, MockSheetListData } from 'e2e/mocks/sheet.data';
import { MockProductsData } from 'e2e/mocks/product.data';

@Injectable({
	providedIn: 'root'
})
export class FirebaseService {
	constructor(private db: AngularFirestore) {}

	getProductsCollection(bookId: string, sheetId: string) {
		try {
			if (!bookId) throw new Error('invalid args');
			if (!sheetId) throw new Error('invalid args');
			if (isDevMode()) return <Observable<any>>of(MockProductsData);
			else
				return this.db
					.collection(`/books/${bookId}/sheets/${sheetId}/products`)
					.valueChanges({ idField: 'id' });
		} catch (error) {
			console.log(error);
			return <Observable<any>>of(false);
		}
	}

	addProduct(product: any, bookId: string, sheetId: string) {
		return new Promise(async (resolve, reject) => {
			try {
				if (!product) throw new Error('Invalid args');
				if (!bookId) throw new Error('Invalid args');
				if (!sheetId) throw new Error('Invalid args');
				delete product.id;
				if (!isDevMode()) await this.db.collection(`/books/${bookId}/sheets/${sheetId}/products`).add(product);
				resolve(true);
			} catch (error) {
				console.log(error);
				resolve(false);
			}
		});
	}

	removeProduct(productId: string, sheetId: string, bookId: string) {
		return new Promise(async (resolve, reject) => {
			try {
				if (!productId) throw new Error('invalid args');
				else if (!sheetId) throw new Error('invalid args');
				else if (!bookId) throw new Error('invalid args');
				if (!isDevMode())
					await this.db
						.collection<any>(`/books/${bookId}/sheets/${sheetId}/products`)
						.doc(productId)
						.delete();
				resolve(true);
			} catch (error) {
				console.log(error);
				resolve(false);
			}
		});
	}

	updateProduct(updateData: any, bookId: string, sheetId: string, productId: string) {
		return new Promise(async (resolve, reject) => {
			try {
				if (!updateData) throw new Error('invalid args');
				if (!bookId) throw new Error('invalid args');
				if (!sheetId) throw new Error('invalid args');
				if (!productId) throw new Error('invalid args');
				if (!isDevMode())
					this.db.doc<any>(`/books/${bookId}/sheets/${sheetId}/products/${productId}`).update(updateData);
				resolve(true);
			} catch (error) {
				console.log(error);
				resolve(false);
			}
		});
	}

	removeProductsCollection(bookId: string, sheetId: string) {
		return new Promise(async (resolve, reject) => {
			try {
				if (!bookId) throw new Error('invalid args');
				if (!sheetId) throw new Error('invalid args');
				if (isDevMode()) resolve(true);
				else
					this.db
						.collection<any>(`/books/${bookId}/sheets/${sheetId}/products`)
						.valueChanges({ idField: 'id' })
						.subscribe((products) => {
							products.forEach(async (product) => {
								try {
									this.removeProduct(product.id, sheetId, bookId);
								} catch (error) {
									console.log(error);
								}
							});
							resolve(true);
						});
			} catch (error) {
				console.log(error);
				resolve(false);
			}
		});
	}

	getSheetDocument(bookId: string, sheetId: string) {
		try {
			if (!bookId) throw new Error('invalid args');
			if (!sheetId) throw new Error('invalid args');
			if (isDevMode()) return <Observable<any>>of(MockSheetDocument);
			else return this.db.doc<any>(`/books/${bookId}/sheets/${sheetId}`).valueChanges();
		} catch (error) {
			console.log(error);
			return <Observable<any>>of(false);
		}
	}

	getSheetCollection(bookId: string) {
		try {
			if (!bookId) throw new Error('invalid args');
			if (isDevMode()) return <Observable<any>>of(MockSheetListData);
			else return this.db.collection<any>(`/books/${bookId}/sheets`).valueChanges({ idField: 'id' });
		} catch (error) {
			console.log(error);
			return <Observable<any>>of(false);
		}
	}

	addSheet(sheetName: string, headingFields: Array<any>, bookId: string) {
		return new Promise<string>(async (resolve, reject) => {
			try {
				if (!bookId) throw new Error('invalid args');
				if (!sheetName) throw new Error('invalid args');
				if (!headingFields) headingFields = [];
				if (isDevMode()) resolve('newID');
				else {
					this.db
						.collection<any>(`/books/${bookId}/sheets`)
						.add({ name: sheetName, headingFields: headingFields })
						.then((sheetMeta: any) => {
							resolve(<string>sheetMeta.id);
						})
						.catch((error) => {
							console.log(error);
							resolve('');
						});
				}
			} catch (error) {
				console.log(error);
				resolve('');
			}
		});
	}

	removeSheet(bookId: string, sheetId: string) {
		return new Promise(async (resolve, reject) => {
			try {
				if (!bookId) throw new Error('invalid args');
				if (!sheetId) throw new Error('invalid args');
				if (!isDevMode()) this.db.collection<any>(`/books/${bookId}/sheets`).doc(sheetId).delete();
				resolve(true);
			} catch (error) {
				console.log(error);
				resolve(false);
			}
		});
	}

	updateSheetProduct(product: any, bookId: string, sheetId: string, productId: string) {
		return new Promise(async (resolve, reject) => {
			try {
				if (!product) throw new Error('invalid args');
				if (!bookId) throw new Error('invalid args');
				if (!sheetId) throw new Error('invalid args');
				if (!productId) throw new Error('invalid args');
				if (!isDevMode())
					this.db.collection<any>(`/books/${bookId}/sheets/${sheetId}/products`).doc(productId).set(product);
				resolve({ success: true });
			} catch (error) {
				console.log(error);
				resolve(false);
			}
		});
	}

	updateSheetProducts(bookId: string, sheetId: string, products: Array<any>) {
		return new Promise(async (resolve, reject) => {
			try {
				if (!bookId) throw new Error('invalid args');
				else if (!sheetId) throw new Error('invalid args');
				else if (!products) throw new Error('invalid args');

				if (!isDevMode())
					products.forEach(async (product) => {
						try {
							if (!product.id) throw new Error('No product ID');
							let id = product.id;
							delete product.id;
							this.db.collection<any>(`/books/${bookId}/sheets/${sheetId}/products`).doc(id).set(product);
						} catch (error) {
							console.log(error);
						}
					});
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
				if (!bookId) throw new Error('invalid args');
				if (!sheetId) throw new Error('invalid args');
				if (!name) throw new Error('invalid args');
				if (!isDevMode()) this.db.doc<any>(`/books/${bookId}/sheets/${sheetId}`).update({ name });
				resolve(true);
			} catch (error) {
				console.log(error);
				resolve(false);
			}
		});
	}

	updateSheetHeader(bookId: string, sheetId: string, headingFields: Array<any>) {
		return new Promise(async (resolve, reject) => {
			try {
				if (!bookId) throw new Error('invalid args');
				if (!sheetId) throw new Error('invalid args');
				if (!headingFields) throw new Error('invalid args');
				if (!isDevMode()) this.db.doc<any>(`/books/${bookId}/sheets/${sheetId}`).update({ headingFields });
				resolve(true);
			} catch (error) {
				console.log(error);
				resolve(false);
			}
		});
	}

	getBookDocument(bookId: string) {
		try {
			if (isDevMode()) return <Observable<any>>of(MockBookDocument);
			else return this.db.collection<any>(`/books`).doc(bookId).valueChanges();
		} catch (error) {
			console.log(error);
			return <Observable<any>>of(false);
		}
	}

	getBooksCollection() {
		try {
			if (isDevMode()) return <Observable<any>>of(MockBookListData);
			else return this.db.collection<any>('/books').valueChanges({ idField: 'id' });
		} catch (error) {
			console.log(error);
			return <Observable<any>>of(false);
		}
	}

	getDefaultProducts(bookId: string) {
		try {
			if (!bookId) throw new Error('invalid args');
			if (isDevMode()) return <Observable<any>>of(MockDefaultProducts);
			else return this.db.collection<any>(`/books/${bookId}/defaultProducts`).valueChanges({ idField: 'id' });
		} catch (error) {
			console.log(error);
			return <Observable<any>>of(false);
		}
	}

	updateBookName(id: string, name: string) {
		return new Promise(async (resolve, reject) => {
			try {
				if (!id) throw new Error('invalid args');
				if (!name) throw new Error('invalid args');
				if (!isDevMode()) this.db.doc<any>(`/books/${id}`).update({ name });
				resolve(true);
			} catch (error) {
				console.log(error);
				resolve(false);
			}
		});
	}

	updateBookHeader(id: string, headingFields: Array<any>) {
		return new Promise(async (resolve, reject) => {
			try {
				if (!id) throw new Error('invalid args');
				if (!headingFields) throw new Error('invalid args');
				if (!isDevMode()) this.db.doc<any>(`/books/${id}`).update({ headingFields });
				resolve(true);
			} catch (error) {
				console.log(error);
				resolve(false);
			}
		});
	}

	updateDefaultProduct(product: any, bookId: string, productId: string) {
		return new Promise(async (resolve, reject) => {
			try {
				if (!product) throw new Error('invalid args');
				if (!bookId) throw new Error('invalid args');
				if (!productId) throw new Error('invalid args');
				if (!isDevMode())
					this.db.collection<any>(`/books/${bookId}/defaultProducts`).doc(productId).set(product);
				resolve(true);
			} catch (error) {
				console.log(error);
				resolve(false);
			}
		});
	}

	updateBookProducts(bookId: string, products: Array<any>) {
		return new Promise(async (resolve, reject) => {
			try {
				if (!bookId) throw new Error('invalid args');
				if (!products) throw new Error('invalid args');
				if (!isDevMode())
					products.forEach(async (product) => {
						let id = product.id;
						delete product.id;
						this.db
							.collection<any>(`/books/${bookId}/defaultProducts`)
							.doc(id)
							.set(product)
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

	removeDefaultProduct(productId: string, bookId: string) {
		return new Promise(async (resolve, reject) => {
			try {
				if (!productId) throw new Error('invlaid args');
				else if (!bookId) throw new Error('invlaid args');
				if (!isDevMode()) this.db.collection<any>(`/books/${bookId}/defaultProducts`).doc(productId).delete();
				resolve(true);
			} catch (error) {
				console.log(error);
				resolve(false);
			}
		});
	}

	removeBook(bookId: string) {
		return new Promise(async (resolve, reject) => {
			try {
				if (!bookId) throw new Error('invalid args');
				if (!isDevMode()) this.db.collection<any>(`/books`).doc(bookId).delete();
				resolve(true);
			} catch (error) {
				console.log(error);
				resolve(false);
			}
		});
	}

	addBook(name: string, headingFields: Array<any>) {
		return new Promise(async (resolve, reject) => {
			try {
				if (!name) throw new Error('invalid args');
				if (!headingFields) throw new Error('invalid args');
				if (isDevMode()) resolve(true);
				else
					this.db
						.collection<any>(`/books`)
						.add({ name, headingFields })
						.then((bookMeta) => {
							resolve(bookMeta.id);
						})
						.catch((error) => {
							console.log(error);
							resolve(false);
						});
			} catch (error) {
				console.log(error);
				resolve(false);
			}
		});
	}

	addDefaultProduct(product: any, bookId: string) {
		return new Promise(async (resolve, reject) => {
			try {
				if (!product) throw new Error('invalid args');
				if (!bookId) throw new Error('invalid args');
				delete product.id;
				if (!isDevMode()) this.db.collection<any>(`/books/${bookId}/defaultProducts`).add(product);
				resolve(true);
			} catch (error) {
				console.log(error);
				resolve(false);
			}
		});
	}

	isValidBookName(bookName: string) {
		return new Promise(async (resolve, reject) => {
			try {
				if (!bookName) throw new Error('Invalid book name.');
				let isNew = true;
				this.getBooksCollection().subscribe((data) => {
					data.forEach((book) => {
						const bookNameTokens = bookName.split('.');
						let name = '';
						for (let i = 0; i < bookNameTokens.length - 1; i++) {
							name += bookNameTokens[i];
						}
						if (book.name == name) isNew = false;
					});
					resolve(isNew);
				});
				if (!navigator.onLine) resolve(true);
			} catch (error) {
				console.log(error);
				resolve(false);
			}
		});
	}

	updateUser(user: any) {
		return new Promise(async (resolve, reject) => {
			try {
				if (!user || !user.id) throw new Error('invalid args');
				if (isDevMode()) resolve(true);
				let id = user.id;
				delete user.id;
				if (!isDevMode()) this.db.collection<any>(`/users`).doc(id).set(user);
				resolve(true);
			} catch (error) {
				console.log(error);
				resolve(false);
			}
		});
	}

	deleteUser(idToDelete: string) {
		return new Promise(async (resolve, reject) => {
			try {
				if (!idToDelete) throw new Error('invalid args');
				if (!isDevMode()) this.db.collection<any>(`/users`).doc(idToDelete).delete();
				resolve(true);
			} catch (error) {
				console.log(error);
				resolve(false);
			}
		});
	}

	addUser(user: any) {
		return new Promise(async (resolve, reject) => {
			try {
				if (!user) throw new Error('invalid args');
				if (isDevMode()) resolve('newID');
				delete user.id;
				this.db
					.collection<any>(`/users`)
					.add(user)
					.then((userMeta) => {
						resolve(userMeta.id);
					})
					.catch((error) => {
						console.log(error);
						reject(error);
					});
			} catch (error) {
				console.log(error);
				resolve(false);
			}
		});
	}

	getUsers() {
		try {
			if (isDevMode()) return <Observable<any>>of(MockUserData);
			else return this.db.collection<any>('/users').valueChanges({ idField: 'id' });
		} catch (error) {
			console.log(error);
			return <Observable<any>>of(false);
		}
	}
}
