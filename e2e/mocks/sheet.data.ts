export const MockHeadingFields = [
	{ id: 'id1', name: 'field1', primary: true, text: true, type: 'text' },
	{ id: 'id2', name: 'field2', primary: false, text: true, type: 'text' },
	{ id: 'id3', name: 'field3', primary: false, text: false, type: 'number' }
];

let copyMockHeadingFields = function() {
	let copy = new Array();
	for (let i = 0; i < MockHeadingFields.length; i++) {
		let field = { ...MockHeadingFields[i] };
		copy.push(field);
	}

	return copy;
};

export const MockSheetListData = [
	{
		id: 'id1',
		name: 'sheet1',
		headingFields: copyMockHeadingFields()
	},
	{
		id: 'id2',
		name: 'sheet2',
		headingFields: copyMockHeadingFields()
	},
	{
		id: 'id3',
		name: 'sheet3',
		headingFields: copyMockHeadingFields()
	}
];

export const MockSheetDocument = {
	id: 'id1',
	name: 'sheet1',
	headingFields: copyMockHeadingFields()
};
