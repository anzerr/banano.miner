
const puppeteer = require('puppeteer'),
	Api = require('./api.js');

const KEYS = [
	'close',
	'console',
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
		this.log('start', this.app);
		return this.api.get(this.app.account).then((res) => {
			this.app.user = res;
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
			return page.goto(`https://anzerr.github.io/bminer/index.html?thread=${this.app.thread}?user=${this.app.user}`);
		}).then(() => {
			this.log('on the miner page');
			this.interval = setInterval(() => {
				this.balance(this.app.account).then((res) => {
					this.log(this.app.user, res);
				}).catch((e) => this.log(e));
			}, 1000 * 300);
		});
	}

}

module.exports = Miner;
