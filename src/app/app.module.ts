import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FirebaseModule } from './firebase.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { NgModule } from '@angular/core';
import { environment } from '../environments/environment';
import { LoginComponent } from './login/login.component';
import { SheetEditComponent } from './sheet-edit/sheet-edit.component';
import { BooksListComponent } from './books-list/books-list.component';
import { BooksViewComponent } from './books-view/books-view.component';
import { SheetsViewComponent } from './sheets-view/sheets-view.component';
import { BookEditComponent } from './book-edit/book-edit.component';
import { ExcelService } from './services/excel.service';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import {
	NoHeaderDialog,
	AddHeadingFieldDialog,
	AddProductDialog,
	DeleteBookDialog,
	CreateSheetDialog,
	ImportBookDialog,
	ExportBookDialog,
	EditFieldDialog,
	EditProductDialog,
	EditUserDialog,
	DeleteSheetDialog,
	DeleteUserDialog
} from './dialogs/dialogs.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { FirebaseService } from './services/firebase.service';
import { ProductService } from './services/product.service';
import { SheetService } from './services/sheet.service';
import { UserService } from './services/user.service';
import { SheetParseService } from './services/sheet.parse.service';
import { BookService } from './services/book.service';
import { FieldService } from './services/field.service';
import { BackendTestComponent } from './backend-test/backend-test.component';

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		SheetEditComponent,
		BooksListComponent,
		CreateSheetDialog,
		BooksViewComponent,
		SheetsViewComponent,
		CreateSheetDialog,
		BookEditComponent,
		AddProductDialog,
		ImportBookDialog,
		DeleteBookDialog,
		AddHeadingFieldDialog,
		NoHeaderDialog,
		ManageUsersComponent,
		ExportBookDialog,
		EditFieldDialog,
		EditProductDialog,
		EditUserDialog,
		DeleteSheetDialog,
		DeleteUserDialog,
		BackendTestComponent
	],
	imports: [
		AngularFireModule.initializeApp(environment.firebase),
		AngularFirestoreModule.enablePersistence(),
		FirebaseModule,
		BrowserModule,
		AppRoutingModule,
		MaterialModule,
		FlexLayoutModule,
		FormsModule,
		BrowserAnimationsModule,
		HttpClientModule,
		ServiceWorkerModule.register('/ngsw-worker.js', {
			enabled: environment.production,
			registrationStrategy: 'registerImmediately'
		}),
		ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
	],
	providers: [
		ExcelService,
		FirebaseService,
		ProductService,
		SheetService,
		UserService,
		SheetParseService,
		BookService,
		FieldService
	],
	entryComponents: [
		CreateSheetDialog,
		CreateSheetDialog,
		AddProductDialog,
		ImportBookDialog,
		DeleteBookDialog,
		AddHeadingFieldDialog,
		NoHeaderDialog,
		ExportBookDialog,
		EditFieldDialog,
		EditProductDialog,
		EditUserDialog,
		DeleteSheetDialog,
		DeleteUserDialog
	],
	bootstrap: [ AppComponent ]
})
export class AppModule {}
