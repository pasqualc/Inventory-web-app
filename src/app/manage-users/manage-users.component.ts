import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditUserDialog, DeleteUserDialog } from '../dialogs/dialogs.component';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
	selector: 'app-manage-users',
	templateUrl: './manage-users.component.html',
	styleUrls: [ './manage-users.component.scss' ]
})
export class ManageUsersComponent implements OnInit {
	public permissions: string;
	public users: Array<any>;
	public contentLoading: boolean;

	constructor(public dialog: MatDialog, public userService: UserService, public router: Router) {}

	async ngOnInit() {
		try {
			this.contentLoading = true;
			let userToken = this.userService.getUserToken();
			if (!userToken) throw new Error('invalid user token');
			let result: any = await this.userService.validateUser(userToken);
			if (!result.token || result.permissions != 'admin') throw new Error('invalid user token');
			this.userService.updateUserToken(result.token);
			this.permissions = result.permissions;
			this.userService.getUsers().subscribe((data) => {
				this.users = data;
			});
			this.contentLoading = false;
		} catch (error) {
			console.log(error);
			this.router.navigate([ '/login' ]);
		}
	}

	editUser(user: any) {
		if (user && user.password && user.id) {
			let oldPassword = user.password;
			this.dialog.open(EditUserDialog, {
				width: '380px',
				data: <any>{
					user: {
						id: user.id,
						username: user.username ? user.username : '',
						name: user.name ? user.name : '',
						password: '',
						oldPassword: oldPassword,
						permissions: user.permissions ? user.permissions : 'user'
					}
				}
			});
		}
	}

	deleteUser(userToDelete: any) {
		if (userToDelete && userToDelete.id && userToDelete.id.length)
			this.dialog.open(DeleteUserDialog, {
				width: '380px',
				data: <any>{
					id: userToDelete.id
				}
			});
	}

	createUser() {
		this.dialog.open(EditUserDialog, {
			width: '380px',
			data: <any>{
				user: {
					username: '',
					name: '',
					password: '',
					permissions: 'user'
				}
			}
		});
	}
}
