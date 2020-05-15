import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ExcelService } from '../services/excel.service';
import { FirebaseService } from '../services/firebase.service';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../services/user.service';
import { FieldService } from '../services/field.service';
import { ProductService } from '../services/product.service';
import { BookService } from '../services/book.service';
import { SheetService } from '../services/sheet.service';

@Component({
	selector: 'add-heading-field-dialog',
	templateUrl: 'templates/add-heading-field-dialog.html'
})
export class AddHeadingFieldDialog {
	addFailure: boolean = false;
	constructor(
		public dialogRef: MatDialogRef<AddHeadingFieldDialog>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		public bookService: BookService,
		public sheetService: SheetService
	) {}

	addHeadingField() {
		try {
			this.addFailure = false;
			if (!this.data.name.length) throw new Error('invalid book name');
			if (this.data.sheetId) {
				this.sheetService
					.addSheetHeader(
						this.data.bookId,
						this.data.sheetId,
						this.data.name,
						this.data.headingFields,
						this.data.products
					)
					.then((result) => {
						if (result) this.dialogRef.close();
						else this.addFailure = true;
					});
			} else {
				this.bookService
					.addBookHeader(this.data.bookId, this.data.name, this.data.headingFields, this.data.products)
					.then((result) => {
						if (result) this.dialogRef.close();
						else this.addFailure = true;
					});
			}
		} catch (error) {
			console.log(error);
			this.addFailure = true;
		}
	}

	onNoClick(): void {
		this.dialogRef.close();
	}
}

@Component({
	selector: 'edit-user-dialog',
	templateUrl: 'templates/edit-user-dialog.html'
})
export class EditUserDialog {
	updateSuccess: boolean = false;
	updateFailure: boolean = false;

	constructor(
		public dialogRef: MatDialogRef<EditUserDialog>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		public http: HttpClient,
		public userService: UserService
	) {}

	onNoClick(): void {
		this.dialogRef.close();
	}

	saveUser(user: any) {
		this.updateFailure = false;
		this.updateSuccess = false;
		this.userService
			.saveUser(user)
			.then((result: string) => {
				switch (result) {
					case 'close':
						this.dialogRef.close();
						break;
					case 'success':
						this.updateSuccess = true;
						break;
					case 'failure':
						this.updateFailure = true;
						break;
					default:
						this.updateFailure = true;
						break;
				}
			})
			.catch((error) => {
				console.log(error);
				this.updateFailure = true;
			});
	}
}

@Component({
	selector: 'no-header-dialog',
	templateUrl: 'templates/no-header-dialog.html'
})
export class NoHeaderDialog {
	constructor(public dialogRef: MatDialogRef<NoHeaderDialog>) {}

	onNoClick(): void {
		this.dialogRef.close();
	}
}

@Component({
	selector: 'edit-field-dialog',
	templateUrl: 'templates/edit-field-dialog.html'
})
export class EditFieldDialog {
	public updateSuccess: boolean = false;
	public updateFailure: boolean = false;
	private originalFieldData: any;

	constructor(
		public dialogRef: MatDialogRef<EditFieldDialog>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		public firebaseService: FirebaseService,
		public fieldService: FieldService
	) {
		this.originalFieldData = { ...this.data.field };
	}

	deleteField() {
		this.updateSuccess = false;
		this.updateFailure = false;
		this.fieldService
			.deleteField(
				this.data.bookId,
				this.data.sheetId,
				this.data.field,
				this.data.headingFields,
				this.data.products
			)
			.then((result: boolean) => {
				if (result) this.dialogRef.close();
				else this.updateFailure = true;
			})
			.catch((error: any) => {
				console.log(error);
				this.updateFailure = true;
			});
	}

	saveField(fieldToUpdate: any) {
		this.updateSuccess = false;
		this.updateFailure = false;
		this.fieldService
			.saveField(
				this.data.bookId,
				this.data.sheetId,
				fieldToUpdate,
				this.originalFieldData,
				this.data.headingFields,
				this.data.products
			)
			.then((result) => {
				if (result) this.updateSuccess = true;
				else this.updateFailure = true;
			})
			.catch((error) => {
				console.log(error);
				this.updateFailure = true;
			});
	}

