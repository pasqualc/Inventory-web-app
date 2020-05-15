import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
	selector: 'app-backend-test',
	templateUrl: './backend-test.component.html',
	styleUrls: [ './backend-test.component.scss' ]
})
export class BackendTestComponent implements OnInit {
	public testResults: Array<any> = new Array();

	constructor(public http: HttpClient) {}

	ngOnInit() {
		this.runTests();
	}

	runTests() {
		this.test(
			'should have /user/login POST endpoint that responds with truthy result when valid credentials are passed in',
			() => {
				return new Promise((resolve, reject) => {
					this.http
						.post('/user/login', {
							username: 'test', // make sure this user exists in the db
							password: 'asdf1234'
						})
						.subscribe((data: any) => {
							if (data.result) {
								resolve(true);
							} else {
								resolve(false);
							}
						});
				});
			}
		);

		this.test(
			'should have /user/login POST endpoint that responds with flasy result when no credentials are passed in',
			() => {
				return new Promise((resolve, reject) => {
					this.http
						.post('/user/login', {
							username: '',
							password: ''
						})
						.subscribe((data: any) => {
							if (!data.result) {
								resolve(true);
							} else {
								resolve(false);
							}
						});
				});
			}
		);

		this.test(
			'should have /user/login POST endpoint that responds with falsy result when invalid credentials are passed in',
			() => {
				return new Promise((resolve, reject) => {
					this.http
						.post('/user/login', {
							username: '0000_DoesNotExist$0000', // should not exist in database
							password: '!@#$%asdf'
						})
						.subscribe((data: any) => {
							if (!data.result) {
								resolve(true);
							} else {
								resolve(false);
							}
						});
				});
			}
		);

		this.test(
			'should have /user/validate POST endpoint that responds with truthy token when a valid user token is passed as Bearer token',
			() => {
				return new Promise((resolve, reject) => {
					this.http
						.post('/user/login', {
							username: 'test', // make sure this user exists in the db
							password: 'asdf1234'
						})
						.subscribe((data: any) => {
							if (data.result && data.user) {
								let headers = new HttpHeaders()
									.set('Content-Type', 'application/json')
									.set('authorization', `Bearer ${data.user.token}`)
									.set('Access-Control-Allow-Origin', 'http://localhost:9876');
								this.http.post('/user/validate', {}, { headers }).subscribe((data: any) => {
									if (data.token) resolve(true);
									else resolve(false);
								});
							} else {
								resolve(false);
							}
						});
				});
			}
		);

		this.test(
			'should have /user/validate POST endpoint that responds with falsy token when a valid user token is passed as Bearer token',
			() => {
				return new Promise((resolve, reject) => {
					let headers = new HttpHeaders()
						.set('Content-Type', 'application/json')
						.set('authorization', `Bearer invalidtoken`)
						.set('Access-Control-Allow-Origin', 'http://localhost:9876');
					this.http.post('/user/validate', {}, { headers }).subscribe((data: any) => {
						if (!data.token) resolve(true);
						else resolve(false);
					});
				});
			}
		);

		this.test(
			'should have /user/manage POST endpoint that responds with truthy data when a valid user data is passed as request body',
			() => {
				return new Promise((resolve, reject) => {
					this.http
						.post('/user/manage', {
							id: 'userID',
							oldPassword: 'oldPassword',
							name: 'realname',
							permissions: 'user',
							username: 'newuser',
							password: '',
							isTest: true
						})
						.subscribe((data: any) => {
							console.log('/user/manage test result', data);
							if (data.result) {
								resolve(true);
							} else {
								resolve(false);
							}
						});
				});
			}
		);

		this.test(
			'should have /user/manage POST endpoint that responds with falsy data when a invalid user data is passed as request body',
			() => {
				return new Promise((resolve, reject) => {
					this.http
						.post('/user/manage', {
							name: 'realname',
							permissions: 'user',
							username: 'newuser',
							password: '',
							isTest: true
						})
						.subscribe((data: any) => {
							if (!data.result) {
								resolve(true);
							} else {
								resolve(false);
							}
						});
				});
			}
		);
	}

	async test(description: string, fn: Function) {
		let test = <any>{};
		test.description = description;
		if (await fn()) test.result = true;
		else test.result = false;
		console.log(description, test.result);
		this.testResults.push(test);
	}
}
