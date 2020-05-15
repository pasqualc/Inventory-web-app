import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { ProductService } from './product.service';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

export interface SheetJSON {
	name: string;
	data: Array<string>[];
}

export interface BookJSON {
	name: string;
	sheets: SheetJSON[];
}

@Injectable({
	providedIn: 'root'
})
export class ExcelService {
	constructor(public productService: ProductService) {}

	public exportAsExcelFile(sheetNames: Array<string>, sheetsData: Array<any>, excelFileName: string): void {
		const workBook: XLSX.WorkBook = XLSX.utils.book_new();
		let i = 0;
		sheetsData.forEach((sheet) => {
			const workSheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(sheet);
			XLSX.utils.book_append_sheet(workBook, workSheet, sheetNames[i]);
			i++;
		});
		const excelBuffer: any = XLSX.write(workBook, { bookType: 'xlsx', type: 'array' });
		this.saveAsExcelFile(excelBuffer, excelFileName);
	}

	public saveAsExcelFile(buffer: any, fileName: string): void {
		const data: Blob = new Blob([ buffer ], { type: EXCEL_TYPE });
		FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
	}

	public importExcelFile(event: any): any {
		/* wire up file reader */
		return new Promise((resolve, reject) => {
			try {
				const target: DataTransfer = <DataTransfer>event.target;
				if (target.files.length !== 1) throw new Error('Cannot use multiple files');
				if (!target.files) throw new Error('No files being uploaded!');
				const reader: FileReader = new FileReader();
				reader.onerror = () => {
					reader.abort();
					throw new Error('Problem parsing file!');
				};
				let fileNameTokens = target.files[0].name.split('.');
				let bookName = '';
				for (let i = 0; i < fileNameTokens.length - 1; i++) {
					bookName += fileNameTokens[i];
				}
				let bookJSON: BookJSON = <BookJSON>{
					name: bookName,
					fileName: target.files[0].name,
					sheets: new Array<SheetJSON>()
				};
				reader.onload = (e: any) => {
					/* read workbook */
					const bstr: string = e.target.result;
					const workBook: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

					/* grab first sheet */
					workBook.SheetNames.forEach((sheetName) => {
						const sheet: XLSX.WorkSheet = workBook.Sheets[sheetName];
						let sheetJSON = <SheetJSON>{
							name: sheetName,
							data: XLSX.utils.sheet_to_json(sheet, { header: 1 })
						};
						bookJSON.sheets.push(sheetJSON);
					});

					/* save data */
					resolve({ result: true, bookJSON });
				};
				reader.readAsBinaryString(target.files[0]);
			} catch (error) {
				reject({ result: false, error });
			}
		});
	}

	public getHeadingFieldNames(headingFields: Array<any>) {
		let fieldNames = new Array();
		for (let i = 0; i < headingFields.length; i++) {
			let field = headingFields[i];
			if (field.name) fieldNames.push(field.name);
			else {
				fieldNames = undefined;
				break;
			}
		}
		return fieldNames;
	}

	public exportBook(fileName: string, sheets: Array<any>, bookId: string) {
		return new Promise((resolve, reject) => {
			let bookData = new Array();
			let sheetNames = new Array();
			sheets.forEach((sheet) => {
				this.productService.getProductsCollection(bookId, sheet.id).subscribe((data) => {
					let sheetAsArray = new Array();
					try {
						if (!data) throw new Error('products collection empty -- book not exporting');

						let headingRow = this.getHeadingFieldNames(sheet.headingFields);
						if (!headingRow) throw new Error('failed to make heading row -- book not exporting');

						sheetAsArray.push(headingRow);
						data.forEach((product) => {
							let row = new Array();

							sheet.headingFields.forEach((field) => {
								if (product[field.name]) row.push(product[field.name]);
							});
							sheetAsArray.push(row);
						});
					} catch (error) {
						console.log(error);
						sheetAsArray = new Array();
						sheetAsArray.push('ERROR');
					}
					sheet.name ? sheetNames.push(sheet.name) : sheetNames.push('Error sheet');

					bookData.push(sheetAsArray);
					if (bookData.length == sheets.length) {
						this.exportAsExcelFile(sheetNames, bookData, fileName);
						resolve(true);
					}
				});
			});
		});
	}

	public parseSheet(sheets: Array<any>) {
		let parsedSheets = [];
		sheets.forEach((sheet: any) => {
			if (sheet.data && sheet.data.length > 0) {
				let parsedSheet = <any>{};
				parsedSheet.name = sheet.name;
				parsedSheet.headingFields = <any>[];
				this.makeHeadingField(sheet, parsedSheet);
				parsedSheet.products = <any>[];
				this.makeProducts(sheet, parsedSheet);
				parsedSheets.push(parsedSheet);
			}
		});
		return parsedSheets;
	}

	public makeHeadingField(sheet: any, parsedSheet: any) {
		for (let i = 0; i < sheet.data[0].length; i++) {
			let field = <any>{};
			field.name = sheet.data[0][i];
			field.text = parseFloat(sheet.data[1][i]) ? false : true;
			field.type = field.text ? 'text' : 'number';
			parsedSheet.headingFields.push(field);
		}
	}

	public makeProducts(sheet: any, parsedSheet: any) {
		for (let i = 1; i < sheet.data.length; i++) {
			let record = sheet.data[i];
			let product = <any>{};
			for (let j = 0; j < record.length; j++) {
				product[parsedSheet.headingFields[j].name] = parsedSheet.headingFields[j].text
					? record[j]
					: parseFloat(record[j]);
				if (!product[parsedSheet.headingFields[j].name]) {
					product[parsedSheet.headingFields[j].name] = parsedSheet.headingFields[j].text ? '' : 0;
				}
			}
			if (record.length > 0) parsedSheet.products.push(product);
		}
	}
}
