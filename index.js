
const Miner = require('./src/miner.js');

let miner = new Miner({
	host: 'https://bananominer.arikado.ru',
	account: process.argv[2] || process.env.a,
	thread: process.argv[3] || process.env.b
});

miner.on('logs', (arg) => {
	console.log(...arg);
}).start().then(() => {
	console.log('setup is done');
});
