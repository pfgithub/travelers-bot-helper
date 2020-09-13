const fs = require("fs");
const secret = nocacherequire("./secret.json");
const humanizeDuration = require("humanize-duration");
const cp = require("child_process");

function estimateTime(px, py, lx, ly) {
    let straightTimeH = Math.abs(lx - px);
    let straightTimeV = Math.abs(ly - py);
    let diagonalTime = Math.min(straightTimeV, straightTimeH);
    straightTimeH -= diagonalTime;
    straightTimeV -= diagonalTime;
	const resTime = diagonalTime + straightTimeH + straightTimeV;
	const dblstepSpeedup = resTime * 0.1;
    return Math.ceil(resTime - dblstepSpeedup);
}

module.exports.runBot = function (account, fulldata, rawsend, thisdata) {
	fulldata.turn += 1;
	
	fs.writeFileSync("temp/"+account+".json", JSON.stringify(fulldata), "utf-8");
	const send = (msg) => {
		// console.log(account + " >", msg);
		rawsend(msg);
	}
	const {data} = fulldata;
	
	fs.appendFileSync("temp/log.log", ",\n"+JSON.stringify({account, data: thisdata}), "utf-8");
	// console.log(account, "< ", thisdata);
	const timeEstimate = estimateTime(data.x, data.y, secret.target.x, secret.target.y);
	process.stdout.write("\rx: "+data.x+", y: "+data.y+", "+humanizeDuration(timeEstimate * 1000)+"\x1b[K");
	
	if(data.state === "travel") {
		var targetdir =
			["s", "", "n"][Math.sign(secret.target.y - data.y) + 1]
			+ ["w", "", "e"][Math.sign(secret.target.x - data.x) + 1];
		if(!targetdir) {
            cp.spawnSync("notify-send", ["At location!", "-i", "notifications", "-t", "900"]);
            throw new Error("At location!");
        }
		
		process.stdout.write(", going "+targetdir);
		
		send({ action: "setDir", dir: targetdir, autowalk: true });
		send({ action: "doublestep", option: "add" });
	}else if(data.state === "looting") {
        send({ action: "loot_next" });
    }else{
		throw new Error("Invalid state "+data.state);
	}
	// console.log(account);
}

function nocacherequire(path) {
	delete require.cache[require.resolve(path)];
	return require(path);
}
