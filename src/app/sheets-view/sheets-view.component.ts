import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Sort } from '@angular/material/sort';
import { SheetParseService } from '../services/sheet.parse.service';
import { UserService } from '../services/user.service';
import { SheetService } from '../services/sheet.service';
import { ProductService } from '../services/product.service';
import { BookService } from '../services/book.service';

export interface ItemData {
	name: string;
	unit: string;
	vendor: string;
}

export interface Book {
	name: string;
	defaultProducts: ItemData[];
}

@Component({
	selector: 'app-sheets-view',
	templateUrl: './sheets-view.component.html',
	styleUrls: [ './sheets-view.component.scss' ]
})
export class SheetsViewComponent implements OnInit {
	public bookId: string = '';
	public contentLoading: boolean;
	public headingFields: Array<any> = new Array<any>();
	public products: Array<any> = new Array<any>();
	public permissions: string = '';
	public sheetId: string = '';
	public sheetName: string = '';
	public sortedProducts: Array<any> = new Array<any>();

	public compareStr = function(a: string, b: string, isAsc: boolean) {
		return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
	};

	public compareNum = function(a: number, b: number, isAsc: boolean) {
		return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
	};

	private currentBookSub: Subscription;
	private productDataSub: Subscription;
	private bookDataSub: Subscription;
	private sheetIdSub: Subscription;

	constructor(
		public router: Router,
		public route: ActivatedRoute,
		public sp: SheetParseService,
		public sheetService: SheetService,
		public productService: ProductService,
		public userService: UserService
	) {}

	async ngOnInit() {
		try {
			this.contentLoading = true;
			let userToken = this.userService.getUserToken();
			if (!userToken) throw new Error('missing user token');
			let result = await (<any>this.userService.validateUser(userToken));
			if (!result.token) throw new Error('token validation failed');
			this.permissions = result.permissions;
			this.userService.updateUserToken(result.token);
			this.sheetIdSub = this.route.params.subscribe((params) => {
				if (params['id'] && params['book']) {
					this.sheetId = params['id'];
					this.bookId = params['book'];
					this.bookDataSub = this.subToSheetDocument(this.bookId, this.sheetId);
				} else {
					// Missing book ID or sheet ID
					this.userService.removeUserToken();
					this.router.navigate([ '/login' ]);
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
		if (this.currentBookSub) this.currentBookSub.unsubscribe();
		if (this.bookDataSub) this.bookDataSub.unsubscribe();
	}

	back() {
		this.router.navigate([ '/books', this.bookId ]);
	}

	subToProductsCollection(bookId: string, sheetId: string) {
		return this.productService.getProductsCollection(bookId, sheetId).subscribe((data) => {
			if (data.length > 0) {
				this.products = this.processProducts(data, this.headingFields);
				this.sortedProducts = this.products.sort((a, b) => {
					if (this.headingFields[0].text)
						return this.compareStr(a[this.headingFields[0].name], b[this.headingFields[0].name], true);
					else return this.compareNum(a[this.headingFields[0].name], b[this.headingFields[0].name], true);
				});
			}
		});
	}

	subToSheetDocument(bookId: string, sheetId: string) {
		return this.sheetService.getSheetDocument(this.bookId, this.sheetId).subscribe((sheetData) => {
			if (sheetData.headingFields) {
				this.sheetName = sheetData.name;
				let processedFields = this.processHeadingFields(sheetData.headingFields);
				this.headingFields = this.setHeadingFieldIndexes(processedFields);
			}
			if (this.bookDataSub) this.bookDataSub.unsubscribe();
			this.productDataSub = this.subToProductsCollection(bookId, sheetId);
		});
	}

	setHeadingFieldIndexes(headingFields: Array<any>) {
		let indexedFields = [ ...headingFields ];
		let index = 0;
		if (headingFields)
			indexedFields.forEach((field) => {
				field.index = `${index}`;
				index++;
			});
		return indexedFields;
	}

	processProducts(productData: Array<any>, headingFields: Array<any>) {
		let processedProducts = new Array<any>();
		productData.forEach((product) => {
			headingFields.forEach((field) => {
				if (!product[field.name]) product[field.name] = field.text ? '[NO VALUE]' : 0;
			});
			processedProducts.push(product);
		});
		return processedProducts;
	}

	processHeadingFields(headingFields: Array<any>) {
		let processedheadingFields = <any>[];
		let unsortedFields = <any>[];
		headingFields.forEach((field) => {
			if (field.primary) processedheadingFields.push(field);
			else unsortedFields.push(field);
		});

		if (processedheadingFields.length == 0 && unsortedFields.length != 0) {
			processedheadingFields.push(unsortedFields[0]);
			processedheadingFields[0].primary = true;
			unsortedFields.shift();
		}

		let sortedFields = unsortedFields.sort((a, b) => {
			return this.compareStr(a.name, b.name, true);
		});

		sortedFields.forEach((field) => {
			field.primary = false;
			processedheadingFields.push(field);
		});

		return processedheadingFields;
	}

	editSheet() {
		this.router.navigate([ '/sheets/edit', this.bookId, this.sheetId ]);
	}

	sortChange(sort: Sort) {
		this.sortedProducts = this.sortData(
			sort.active,
			sort.direction,
			[ ...this.products ],
			[ ...this.headingFields ]
		);
	}

	sortData(active: string, direction: string, products: Array<any>, headingFields: Array<any>) {
		if (!active || direction === '') {
			return products;
		} else {
			let sortedProducts: Array<any> = products.sort((a, b) => {
				const isAsc = direction === 'asc';
				if (headingFields[parseInt(active)].text)
					return this.compareStr(
						a[headingFields[parseInt(active)].name],
						b[headingFields[parseInt(active)].name],
						isAsc
					);
				else
					return this.compareNum(
						a[headingFields[parseInt(active)].name],
						b[headingFields[parseInt(active)].name],
						isAsc
					);
			});
			return sortedProducts;
		}
	}
}
