import { Injectable, isDevMode } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FirebaseService } from './firebase.service';

@Injectable({
	providedIn: 'root'
})
export class UserService {
	constructor(public http: HttpClient, public firebaseService: FirebaseService) {}

	getUsers() {
		return this.firebaseService.getUsers();
	}

	saveUser(user: any) {
		return new Promise(async (resolve, reject) => {
			if (!user.username || !user.name || (!user.password && !user.oldPassword) || !user.permissions)
				resolve('failure');
			try {
				if (isDevMode()) {
					let result;
					if (user.id) result = await this.firebaseService.updateUser(user);
					else result = await this.firebaseService.addUser(user);
					if (result && user.id) resolve('success');
					else if (result && !user.id) resolve('close');
					else resolve('close');
				} else {
					let userToken = this.getUserToken();
					let headers = new HttpHeaders()
						.set('Content-Type', 'application/json')
						.set('authorization', `Bearer ${userToken}`)
						.set('Access-Control-Allow-Origin', 'http://localhost:9876');
					this.http.post('/user/manage', { ...user }, { headers }).subscribe((data: any) => {
						console.log(data);
						if (data.result) {
							this.updateUserToken(data.token);
							if (!user.id) resolve('close');
							else resolve('success');
						} else resolve('failure');
					});
				}
			} catch (error) {
				console.log(error);
				resolve('failure');
			}
		});
	}

	deleteUser(idToDelete: string) {
		return new Promise((resolve, reject) => {
			try {
				if (!idToDelete) throw new Error('invalid args');
				this.firebaseService
					.deleteUser(idToDelete)
					.then(() => {
						resolve(true);
					})
					.catch((error) => {
						console.log(error);
						resolve(false);
					});
			} catch (error) {
				reject(error);
			}
		});
	}

	validateUser(userToken: string) {
		return new Promise(async (resolve, reject) => {
			try {
				if (!userToken) throw new Error('invalid args');
				if (!navigator.onLine)
					resolve({
						name: 'user',
						permissions: 'admin',
						result: true,
						message: 'app is functioning offline',
						token: userToken
					});
				else if (isDevMode()) {
					resolve({
						message: 'valid token',
						name: userToken == 'user' ? 'user' : 'admin',
						token: userToken == 'user' ? 'user' : 'admin',
						permissions: userToken == 'user' ? 'user' : 'admin'
					});
				} else {
					let headers = new HttpHeaders()
						.set('Content-Type', 'application/json')
						.set('authorization', `Bearer ${userToken}`)
						.set('Access-Control-Allow-Origin', 'http://localhost:9876');
					this.http.post('/user/validate', {}, { headers }).subscribe((data: any) => {
						resolve(data);
					});
				}
			} catch (error) {
				console.log(error);
				resolve(false);
			}
		});
	}

	login(username: string, password: string) {
		return new Promise((resolve, reject) => {
			try {
				if (!username || !password) throw new Error('invalid login');
				if (isDevMode()) {
					resolve({
						user: {
							name: username == 'user' ? 'user' : 'admin',
							token: username == 'user' ? 'user' : 'admin',
							permissions: username == 'user' ? 'user' : 'admin'
						}
					});
				} else {
					try {
						this.http
							.post('/user/login', {
								username: username,
								password: password
							})
							.subscribe((data: any) => {
								if (data.result) {
									resolve(data);
								} else {
									resolve(false);
								}
							});
					} catch (error) {
						console.log(error);
						resolve(false);
					}
				}
			} catch (error) {
				console.log(error);
				resolve(false);
			}
		});
	}

	getUserToken() {
		return sessionStorage.getItem('user@p3project');
	}

	updateUserToken(token: string) {
		sessionStorage.removeItem('user@p3project');
		sessionStorage.setItem('user@p3project', token);
	}

	removeUserToken() {
		sessionStorage.removeItem('user@p3project');
	}
}
