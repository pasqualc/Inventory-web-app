import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { DeleteBookDialog, ImportBookDialog } from '../dialogs/dialogs.component';
import { UserService } from '../services/user.service';
import { BookService } from '../services/book.service';

@Component({
	selector: 'app-books-list',
	templateUrl: './books-list.component.html',
	styleUrls: [ './books-list.component.scss' ]
})
export class BooksListComponent implements OnInit, OnDestroy {
	public books: Array<any> = new Array();
	public contentLoading: boolean = true;
	public sortedBooks: Array<any> = new Array();
	public sortOrder: string = 'ascending';
	public permissions: string = <string>new String();

	private compare = function(a: string, b: string, isAsc: boolean) {
		return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
	};
	private dialogSub: Subscription;
	private booksListSub: Subscription;
	private defaultProductsSub: Subscription;
	private productsCollectionSub: Subscription;
	private sheetCollectionSub: Subscription;

	constructor(
		public router: Router,
		public dialog: MatDialog,
		public bookService: BookService,
		public userService: UserService
	) {}

	async ngOnInit() {
		try {
			this.contentLoading = true;
			let userToken = this.userService.getUserToken();
			if (!userToken) throw new Error('No user token!');
			let data: any = await this.userService.validateUser(userToken);
			if (!data.token) throw new Error('Invalid user token!');
			this.permissions = data.permissions;
			this.userService.updateUserToken(data.token);
			this.booksListSub = this.subToBookCollection();
			this.contentLoading = false;
		} catch (error) {
			console.log('error', error);
			this.userService.removeUserToken();
			this.router.navigate([ '/login' ]);
		}
	}

	ngOnDestroy() {
		if (this.booksListSub) this.booksListSub.unsubscribe();
		if (this.dialogSub) this.dialogSub.unsubscribe();
		if (this.defaultProductsSub) this.defaultProductsSub.unsubscribe();
		if (this.productsCollectionSub) this.productsCollectionSub.unsubscribe();
		if (this.sheetCollectionSub) this.sheetCollectionSub.unsubscribe();
	}

	subToBookCollection() {
		return this.bookService.getBooksCollection().subscribe((result) => {
			if (result) {
				this.books = new Array();
				result.forEach((book: any) => {
					if (book.id && book.name) this.books.push(book);
				});
				this.sortedBooks = this.books.sort((a, b) => {
					return this.compare(a.name, b.name, true);
				});
			}
		});
	}

	createBook(): void {
		this.router.navigate([ '/books/edit', 'new' ]);
	}

	openBook(bookId: string): void {
		this.router.navigate([ '/books', bookId ]);
	}

	editBook(bookId: string): void {
		this.router.navigate([ '/books/edit', bookId ]);
	}

	deleteBook(bookId: string) {
		if (bookId && bookId.length)
			this.dialog.open(DeleteBookDialog, {
				width: '380px',
				data: {
					id: bookId,
					confirm: false
				}
			});
	}

	importBook() {
		this.dialog.open(ImportBookDialog, {
			width: '380px',
			data: {
				importedBook: {
					name: 'New Book'
				}
			}
		});
	}

	sort() {
		if (this.sortOrder == 'none') {
			this.sortedBooks = this.books;
		} else {
			const data = this.books.slice();
			const isAsc = this.sortOrder == 'ascending' ? true : false;
			this.sortedBooks = data.sort((a, b) => {
				return this.compare(a.name, b.name, isAsc);
			});
		}
	}

	isValidFileType(fileName: string) {
		const bookNameTokens = fileName.split('.');
		if (bookNameTokens[bookNameTokens.length - 1] == 'xlsx' || bookNameTokens[bookNameTokens.length - 1] == 'xls')
			return true;
		else return false;
	}
}
