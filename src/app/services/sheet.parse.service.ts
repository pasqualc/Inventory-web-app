import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class SheetParseService {
	constructor() {}

	setHeadingTypes(incomingFields: Array<any>) {
		let headingFields = new Array<any>();
		incomingFields.forEach((fieldData) => {
			try {
				if (fieldData.text === undefined)
					throw new Error(`field missing text data; field "${fieldData.name}" is being dropped`);
				let field = <any>{ ...fieldData };
				if (field.text) {
					field.type = 'text';
				} else {
					field.type = 'number';
				}
				headingFields.push(field);
			} catch (error) {
				console.log(error);
			}
		});
		return headingFields;
	}

	getParsedProductField(product: any, field: any) {
		try {
			if (!field.name || product[field.name] == undefined) throw new Error('invalid field name');
			let productString = `{ "name": "${field.name}",
			"value" : ${field.text
				? `"${product[field.name] ? product[field.name] : '[No value]'}"`
				: `${product[field.name] ? product[field.name] : '0'}`},
			"text": ${field.text ? 'true' : 'false'}}`;
			let parsedProductField = JSON.parse(productString);
			return parsedProductField;
		} catch (error) {
			console.log(error);
			return undefined;
		}
	}

	formatProducts(products: Array<any>, headingFields: Array<any>) {
		try {
			if (!products || !headingFields) throw new Error('invalid args');
			let formattedProducts = new Array<any>();
			products.forEach((product) => {
				try {
					if (!product.id || !headingFields.length) throw new Error('invalid product data');
					let formattedProduct = <any>{};
					let parsedProductData = <any>[];
					let primaryField: string;
					for (let i = 0; i < headingFields.length; i++) {
						let field = headingFields[i];
						if (field.primary) primaryField = field.name;
						if (!field.text && !parseFloat(product[field.name])) {
							product[field.name] = 0;
						}
						let parsedProductField = <any>this.getParsedProductField(product, field);
						if (parsedProductField) parsedProductData.push(parsedProductField);
					}
					formattedProduct.data = parsedProductData;
					formattedProduct.id = product.id;
					formattedProduct.productName = product[primaryField];
					formattedProducts.push(formattedProduct);
				} catch (error) {
					console.log(error);
				}
			});
			return formattedProducts;
		} catch (error) {
			console.log(error);
			return false;
		}
	}

	parseProducts(formattedProducts: Array<any>) {
		let parsedProducts = new Array<any>();
		if (formattedProducts)
			formattedProducts.forEach((formattedProduct) => {
				try {
					if (!formattedProduct.data) throw new Error('invalid data');
					let stringProduct = '{';
					if (formattedProduct.data.length > 0) {
						formattedProduct.data.forEach((field) => {
							stringProduct += `"${field.name}": ${field.text ? '"' : ''}${field.value}${field.text
								? '"'
								: ''},`;
						});
						stringProduct = stringProduct.substring(0, stringProduct.length - 1) + '}';
					} else {
						stringProduct += '}';
					}
					const parsedProduct = JSON.parse(stringProduct);
					parsedProduct.id = formattedProduct.id;
					parsedProducts.push(parsedProduct);
				} catch (error) {
					console.log(error);
				}
			});
		return parsedProducts;
	}

	getProductIds(products: Array<any>) {
		let defaultIDs = new Array<string>();
		if (products)
			products.forEach((product) => {
				if (product.id) defaultIDs.push(product.id);
			});
		return defaultIDs;
	}
}
