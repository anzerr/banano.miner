
const puppeteer = require('puppeteer'),
	Api = require('./api.js');

const KEYS = [
	'close',
	'dialog',
	'domcontentloaded',
	'error',
	'load',
	'workercreated',
	'workerdestroyed'
];

class Miner extends require('events') {

	constructor(config) {
		super();
		this.api = new Api(config.host);
		this.config = config;
		this.app = {
			account: config.account || 'ban_3zi3ku5dqbdn1uzggcu9gggut1bojsa1a1jurdqnmcnohy94nu6bo3fo19cp',
			user: null,
			thread: config.thread || 2
		};
	}

	log(...arg) {
		this.emit('logs', arg);
	}

	start() {
		this.log('boot config', this.config);
		this.log('fetch user for', this.app.account);
		return this.api.get(this.app.account).then((res) => {
			this.app.user = res;
			this.log('start', this.app);
			return puppeteer.launch({
				args: [
					'--no-sandbox',
					'--disable-setuid-sandbox'
				]
			});
		}).then((browser) => {
			this.log('browser started');
			return browser.newPage();
		}).then((page) => {
			console.log('new page is loaded');

			for (let i in KEYS) {
				((key) => page.on(key, (e) => this.log(key, e)))(KEYS[i]);
			}
			page.on('console', (e) => this.log('console', e.text()));
			return page.goto(`https://anzerr.github.io/bminer/index.html?thread=${this.app.thread}?user=${this.app.user}`);
		}).then(() => {
			this.log('on the miner page');
			this.interval = setInterval(() => {
				this.api.balance(this.app.account).then((res) => {
					let data = {
						account: res.match(/ban_.{60}/)[0],
						hashes: Number(res.match(/Hashes\smined:<\/td><td>(\d+)/)[1]),
						rate: Number(res.match(/Banano\sper\sMhash:<\/td><td>(\d+)/)[1]),
						wallet: Number(res.match(/Confirmed\sbalance:<\/td><td>(\d+\.\d*)/)[1]),
					};
					data.callc = data.hashes * (data.rate / 1000000);
					this.log(this.app.user, data);
				}).catch((e) => this.log(e));
			}, 1000 * 60);
		});
	}

}

module.exports = Miner;
