
### `Intro`
Easyer way to "mine" on a server with no gui (haven't seen any difference in hash speed compared to a normal browser)

### `Docker`
Installing docker can be found [here](https://docs.docker.com/install/linux/docker-ce/ubuntu/)

Run a=<ban_account> b=<threads> it works best with event numbers (2,4,6,8,...)
```
docker run -d -e "a=ban_3zi3ku5dqbdn1uzggcu9gggut1bojsa1a1jurdqnmcnohy94nu6bo3fo19cp" -e "b=4" anzerr/bananominer:latest
```

Build image
```
docker build -t anzerr/bananominer:1.0.0 -t anzerr/bananominer:latest .
```

### `Node`
Installing node can be found [here](https://nodejs.org/en/download/package-manager/)

The package.json is missing puppeteer to setup the project
```
git clone https://github.com/anzerr/banano.miner.git miner && \
	cd miner && \
	npm i --only=prod && \
	npm i --save puppeteer@1.8.0
```

To run the project
```
node index.js ban_3zi3ku5dqbdn1uzggcu9gggut1bojsa1a1jurdqnmcnohy94nu6bo3fo19cp 4
```

### `Output format`
when running you should see output every 5sec show hash state

event	| hash per sec 	| total hashes 	| estimate mined in a day
--- 	| --- 			| --- 			| ---
console | 28 			| 751 			| 157.248