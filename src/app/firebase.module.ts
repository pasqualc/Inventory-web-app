import { NgModule } from '@angular/core';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';

@NgModule({
	imports: [ AngularFirestoreModule, AngularFireStorageModule, AngularFireAuthModule ],
	exports: [ AngularFirestoreModule, AngularFireStorageModule, AngularFireAuthModule ]
})
export class FirebaseModule {}
