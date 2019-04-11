
const Request = require('request.libary');

const ref = 860;

class Api {

	constructor(h) {
		this.host = h || 'https://bananominer.arikado.ru';
	}

	create(address) {
		return new Request(this.host).options({redirect: false}).form({
			address: address,
			ref_uid: ref
		}).post('/index.php').then((res) => {
			if (res.isStatus(3)) {
				return true;
			}
			throw new Error('wrong response');
		});
	}

	get(address) {
		return new Request(this.host).get(`/index.php?r=${ref}&ref_uid=${ref}&address=${address}`).then((res) => {
			if (res.isOkay()) {
				return (res.body().toString().match(/Client\.User\('([a-z0-9]+)','([a-z0-9]+)',/) || [])[2];
			}
			throw new Error('wrong response');
		});
	}

	balance(address) {
		return new Request(this.host).get(`/stats.php?r=${ref}&ref_uid=${ref}&address=${address}`).then((res) => {
			if (res.isOkay()) {
				return res.body().toString();
			}
			throw new Error('wrong response');
		});
	}

	withdraw(address) {
		return new Request(this.host).form({
			action: 'withdraw',
			address: address
		}).post('/index.php').then((res) => {
			return res.status();
		});
	}

}

module.exports = Api;