	onNoClick(): void {
		this.dialogRef.close();
	}
}

@Component({
	selector: 'edit-product-dialog',
	templateUrl: 'templates/edit-product-dialog.html'
})
export class EditProductDialog {
	updateSuccess: boolean;
	updateFailure: boolean;

	constructor(
		public dialogRef: MatDialogRef<EditProductDialog>,
		public productService: ProductService,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {
		this.updateSuccess = false;
		this.updateFailure = false;
	}

	saveProduct(product: any) {
		this.updateSuccess = false;
		this.updateFailure = false;
		this.productService
			.saveProduct(this.data.bookId, this.data.sheetId, product)
			.then((result) => {
				if (result) {
					this.updateSuccess = true;
				} else {
					this.updateFailure = true;
				}
			})
			.catch((error) => {
				console.log(error);
			});
		if (!navigator.onLine) this.dialogRef.close();
	}

	deleteProduct(product: any) {
		this.updateSuccess = false;
		this.updateFailure = false;

		this.productService.deleteProduct(this.data.bookId, this.data.sheetId, product).then((result) => {
			if (result) this.dialogRef.close();
			else this.updateFailure = true;
		});
		if (!navigator.onLine) this.dialogRef.close();
	}

	onNoClick(): void {
		this.dialogRef.close();
	}
}

@Component({
	selector: 'add-product-dialog',
	templateUrl: 'templates/add-product-dialog.html'
})
export class AddProductDialog {
	addFailure: boolean;
	constructor(
		public dialogRef: MatDialogRef<AddProductDialog>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		public productService: ProductService
	) {
		this.addFailure = false;
	}

	addProduct() {
		this.addFailure = false;
		if (this.data.sheetId) {
			this.productService
				.addProduct(this.data.bookId, this.data.sheetId, this.data.formattedData, undefined)
				.then((result) => {
					if (result) this.dialogRef.close();
					else this.addFailure = true;
				})
				.catch(() => {
					this.addFailure = true;
				});
			if (!navigator.onLine) this.dialogRef.close();
		} else {
			this.productService
				.addDefaultProduct(this.data.bookId, this.data.formattedData)
				.then((result) => {
					if (result) this.dialogRef.close();
					else this.addFailure = true;
				})
				.catch(() => {
					this.addFailure = true;
				});
		}
		if (!navigator.onLine) this.dialogRef.close();
	}

	onNoClick(): void {
		this.dialogRef.close();
	}
}

@Component({
	selector: 'delete-user-dialog',
	templateUrl: 'templates/delete-user-dialog.html'
})
export class DeleteUserDialog {
	updateFailure: boolean = false;

	constructor(
		public dialogRef: MatDialogRef<DeleteUserDialog>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		public userService: UserService
	) {}

	onConfirmClick(): void {
		this.updateFailure = false;
		this.userService
			.deleteUser(this.data.id)
			.then((result) => {
				if (result) this.dialogRef.close();
				else this.updateFailure = true;
			})
			.catch((error) => {
				console.log(error);
				this.updateFailure = true;
			});
		if (!navigator.onLine) this.dialogRef.close();
	}

	onNoClick(): void {
		this.dialogRef.close();
	}
}

@Component({
	selector: 'delete-sheet-dialog',
	templateUrl: 'templates/delete-sheet-dialog.html'
})
export class DeleteSheetDialog {
	updateFailure: boolean = false;

	constructor(
		public dialogRef: MatDialogRef<DeleteSheetDialog>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		public sheetService: SheetService
	) {}

	onConfirmClick(): void {
		this.updateFailure = false;
		this.sheetService
			.deleteSheet(this.data.bookId, this.data.sheetId)
			.then(() => {
				this.dialogRef.close();
			})
			.catch((error) => {
				console.log(error);
				this.updateFailure = true;
			});
		if (!navigator.onLine) this.dialogRef.close();
	}

	onNoClick(): void {
		this.dialogRef.close();
	}
}

@Component({
	selector: 'delete-book-dialog',
	templateUrl: 'templates/delete-book-dialog.html'
})
export class DeleteBookDialog {
	updateFailure: boolean = false;

