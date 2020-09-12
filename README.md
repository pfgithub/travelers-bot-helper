# travelers-bot-helper
easy way to make a travellers bot so you don't have to constantly be restarting and entering a new captcha

how to:

setup:
```
yarn install
or
npm install
```

running:
```
node index.js xpbot
```

you can make bots in the bots/ folder

set up accounts in accounts.json

and other stuff

while the bot is running, press enter to restart it.

make a bot like this:

```js
module.exports.runBot = function (account, fulldata, send, thisdata) {
    console.log(account, thisdata);
    send({ action: "setDir", dir: "n", autowalk: false });
}
function nocacherequire(path) {
	delete require.cache[require.resolve(path)];
	return require(path);
}
```

all sends and recvs will be logged by default

use nocacherequire to require anything that you want to be re-required after a restart
