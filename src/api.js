
const Request = require('request.libary'),
	ENUM = require('./enum.js'),
	url = require('url');

class Api {

	constructor(h) {
		this.host = h || 'https://powerplant.banano.cc';
		this.ref = ENUM.REF[url.parse(this.host).hostname];
	}

	create(address) {
		return new Request(this.host).options({redirect: false}).form({
			address: address,
			ref_uid: this.ref // eslint-disable-line camelcase
		}).post('/index.php').then((res) => {
			if (res.isStatus(3)) {
				return true;
			}
			throw new Error('wrong response');
		});
	}

	get(address, miner) {
		return new Request(this.host).get(`api2_get_id.php?address=${address}&${miner}`).then((res) => {
			if (res.isOkay()) {
				return res.body().toString().match(/^[a-z0-9]{32}$/)[0];
			}
			throw new Error('wrong response');
		});
	}

	balance(address) {
		return new Request(this.host).get(`/stats.php?r=${this.ref}&ref_uid=${this.ref}&address=${address}`).then((res) => {
			if (res.isOkay()) {
				return res.body().toString();
			}
			throw new Error('wrong response');
		});
	}

}

module.exports = Api;
