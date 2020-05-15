import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: [ './login.component.scss' ]
})
export class LoginComponent implements OnInit {
	public username: string = <string>'';
	public password: string = <string>'';
	public invalidLogin: boolean = false;
	public loggedIn: boolean = false;
	public showLoginSpinner: boolean = false;
	public loginHeader: string = 'Login';
	public permissions: string = <string>'';

	constructor(private router: Router, public userService: UserService) {}

	async ngOnInit() {
		try {
			let userToken = this.userService.getUserToken();
			if (!userToken) throw new Error('no user token in session storage');
			this.showLoginSpinner = true;
			let result = await this.userService.validateUser(userToken);
			if (!result) throw new Error('invalid user');
			this.handleValidationResult(result);
		} catch (error) {
			console.log(error);
			this.showLoginSpinner = false;
			this.loggedIn = false;
		}
	}

	handleValidationResult(result: any) {
		this.showLoginSpinner = false;
		if (result.token) {
			this.userService.updateUserToken(result.token);
			this.permissions = result.permissions;
			this.loggedIn = true;
			this.loginHeader = `Welcome ${result.name}!`;
		} else {
			this.loggedIn = false;
		}
	}

	async login() {
		try {
			this.invalidLogin = false;
			this.userService.removeUserToken();
			if (!this.validateLoginData(this.username, this.password)) throw new Error('invalid login data');
			this.showLoginSpinner = true;
			let result: any = await this.userService.login(this.username, this.password);
			if (!result || !result.user) throw new Error('failed login');
			let user = result.user;
			this.userService.updateUserToken(user.token);
			this.permissions = user.permissions;
			this.loginHeader = `Welcome ${user.name}!`;
			this.loggedIn = true;
			this.showLoginSpinner = false;
		} catch (error) {
			console.log(error);
			this.loggedIn = false;
			this.showLoginSpinner = false;
			this.invalidLogin = true;
		}
	}

	logout() {
		this.userService.removeUserToken();
		this.loggedIn = false;
		this.loginHeader = 'Login';
	}

	validateLoginData(username: string, password: string) {
		let validData = true;
		if (!username) validData = false;
		if (!password) validData = false;
		return validData;
	}
}
