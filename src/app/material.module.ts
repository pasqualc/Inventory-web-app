import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
	imports: [
		MatButtonModule,
		MatInputModule,
		MatFormFieldModule,
		MatCardModule,
		MatDialogModule,
		MatExpansionModule,
		MatDividerModule,
		MatListModule,
		MatSortModule,
		MatSelectModule,
		MatProgressBarModule,
		MatRadioModule,
		MatProgressSpinnerModule,
		MatTableModule,
		MatCheckboxModule
	],
	exports: [
		MatButtonModule,
		MatInputModule,
		MatFormFieldModule,
		MatCardModule,
		MatDialogModule,
		MatExpansionModule,
		MatDividerModule,
		MatListModule,
		MatSortModule,
		MatSelectModule,
		MatProgressBarModule,
		MatRadioModule,
		MatProgressSpinnerModule,
		MatTableModule,
		MatCheckboxModule
	]
})
export class MaterialModule {}
