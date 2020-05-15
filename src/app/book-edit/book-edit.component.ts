import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { SheetParseService } from '../services/sheet.parse.service';
import {
	NoHeaderDialog,
	AddHeadingFieldDialog,
	AddProductDialog,
	EditProductDialog,
	EditFieldDialog
} from '../dialogs/dialogs.component';
import { UserService } from '../services/user.service';
import { BookService } from '../services/book.service';

// export interface HeadingField {
// 	name: string;
// 	text: boolean;
// 	type: string;
// 	value: any;
// 	primary: boolean;
// }

@Component({
	selector: 'app-book-edit',
	templateUrl: './book-edit.component.html',
	styleUrls: [ './book-edit.component.scss' ]
})
export class BookEditComponent implements OnInit {
	public bookId: string = 'bookId';
	public bookName: string = 'sheetId';
	public contentLoading: boolean = true;
	public formattedProducts: Array<any> = new Array<any>();
	public headingFields: Array<any> = new Array<any>();
	public defaultProducts: Array<any> = new Array<any>();
	public permissions: string = <string>new String();
	public updateNameSuccess: boolean = false;
	public updateNameFailure: boolean = false;

	private bookIdSub: Subscription;
	private booksListSub: Subscription;
	private currentBookSub: Subscription;
	private dialogSub: Subscription;
	private defaultProductsSub: Subscription;
	private compare = function(a: string, b: string, isAsc: boolean) {
		return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
	};

	constructor(
		public dialog: MatDialog,
		public route: ActivatedRoute,
		public router: Router,
		public bookService: BookService,
		public sp: SheetParseService,
		public userService: UserService
	) {}

	async ngOnInit() {
		try {
			this.contentLoading = true;
			let userToken = this.userService.getUserToken();
			if (!userToken) throw new Error('No user token!');
			let result: any = await this.userService.validateUser(userToken);
			if (!result.token) throw new Error('No user token!');
			this.permissions = result.permissions;
			if (this.permissions != 'admin') throw new Error('Invalid permissions!');
			this.userService.updateUserToken(result.token);
			this.bookIdSub = this.route.params.subscribe((params) => {
				this.bookId = params['id'];
				if (this.bookId && this.bookId != 'new') {
					this.currentBookSub = this.subToCurrentBook();
				} else {
					this.bookName = 'New Book';
				}
			});
			this.contentLoading = false;
		} catch (error) {
			console.log(error);
			this.router.navigate([ '/login' ]);
		}
	}

	ngOnDestory() {
		if (this.bookIdSub) this.bookIdSub.unsubscribe();
		if (this.currentBookSub) this.currentBookSub.unsubscribe();
		if (this.booksListSub) this.booksListSub.unsubscribe();
		if (this.dialogSub) this.dialogSub.unsubscribe();
		if (this.defaultProductsSub) this.defaultProductsSub.unsubscribe();
	}

	subToCurrentBook() {
		return this.bookService.getBookDocument(this.bookId).subscribe((data: any) => {
			if (data && data.headingFields && Array.isArray(data.headingFields) && data.name) {
				this.bookName = data.name;
				this.headingFields = this.processHeadingFields(data.headingFields);
				this.defaultProductsSub = this.bookService
					.getDefaultProducts(this.bookId)
					.subscribe((data: Array<any>) => {
						if (data && Array.isArray(data)) {
							this.setAndFormatDefaultProducts(data);
						}
					});
			} else {
				console.log('Invalid book data');
				this.router.navigate([ '/books/edit', 'new' ]);
			}
		});
	}

	setAndFormatDefaultProducts(incomingProducts: Array<any>) {
		this.defaultProducts = <any>[];
		incomingProducts.forEach((product) => {
			this.headingFields.forEach((field) => {
				if (product[field.name] == undefined) {
					product[field.name] = field.text ? '[No value]' : 0;
				}
			});
		});

		this.defaultProducts = incomingProducts.sort((a: any, b: any) => {
			return this.compare(a[this.headingFields[0].name], b[this.headingFields[0].name], true);
		});

		let result = this.sp.formatProducts(this.defaultProducts, this.headingFields);
		if (result) this.formattedProducts = result;
	}

	processHeadingFields(headingFields: Array<any>) {
		let updatedFields = <any>[];
		let unsortedFields = <any>[];
		headingFields.forEach((field) => {
			if (field.primary) updatedFields.push(field);
			else unsortedFields.push(field);
		});
		if (updatedFields.length == 0 && unsortedFields.length != 0) {
			updatedFields.push(unsortedFields[0]);
			updatedFields[0].primary = true;
			unsortedFields.shift();
		}
		let sortedFields = unsortedFields.sort((a: any, b: any) => {
			return this.compare(a.name, b.name, true);
		});

		sortedFields.forEach((field: any) => {
			field.primary = false;
			updatedFields.push(field);
		});

		return updatedFields;
	}

	async saveName(bookName: string) {
		try {
			if (!bookName) throw new Error('invalid args');
			this.hideUpdateMessages();
			if (this.bookId == 'new') {
				let id = await (<any>this.bookService.addBook(bookName, [
					{ name: 'Default field', primary: true, text: true, type: 'text' }
				]));
				if (id) {
					this.updateNameSuccess = true;
					this.router.navigate([ '/books/edit', id ]);
					this.bookId = id;
				} else throw new Error('aaaa');
			} else {
				let result = await this.bookService.updateBookName(this.bookId, bookName);
				if (result) this.updateNameSuccess = true;
				else throw new Error('bbbbbb');
			}
		} catch (error) {
			console.log(error);
			this.updateNameFailure = true;
		}
	}

	hideUpdateMessages() {
		this.updateNameSuccess = false;
		this.updateNameFailure = false;
	}

	editField(field: any) {
		this.dialog.open(EditFieldDialog, <any>{
			width: '380px',
			data: {
				field,
				headingFields: this.headingFields,
				products: this.defaultProducts,
				bookId: this.bookId,
				permissions: this.permissions
			}
		});
	}

	addField() {
		this.hideUpdateMessages();
		this.dialog.open(AddHeadingFieldDialog, {
			width: '380px',
			data: <any>{
				name: new String(),
				bookId: this.bookId,
				headingFields: this.headingFields,
				products: this.defaultProducts,
				permissions: this.permissions
			}
		});
	}

	editProduct(product: any) {
		this.dialog.open(EditProductDialog, <any>{
			width: '380px',
			data: {
				title: 'Edit product',
				headingFields: this.headingFields,
				product,
				bookId: this.bookId,
				permissions: this.permissions
			}
		});
	}

	addProduct() {
		this.hideUpdateMessages();

		if (this.headingFields.length > 0) {
			let formattedData = new Array();
			for (let i = 0; i < this.headingFields.length; i++) {
				let field = { ...this.headingFields[i] };
				field.value = field.text ? '[No Value]' : 0;
				formattedData.push(field);
			}
			this.dialog.open(AddProductDialog, <any>{
				width: '380px',
				data: {
					bookId: this.bookId,
					formattedData,
					permissions: this.permissions
				}
			});
		} else {
			this.dialog.open(NoHeaderDialog, {
				width: '380px',
				data: {
					permissions: this.permissions
				}
			});
		}
	}
}
