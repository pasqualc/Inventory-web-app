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

export const MockDefaultProducts = [
	{ id: 'id1', field1: 'valueA', field2: 'value1', field3: 1 },
	{ id: 'id2', field1: 'valueB', field2: 'value2', field3: 2 },
	{ id: 'id3', field1: 'valueC', field2: 'value3', field3: 3 }
];

export const MockBookListData = [
	{
		id: 'id1',
		name: 'book1',
		headingFields: copyMockHeadingFields()
	},
	{
		id: 'id2',
		name: 'book2',
		headingFields: copyMockHeadingFields()
	},
	{
		id: 'id3',
		name: 'book3',
		headingFields: copyMockHeadingFields()
	}
];

export const MockBookDocument = {
	id: 'id1',
	name: 'book1',
	headingFields: copyMockHeadingFields()
};
