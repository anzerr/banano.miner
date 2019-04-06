
const Miner = require('./src/miner.js');

let miner = new Miner({
	host: 'https://bananominer.arikado.ru',
	account: process.env.a,
	thread: process.env.b
});

miner.on('logs', (arg) => {
	console.log(...arg);
}).start().thne(() => {
	console.log('setup is done');
});
