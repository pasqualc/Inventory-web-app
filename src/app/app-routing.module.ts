import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SheetEditComponent } from './sheet-edit/sheet-edit.component';
import { BooksListComponent } from './books-list/books-list.component';
import { BooksViewComponent } from './books-view/books-view.component';
import { SheetsViewComponent } from './sheets-view/sheets-view.component';
import { BookEditComponent } from './book-edit/book-edit.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { BackendTestComponent } from './backend-test/backend-test.component';

export const routes: Routes = [
	{
		path: '',
		component: LoginComponent
	},
	{
		path: 'login',
		component: LoginComponent
	},
	{
		path: 'sheets/edit/:book/:id',
		component: SheetEditComponent
	},
	{
		path: 'books',
		component: BooksListComponent
	},
	{
		path: 'books/:id',
		component: BooksViewComponent
	},
	{
		path: 'sheets/:book/:id',
		component: SheetsViewComponent
	},
	{
		path: 'books/edit/:id',
		component: BookEditComponent
	},
	{
		path: 'users',
		component: ManageUsersComponent
	},
	{
		path: 'test',
		component: BackendTestComponent
	}
];

@NgModule({
	imports: [ RouterModule.forRoot(routes) ],
	exports: [ RouterModule ]
})
export class AppRoutingModule {}
