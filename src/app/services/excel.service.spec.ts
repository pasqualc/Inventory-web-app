import { TestBed } from '@angular/core/testing';
import { ExcelService } from './excel.service';
import { ProductService } from './product.service';

import { Observable, of } from 'rxjs';

const mockHeadingFields = [
	{ name: 'field1', primary: true, text: true, type: 'text' },
	{ name: 'field2', primary: false, text: true, type: 'text' },
	{ name: 'field3', primary: false, text: false, type: 'number' }
];

class MockProductService {
	getProductsCollection() {
		return <Observable<any>>of([
			{ id: 'id1', field1: 'value', field2: 'value', field3: 1 },
			{ id: 'id2', field1: 'value', field2: 'value', field3: 1 },
			{ id: 'id3', field1: 'value', field2: 'value', field3: 1 }
		]);
	}
}

describe('ExcelService', () => {
	beforeEach(() =>
		TestBed.configureTestingModule({
			providers: [ { provide: ProductService, useClass: MockProductService } ]
		})
	);

	it('should be created', () => {
		const service: ExcelService = TestBed.get(ExcelService);
		expect(service).toBeTruthy();
	});

	it('should have a function for exporting data to an excel file', () => {
		const service: ExcelService = TestBed.get(ExcelService);
		expect(service.exportAsExcelFile).toBeTruthy();
	});

	it('should have a function for saving data as an excel file', () => {
		const service: ExcelService = TestBed.get(ExcelService);
		expect(service.saveAsExcelFile).toBeTruthy();
	});

	it('should have a "get field names" function', () => {
		const service: ExcelService = TestBed.get(ExcelService);
		expect(service.getHeadingFieldNames).toBeTruthy();
		expect(typeof service.getHeadingFieldNames).toEqual('function');
	});

	it('should have a "get field names" function that returns an array containing the name values of each heading field passed into the function', () => {
		const service: ExcelService = TestBed.get(ExcelService);
		let fieldNames = service.getHeadingFieldNames([ ...mockHeadingFields ]);
		expect(fieldNames).toEqual([ mockHeadingFields[0].name, mockHeadingFields[1].name, mockHeadingFields[2].name ]);
	});

	it('should have a "get field names" function that returns falsy data if one of heading fields passed in have a falsy name value', () => {
		const service: ExcelService = TestBed.get(ExcelService);
		let badFields = new Array();
		mockHeadingFields.forEach((field) => {
			badFields.push({ ...field });
		});
		badFields[0].name = undefined;
		expect(service.getHeadingFieldNames(badFields)).toBeFalsy();
	});

	it('should have a function for importing data as an excel file', () => {
		const service: ExcelService = TestBed.get(ExcelService);
		expect(service.importExcelFile).toBeTruthy();
	});

	it('should verify that there are files being uploaded from event target', async () => {
		const service: ExcelService = TestBed.get(ExcelService);
		const badEvent = { notFiles: true };
		let result = await service.importExcelFile(badEvent).then((excelImport) => {}).catch((badImport) => {
			return badImport.result;
		});
		expect(result).toBeFalsy();
	});

	it('should only allow for exactly one file to be uploaded', async () => {
		const service: ExcelService = TestBed.get(ExcelService);
		const badEvent1 = {
			target: {
				length: 0
			}
		};
		let result1 = await service.importExcelFile(badEvent1).then(() => {}).catch((badImport) => {
			return badImport.result;
		});
		expect(result1).toBeFalsy();
		const badEvent2 = {
			target: {
				length: 2222
			}
		};
		let result2 = await service.importExcelFile(badEvent2).then(() => {}).catch((badImport) => {
			return badImport.result;
		});
		expect(result2).toBeFalsy();

		const badEvent3 = {
			target: {
				length: '1'
			}
		};
		let result3 = await service.importExcelFile(badEvent3).then(() => {}).catch((badImport) => {
			return badImport.result;
		});
		expect(result3).toBeFalsy();
	});
});
