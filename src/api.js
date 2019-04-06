
const Request = require('request.libary');

class Api {

	constructor(h) {
		this.host = h || 'https://bananominer.arikado.ru';
	}

	get(address) {
		return new Request(this.host).get(`/index.php?r=860&ref_uid=860&address=${address}`).then((res) => {
			if (res.isOkay()) {
				return (res.body().toString().match(/Client\.User\('([a-z0-9]+)','([a-z0-9]+)',/) || [])[2];
			}
			throw new Error('wrong response');
		});
	}

	balance(address) {
		return new Request(this.host).get(`/index.php?r=860&ref_uid=860&json=1&address=${address}`).then((res) => {
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
