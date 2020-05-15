import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { SheetParseService } from '../services/sheet.parse.service';
import {
	AddProductDialog,
	AddHeadingFieldDialog,
	EditFieldDialog,
	EditProductDialog
} from '../dialogs/dialogs.component';
import { UserService } from '../services/user.service';
import { SheetService } from '../services/sheet.service';
import { ProductService } from '../services/product.service';

@Component({
	selector: 'app-sheet',
	templateUrl: './sheet-edit.component.html',
	styleUrls: [ './sheet-edit.component.scss' ]
})
export class SheetEditComponent implements OnInit {
	public bookId: string = '';
	public contentLoading: boolean;
	public defaultProducts: any[] = new Array<any>();
	public formattedProducts: Array<any> = new Array<any>();
	public headingFields: Array<any> = new Array<any>();
	public products: Array<any> = new Array<any>();
	public permissions: string = '';
	public sheetId: string = '';
	public sheetName: string = '';
	public sortOrder: string = '';
	public updateNameSuccess: boolean = false;
	public updateNameFailure: boolean = false;

	public compareStr = function(a: string, b: string, isAsc: boolean) {
		return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
	};

	public compareNum = function(a: number, b: number, isAsc: boolean) {
		return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
	};
	private dialogSub: Subscription;
	private productDataSub: Subscription;
	private sheetDataSub: Subscription;
	private sheetIdSub: Subscription;

	constructor(
		public dialog: MatDialog,
		public router: Router,
		public route: ActivatedRoute,
		public sheetService: SheetService,
		public productService: ProductService,
		public sp: SheetParseService,
		public userService: UserService
	) {}

	async ngOnInit() {
		try {
			this.contentLoading = true;
			let userToken = this.userService.getUserToken();
			if (!userToken) throw new Error('missing user token');
			let result = await (<any>this.userService.validateUser(userToken));
			if (!result.token) throw new Error('token validation failed');
			this.permissions = result.permissions ? result.permissions : 'user';
			this.userService.updateUserToken(result.token);
			this.sheetIdSub = this.route.params.subscribe((params) => {
				if (params && params['id'] && params['book']) {
					this.sheetId = params['id'];
					this.bookId = params['book'];
					this.sheetDataSub = this.subToSheetDocument(this.bookId, this.sheetId);
				} else {
					this.router.navigate([ '/books' ]);
				}
			});
			this.contentLoading = false;
		} catch (error) {
			console.log(error);
			this.router.navigate([ '/login' ]);
		}
	}

	ngOnDestroy() {
		if (this.productDataSub) this.productDataSub.unsubscribe();
		if (this.sheetIdSub) this.sheetIdSub.unsubscribe();
		if (this.dialogSub) this.dialogSub.unsubscribe();
		if (this.sheetDataSub) this.sheetDataSub.unsubscribe();
	}

	back() {
		this.router.navigate([ '/books', this.bookId ]);
	}

	subToProductsCollection(bookId: string, sheetId: string) {
		return this.productService.getProductsCollection(bookId, sheetId).subscribe((data: any) => {
			this.products = data.sort((a, b) => {
				if (this.headingFields[0].text)
					return this.compareStr(a[this.headingFields[0].name], b[this.headingFields[0].name], true);
				else return this.compareNum(a[this.headingFields[0].name], b[this.headingFields[0].name], true);
			});
			let result = this.sp.formatProducts(this.products, this.headingFields);
			if (result) this.formattedProducts = result;
		});
	}

	subToSheetDocument(bookId: string, sheetId: string) {
		return this.sheetService.getSheetDocument(bookId, sheetId).subscribe((data) => {
			if (data.name && data.headingFields) {
				this.sheetName = data.name;
				this.handleHeadingFieldsData(data.headingFields);
				this.productDataSub = this.subToProductsCollection(bookId, sheetId);
			} else {
				this.router.navigate([ '/books', this.bookId ]);
			}
		});
	}

	handleHeadingFieldsData(headingFields: Array<any>) {
		this.headingFields = <any>[];
		let unsortedFields = <any>[];
		headingFields.forEach((field) => {
			if (field.primary) this.headingFields.push(field);
			else unsortedFields.push(field);
		});
		if (this.headingFields.length == 0 && unsortedFields.length != 0) {
			this.headingFields.push(unsortedFields[0]);
			this.headingFields[0].primary = true;
			unsortedFields.shift();
		}
		let sortedFields = unsortedFields.sort((a, b) => {
			return this.compareStr(a.name, b.name, true);
		});
		sortedFields.forEach((field) => {
			field.primary = false;
			this.headingFields.push(field);
		});
	}

	hideUpdateMessages() {
		this.updateNameFailure = false;
		this.updateNameSuccess = false;
	}

	openProductCreateDialog() {
		if (this.bookId && this.bookId.length && this.sheetId && this.sheetId.length) {
			this.hideUpdateMessages();
			let formattedData = [ ...this.headingFields ];
			formattedData.forEach((field) => {
				field.value = field.text ? '' : 0;
			});
			this.dialog.open(AddProductDialog, {
				width: '380px',
				data: {
					formattedData,
					bookId: this.bookId,
					sheetId: this.sheetId
				}
			});
		}
	}

	async saveSheetName() {
		try {
			this.hideUpdateMessages();
			let result = await this.sheetService.updateSheetName(this.bookId, this.sheetId, this.sheetName);
			if (result) this.updateNameSuccess = true;
			else this.updateNameFailure = true;
		} catch (error) {
			console.log(error);
			this.updateNameFailure = true;
		}
	}

	editField(field: any) {
		this.hideUpdateMessages();
		if (
			field &&
			this.headingFields &&
			this.products &&
			this.bookId &&
			this.bookId.length &&
			this.sheetId &&
			this.sheetId.length &&
			this.permissions &&
			[ 'admin', 'user' ].includes(this.permissions)
		)
			this.dialog.open(EditFieldDialog, <any>{
				width: '380px',
				data: {
					field,
					headingFields: this.headingFields,
					products: this.products,
					bookId: this.bookId,
					sheetId: this.sheetId,
					permissions: this.permissions
				}
			});
	}

	editProduct(product: any) {
		this.hideUpdateMessages();
		if (
			this.headingFields &&
			product &&
			this.bookId &&
			this.bookId.length &&
			this.sheetId &&
			this.sheetId.length &&
			this.permissions &&
			this.permissions.length
		)
			this.dialog.open(EditProductDialog, <any>{
				width: '380px',
				data: {
					title: 'Edit product',
					headingFields: this.headingFields,
					product,
					bookId: this.bookId,
					sheetId: this.sheetId,
					permissions: this.permissions
				}
			});
	}

	addHeaderField() {
		this.hideUpdateMessages();
		if (
			this.bookId &&
			this.bookId.length &&
			this.sheetId &&
			this.sheetId.length &&
			this.headingFields &&
			this.products
		)
			this.dialog.open(AddHeadingFieldDialog, {
				width: '380px',
				data: <any>{
					name: new String(),
					bookId: this.bookId,
					sheetId: this.sheetId,
					headingFields: this.headingFields,
					products: this.products
				}
			});
	}

	sort() {
		if (this.sortOrder == 'none') {
			this.products = this.products;
		} else {
			const data = this.products.slice();
			const isAsc = this.sortOrder == 'ascending' ? true : false;
			this.products = data.sort((a, b) => {
				if (this.headingFields[0].text)
					return this.compareStr(a[this.headingFields[0].name], b[this.headingFields[0].name], isAsc);
				else return this.compareNum(a[this.headingFields[0].name], b[this.headingFields[0].name], isAsc);
			});
		}
	}
}
