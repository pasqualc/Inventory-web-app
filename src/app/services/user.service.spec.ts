import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { FirebaseService } from './firebase.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

let mockResponse;

class MockFirebaseService {
	deleteUser(id: string) {
		return new Promise((resolve, reject) => {
			if (id != 'badID') {
				resolve(true);
			} else {
				reject(false);
			}
		});
	}

	addUser(user: any) {
		return new Promise((resolve, reject) => {
			if (user) resolve(true);
			else resolve(false);
		});
	}

	updateUser(user: any) {
		return new Promise((resolve, reject) => {
			if (user) resolve(true);
			else resolve(false);
		});
	}
}

class MockHttpClient {
	post(url: string, body: any, headers?: any) {
		if (url && body && body.name && body.username && body.password && body.permissions) return of([ mockResponse ]);
		else return of([ false ]);
	}
}

describe('UserService', () => {
	let service: UserService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				{ provide: FirebaseService, useClass: MockFirebaseService },
				{ provide: HttpClient, useClass: MockHttpClient }
			]
		});
		service = TestBed.get(UserService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should have a "save user" function that resolves with string "close" when valid user data with ID is used', async () => {
		let validUser1 = {
			id: 'id',
			name: 'real name',
			username: 'user',
			password: 'password',
			oldPassword: 'old password',
			permissions: 'admin'
		};

		let validUser2 = {
			id: 'id',
			name: 'real name',
			username: 'user',
			password: '',
			oldPassword: 'old password',
			permissions: 'admin'
		};

		expect(await service.saveUser(validUser1)).toEqual('success');
		expect(await service.saveUser(validUser2)).toEqual('success');
	});

	it('should have a "save user" function that resolves with string "close" when valid user data with no ID is used', async () => {
		let validUser = {
			name: 'real name',
			username: 'user',
			password: 'password',
			permissions: 'admin'
		};
		let result = await service.saveUser(validUser);
		expect(result).toEqual('close');
	});

	it('should have a "save user" function that resolves with string "failure" when invalid data is used', async () => {
		let invalidUser1 = {
			username: 'user',
			password: 'password',
			permissions: 'admin',
			id: 'id'
		};
		let invalidUser2 = {
			name: 'real name',
			permissions: 'admin',
			id: 'id'
		};
		let invalidUser3 = {
			name: 'real name',
			password: 'password',
			username: 'user',
			id: 'id'
		};
		let invalidUser4 = {
			name: 'real name',
			password: 'password',
			username: 'user',
			id: 'id'
		};

		expect(await service.saveUser(invalidUser1)).toEqual('failure');
		expect(await service.saveUser(invalidUser2)).toEqual('failure');
		expect(await service.saveUser(invalidUser3)).toEqual('failure');
		expect(await service.saveUser(invalidUser4)).toEqual('failure');
	});

	it('should have a "delete user" function', () => {
		expect(service.deleteUser).toBeTruthy();
		expect(typeof service.deleteUser).toEqual('function');
	});

	it('should have a "delete user" function that resolves with valid data', async () => {
		let result = await service.deleteUser('validID');
		expect(result).toBeTruthy();
	});

	it('should have a "delete user" function that rejects with invalid data', async () => {
		let result = await service.deleteUser('badID');
		expect(result).toBeFalsy();
	});

	it('should have a "validate user" function', () => {
		expect(service.validateUser).toBeTruthy();
		expect(typeof service.validateUser).toEqual('function');
	});

	it('should have a "validate user" function which returns a promise that resolves with truthy data when valid args are passed in', async () => {
		let result = await service.validateUser('userToken');
		expect(result).toBeTruthy();
	});

	it('should have a "validate user" function which returns a promise that resolves with falsy data when invalid args are passed in', async () => {
		let result = await service.validateUser(undefined);
		expect(result).toBeFalsy();
		result = await service.validateUser('');
		expect(result).toBeFalsy();
	});

	it('should have a "login" function', () => {
		expect(service.login).toBeTruthy();
		expect(typeof service.login).toBeTruthy();
	});

	it('should have a "login" function which returns a promise that resolves with truthy data when valid args are passed in', async () => {
		let result = await service.login('username', 'password');
		expect(result).toBeTruthy();
	});

	it('should have a "login" function which returns a promise that resolves with an object containing user data when valid args are passed in', async () => {
		let result: any = await service.login('username', 'password');
		expect(result).toBeTruthy();
		expect(result.user).toBeTruthy();
		expect(result.user.name).toBeTruthy();
		expect(result.user.token).toBeTruthy();
		expect(result.user.permissions).toBeTruthy();
	});

	it('should have a "login" function which returns a promise that resolves with falsy data when invalid args are passed in', async () => {
		let result = await service.login(undefined, 'password');
		expect(result).toBeFalsy();
		result = await service.login('', 'password');
		expect(result).toBeFalsy();
		result = await service.login('username', undefined);
		expect(result).toBeFalsy();
		result = await service.login('username', '');
		expect(result).toBeFalsy();
	});

	it('should have a "get user token" function', () => {
		expect(service.getUserToken).toBeTruthy();
		expect(typeof service.getUserToken).toEqual('function');
	});

	it('should have a "get user token" function that gets data from session storage API with item key "user@p3project"', () => {
		sessionStorage.setItem('user@p3project', 'user_token');
		let token = service.getUserToken();
		expect(token).toEqual(sessionStorage.getItem('user@p3project'));
	});

	it('should have a "update user token" function', () => {
		expect(service.updateUserToken).toBeTruthy();
		expect(typeof service.updateUserToken).toEqual('function');
	});

	it('should have an "update user token" function that uses session storage API to store input string in item w/key "user@p3project"', () => {
		let originalToken = 'original_token';
		let newToken = 'new_token';
		sessionStorage.setItem('user@p3project', originalToken);
		service.updateUserToken(newToken);
		expect(newToken).toEqual(sessionStorage.getItem('user@p3project'));
	});

	it('should have a "remove user token" function that uses session storage API to remove item w/key "user@p3project"', () => {
		let token = 'token';
		sessionStorage.setItem('user@p3project', token);
		expect(sessionStorage.getItem('user@p3project')).toEqual(token);
		service.removeUserToken();
		expect(sessionStorage.getItem('user@p3project')).toBeFalsy();
	});
});