	constructor(
		public dialogRef: MatDialogRef<DeleteBookDialog>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		public bookService: BookService
	) {}

	onConfirmClick(): void {
		this.updateFailure = false;
		this.bookService
			.deleteBook(this.data.id)
			.then((result) => {
				if (result) this.dialogRef.close();
				else this.updateFailure = true;
			})
			.catch((error) => {
				console.log(error);
				this.updateFailure = true;
			});
		if (!navigator.onLine) this.dialogRef.close();
	}

	onNoClick(): void {
		this.dialogRef.close();
	}
}

@Component({
	selector: 'export-book-dialog',
	templateUrl: 'templates/export-book-dialog.html'
})
export class ExportBookDialog {
	exportFailure: boolean = false;

	constructor(
		public dialogRef: MatDialogRef<ExportBookDialog>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		public excelService: ExcelService
	) {}

	exportBook(): void {
		this.exportFailure = false;
		if (this.data.name && this.data.name.length) {
			this.excelService
				.exportBook(this.data.name, this.data.sheets, this.data.bookId)
				.then((result) => {
					if (result) this.dialogRef.close();
					else this.exportFailure = true;
				})
				.catch((error) => {
					console.log(error);
					this.exportFailure = true;
				});
		}
		if (!navigator.onLine) this.dialogRef.close();
	}

	onNoClick(): void {
		this.dialogRef.close();
	}
}

@Component({
	selector: 'create-sheet-dialog',
	templateUrl: 'templates/create-sheet-dialog.html'
})
export class CreateSheetDialog {
	createFailure: boolean = false;
	constructor(
		public dialogRef: MatDialogRef<CreateSheetDialog>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		public sheetService: SheetService
	) {}

	createSheet() {
		this.createFailure = false;
		try {
			if (!this.data.name.length) throw new Error('invalid book name');
			this.sheetService.addSheet(this.data.name, this.data.headingFields, this.data.bookId).then((result) => {
				if (result) this.dialogRef.close();
				else this.createFailure = true;
			});
			if (!navigator.onLine) this.dialogRef.close();
		} catch (error) {
			console.log(error);
			this.createFailure = true;
		}
	}

	onNoClick(): void {
		this.dialogRef.close();
	}
}

@Component({
	selector: 'import-book-dialog',
	templateUrl: 'templates/import-book-dialog.html'
})
export class ImportBookDialog {
	importFailure: boolean = false;
	validBookName: boolean = false;
	constructor(
		public dialogRef: MatDialogRef<ImportBookDialog>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private excelService: ExcelService,
		public bookService: BookService
	) {}

	async fileChange(event: any) {
		try {
			const excelImport = await this.excelService.importExcelFile(event);
			if (!excelImport.result) throw new Error('import failed');
			this.data.importedBook = excelImport.bookJSON;
			this.isValidBookName(<string>this.data.importedBook.name)
				.then((result: any) => {
					if (result && event.target.files[0]) {
						this.validBookName = true;
					}
				})
				.catch((error: Error) => {
					throw error;
				});
			if (!navigator.onLine) this.dialogRef.close();
		} catch (error) {
			console.log('IMPORT FAILURE', error);
		}
	}

	async importBook() {
		try {
			this.importFailure = false;
			if (!await this.bookService.isValidBookName(this.data.importedBook.name))
				throw new Error('invalid book name');
			let parsedSheets = this.excelService.parseSheet(this.data.importedBook.sheets);
			this.bookService.addImportedDataToFirebase(this.data.importedBook.name, parsedSheets).then((result) => {
				if (result) this.dialogRef.close();
				else this.importFailure = true;
			});
			if (!navigator.onLine) this.dialogRef.close();
		} catch (error) {
			console.log(error);
			this.importFailure = true;
		}
	}

	isValidBookName(bookName: string): any {
		return new Promise((resolve, reject) => {
			this.bookService
				.isValidBookName(bookName)
				.then((result) => {
					resolve(<boolean>result);
				})
				.catch((error) => {
					reject(error);
				});
		});
	}

	onNoClick(): void {
		this.dialogRef.close();
	}
}
