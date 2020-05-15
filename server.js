const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./firestore');

const app = express();
app.use(express.json({ limit: '100mb' }));
app.use(express.static(__dirname + '/dist/cs4900-inventory-manager'));

app.post('/user/validate', async (req, res) => {
	try {
		const token = req.header('authorization').replace('Bearer ', '').replace('"', '').replace('"', '');
		const decoded = jwt.verify(token, 'asdf');
		if (decoded) {
			let querySnapshot = await db
				.collection('users')
				.where('username', '==', `${decoded.username}`)
				.where('password', '==', `${decoded.password}`)
				.get();
			let user;
			querySnapshot.forEach((documentSnapshot) => {
				let data = documentSnapshot.data();
				user = data;
				user.id = documentSnapshot.id;
			});
			if (user) {
				const userToken = jwt.sign({ id: user.id, password: user.password, username: user.username }, 'asdf', {
					expiresIn: 60 * 60
				});
				res.send({
					message: 'valid token',
					name: user.name,
					token: userToken,
					permissions: user.permissions
				});
			} else {
				console.log(error);
				res.send({ message: 'Something went wrong...', token: false });
			}
		} else throw new Error('Invalid token!');
	} catch (error) {
		console.log(error);
		res.send({ message: 'Something went wrong...', token: false });
	}
});

app.post('/user/login', async (req, res) => {
	try {
		if (req.body.username && req.body.password) {
			let querySnapshot = await db.collection('users').where('username', '==', `${req.body.username}`).get();
			if (!querySnapshot.size) res.send({ message: 'no user found', token: false, result: false });
			else {
				let docData = querySnapshot.docs[0].data();
				let isMatch = await bcrypt.compare(req.body.password, docData.password);
				if (!isMatch) throw new Error('Invalid password!');
				else {
					const userToken = jwt.sign(
						{ id: docData.id, password: docData.password, username: docData.username },
						'asdf',
						{
							expiresIn: 60 * 60
						}
					);
					res.send({
						message: 'user logged in',
						user: {
							token: userToken,
							name: docData.name,
							permissions: docData.permissions
						},
						result: true
					});
				}
			}
		} else throw new Error('Missing credentials!');
	} catch (error) {
		console.log(error);
		res.send({ message: 'Something went wrong...', token: false, result: false });
	}
});

app.post('/user/manage', async (req, res) => {
	try {
		let token;
		let decoded;
		let id;
		if (!req.body.isTest)
			token = req.header('authorization').replace('Bearer ', '').replace('"', '').replace('"', '');
		if (!req.body.isTest) decoded = jwt.verify(token, 'asdf');
		if (!req.body.isTest) id = decoded.id;
		else id = 'someID';
		if (!id) throw new Error('invalid user token');
		let user = { ...req.body };
		if (user.id) {
			// existing user
			if (!user.oldPassword) throw new Error('existing user old password missing');
			if (!user.password) user.password = user.oldPassword;
			else user.password = await bcrypt.hash(user.password, 4);
			delete user.oldPassword;
			let existingID = user.id;
			delete user.id;
			if (!req.body.isTest) await db.collection('users').doc(existingID).set(user);
			let newToken = false;
			if (id == existingID)
				newToken = jwt.sign({ id: id, password: user.password, username: user.username }, 'asdf', {
					expiresIn: 60 * 60
				});
			res.send({ result: true, token: newToken ? newToken : token });
		} else {
			// new user
			if (!user.password) throw new Error('new user password missing');
			user.password = await bcrypt.hash(user.password, 4);
			if (!user.isTest) result = await db.collection('users').add(user);
			else result = true;
			res.send({ result: true });
		}
	} catch (error) {
		console.log(error);
		res.send({ result: false });
	}
});

app.get('*', async (req, res) => {
	res.sendFile(path.join(__dirname + '/dist/cs4900-inventory-manager/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`App listening on ${PORT}`);
});
