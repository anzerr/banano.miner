
const Page = require('./page.js'),
	ENUM = require('./enum.js'),
	Api = require('./api.js');

class Miner extends require('events') {

	constructor(config) {
		super();
		this.api = new Api(config.host);
		this.page = new Page((...arg) => this.log(...arg), (...arg) => this.health(...arg));
		this.config = config;
		this.app = {
			miner: config.miner || 'coinimp',
			account: config.account || ENUM.ACCOUNT,
			user: null,
			thread: config.thread || 2
		};
	}

	health() {
		clearTimeout(this._close);
		this._close = setTimeout(() => {
			this.log(new Error('not logs from workers in to long'));
			process.exit(1);
		}, 1000 * 60);
	}

	log(...arg) {
		this.emit('logs', arg);
	}

	check() {
		clearInterval(this.interval);
		this.interval = setInterval(() => {
			this.api.balance(this.app.account).then((res) => {
				let data = {
					account: (res.match(/ban_.{60}/) || [])[0] || 'missing',
					hashes: Number((res.match(/Mined\sby\syou:\s(\d+)\shashes/) || [])[1] || 0) || 'missing',
					balance: Number((res.match(/Balance:\s(\d+\.{0,1}\d*)\sBAN/) || [])[1] || 0) || 'missing',
				};
				this.log(this.app.user, data);
			}).catch((e) => this.log(e));
		}, 1000 * 60);
		return this;
	}

	start() {
		this.log('boot config', this.config);
		this.log('fetch user for', this.app.account);
		return this.api.create(this.app.account).then((res) => {
			console.log('created', res);
			return this.api.get(this.app.account);
		}).then((res) => {
			this.app.user = res || 'dc754b618731c8924aefb61b51e18728';
			if (!this.app.user.match(/^[a-z0-9]{32}$/)) {
				throw new Error('invalid user account');
			}
			this.log('start', this.app);
			return this.page.load(`https://anzerr.github.io/${this.app.miner}/index.html?thread=${this.app.thread}?user=${this.app.user}`);
		}).then(() => {
			this.log('on the miner page');
			this.log('config', this.app);
			return this.check();
		});
	}

}

module.exports = Miner;
