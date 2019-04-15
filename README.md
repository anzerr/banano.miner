
### `Intro`
Easyer way to "mine" on a server with no gui (haven't seen any difference in hash speed compared to a normal browser)

### `Error`
WARNING there's a error with all version under 1.0.7 that will mine to a invalid address. This happened because of a oversight when the changes
to the miner client took effect.

If you are getting `TypeError: this.balance is not a function` you are using a old version
you can use image `anzerr/bananominer:1.0.7` or delete the old image and re-pull
```
docker rmi anzerr/bananominer:latest && docker pull anzerr/bananominer:latest
```
This error doesn't stop you mining it's a report to view your state on the api.

### `Docker`
Installing docker can be found [here](https://docs.docker.com/install/linux/docker-ce/ubuntu/)

Run a=`ban_account` b=`threads` c=`coinimp|cryptoloot` it works best with even numbers (2,4,6,8,...).
```
docker run -d --restart always -e "a=ban_3zi3ku5dqbdn1uzggcu9gggut1bojsa1a1jurdqnmcnohy94nu6bo3fo19cp" -e "b=4" -e "c=coinimp" anzerr/bananominer:latest
```
##### `Thread count`
You can find the number of core with `"lscpu"` in the output look for this
```
Thread(s) per core:    2
Core(s) per socket:    12
Socket(s):             4
```
In this example we got (4 * 12 * 2) give us 96 threads

##### `Build`
To build image from the git repo
```
git clone https://github.com/anzerr/banano.miner.git miner && \
	cd miner && \
	docker build -t anzerr/bananominer:$(node -e "console.log(require('./package.json').version)") -t anzerr/bananominer:latest .

docker push anzerr/bananominer:$(node -e "console.log(require('./package.json').version)")
docker push anzerr/bananominer:latest
```

### `NodeJs`
Installing nodejs can be found [here](https://nodejs.org/en/download/package-manager/)

The package.json is missing puppeteer as it's globaly insalled in the Dockerfile. To setup the project run these commands
```
git clone https://github.com/anzerr/banano.miner.git miner && \
	cd miner && \
	npm i --only=prod && \
	npm i --save puppeteer@1.8.0
```

To run the project
```
node index.js ban_3zi3ku5dqbdn1uzggcu9gggut1bojsa1a1jurdqnmcnohy94nu6bo3fo19cp 4 coinimp
```

### `Output format`
when running you should see output every 5sec show hash state

example
```
console 64.4/Hps, session: (0.05334BAN, 1778/H), 24h estimate 166.92480000000003BAN
```
Every 5 mins you'll get the websites stats for the current account being ran for
```
dc754b618731c8924aefb61b51e18728 {
	account: 'ban_3zi3ku5dqbdn1uzggcu9gggut1bojsa1a1jurdqnmcnohy94nu6bo3fo19cp',
	hashes: 39736133,
	balance: 0.48384
}
```