const admin = require('firebase-admin');
const serviceAccount = require('./fbServiceAcountKey');
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://p3prototype-1200b.firebaseio.com'
});

module.exports = admin.firestore();
