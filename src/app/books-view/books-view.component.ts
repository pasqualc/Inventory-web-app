import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { ExportBookDialog, CreateSheetDialog, DeleteSheetDialog } from '../dialogs/dialogs.component';
import { UserService } from '../services/user.service';
import { BookService } from '../services/book.service';
import { SheetService } from '../services/sheet.service';

@Component({
	selector: 'app-books-view',
	templateUrl: './books-view.component.html',
	styleUrls: [ './books-view.component.scss' ]
})
export class BooksViewComponent implements OnInit {
	public bookId: string = <string>new String();
	public bookName: string = <string>new String();
	public contentLoading: boolean = true;
	public headingFields: Array<any> = new Array<any>();
	public permissions: string = <string>new String();
	public sheets: Array<any> = new Array<any>();
	public sortedSheets: Array<any> = new Array<any>();
	public sortOrder: string = 'ascending';

	private bookDataSub: Subscription;
	private bookIdSub: Subscription;
	private compare = function(a: string, b: string, isAsc: boolean) {
		return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
	};
	private dialogSub: Subscription;
	private defaultProductsSub: Subscription;
	private productsCollectionSub: Subscription;
	private sheetDataSub: Subscription;

	constructor(
		public bookService: BookService,
		public dialog: MatDialog,
		public route: ActivatedRoute,
		public router: Router,
		public sheetService: SheetService,
		public userService: UserService
	) {}

	async ngOnInit() {
		try {
			this.contentLoading = true;
			let userToken = this.userService.getUserToken();
			if (!userToken) throw new Error('No user token!');
			let result: any = await this.userService.validateUser(userToken);
			if (!result.token) throw new Error(result.message);
			this.permissions = result.permissions;
			this.userService.updateUserToken(result.token);
			this.bookIdSub = this.route.params.subscribe((params) => {
				try {
					if (!params || !params['id']) throw new Error('no ID param');
					this.bookId = params['id'];
					this.bookDataSub = this.subToBookDocument(this.bookId);
				} catch (error) {
					console.log(error);
					this.router.navigate([ '/login' ]);
				}
			});
			this.contentLoading = false;
		} catch (error) {
			console.log(error);
			this.router.navigate([ '/login' ]);
		}
	}

	ngOnDestory() {
		if (this.sheetDataSub) this.sheetDataSub.unsubscribe();
		if (this.bookIdSub) this.bookIdSub.unsubscribe();
		if (this.bookDataSub) this.bookDataSub.unsubscribe();
		if (this.defaultProductsSub) this.defaultProductsSub.unsubscribe();
		if (this.productsCollectionSub) this.productsCollectionSub.unsubscribe();
		if (this.dialogSub) this.dialogSub.unsubscribe();
	}

	subToSheetCollection(bookId: string) {
		return this.sheetService.getSheetCollection(bookId).subscribe((data) => {
			if (data) {
				this.sheets = new Array<any>();
				data.forEach((sheet) => {
					if (sheet.name && sheet.id) this.sheets.push(sheet);
				});
				this.sortedSheets = this.sheets.slice();
			}
		});
	}

	subToBookDocument(bookId: string) {
		return this.bookService.getBookDocument(bookId).subscribe((data: any) => {
			if (data) {
				this.bookName = data.name;
				this.headingFields = data.headingFields;
				this.sheetDataSub = this.subToSheetCollection(bookId);
			}
		});
	}

	openExportDialog() {
		this.dialog.open(ExportBookDialog, {
			width: '380px',
			data: <any>{
				name: '',
				sheets: this.sheets,
				bookId: this.bookId
			}
		});
	}

	createSheet() {
		this.dialog.open(CreateSheetDialog, {
			width: '380px',
			data: <any>{
				name: new String(),
				bookId: this.bookId,
				headingFields: this.headingFields ? this.headingFields : new Array<any>()
			}
		});
	}

	viewSheet(sheetId: string) {
		if (sheetId && sheetId.length) this.router.navigate([ '/sheets', this.bookId, sheetId ]);
		else console.log('missing sheet ID');
	}

	editSheet(sheetId: string) {
		if (sheetId && sheetId.length) this.router.navigate([ '/sheets/edit', this.bookId, sheetId ]);
		else console.log('missing sheet ID');
	}

	deleteSheet(sheetId: string) {
		if (sheetId && sheetId.length)
			this.dialog.open(DeleteSheetDialog, {
				width: '380px',
				data: {
					bookId: this.bookId,
					sheetId
				}
			});
		else console.log('missing sheet ID');
	}

	sort() {
		if (this.sortOrder == 'none') {
			this.sortedSheets = this.sheets;
		} else {
			const data = this.sheets.slice();
			let isAsc = this.sortOrder == 'ascending' ? true : false;
			this.sortedSheets = data.sort((a, b) => {
				return this.compare(a.name, b.name, isAsc);
			});
		}
	}
}
