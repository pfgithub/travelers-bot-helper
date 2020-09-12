const fs = require("fs");
const secret = nocacherequire("./secret.json");

module.exports.runBot = function (account, fulldata, rawsend, thisdata) {
	fulldata.turn += 1;
	if(account === "pfg") console.log("tick", fulldata.turn);
	
	fs.writeFileSync("temp/"+account+".json", JSON.stringify(fulldata), "utf-8");
	const send = (msg) => {
		// console.log(account + " >", msg);
		rawsend(msg);
	}
	const {data} = fulldata;
	
	fs.appendFileSync("temp/log.log", ",\n"+JSON.stringify({account, data: thisdata}), "utf-8");
	// console.log(account, "< ", thisdata);
	process.stdout.write("\ry: "+data.y+"\x1b[K");
	
	if(data.state === "travel") {
		if(data.y < 8117) {
			send({ action: "setDir", dir: "n", autowalk: false });
		}else{
			send({ action: "setDir", dir: "s", autowalk: false });
		}
	}else{
		throw new Error("Invalid state "+data.state);
	}
	// console.log(account);
}

function nocacherequire(path) {
	delete require.cache[require.resolve(path)];
	return require(path);
}