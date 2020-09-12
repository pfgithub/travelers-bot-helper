const fs = require("fs");
const secret = nocacherequire("secret.json");

module.exports.runBot = function (account, fulldata, rawsend, thisdata) {
	fulldata.turn += 1;
	if(account === "pfg") console.log("tick", fulldata.turn);
	
	fs.writeFileSync("temp/"+account+".json", JSON.stringify(fulldata), "utf-8");
	const send = (msg) => {
		console.log(account + " >", msg);
		rawsend(msg);
	}
	const {data} = fulldata;
	
	fs.appendFileSync("temp/log.log", ",\n"+JSON.stringify({account, data: thisdata}), "utf-8");
	// console.log(account, "< ", thisdata);
	
	if(data.state === "travel") {
		if(account === "pfg") {
			console.log("Waiting for toro to respawn");
		}
	}else if(data.state === "int") {
		// if(account === "pfg") {
		// 	if(thisdata.battle_startround) {
		// 		console.log("Starting battle round "+thisdata.battle_startround.round+" ("+thisdata.battle_startround.round_type+")");
		// 	}else {
		// 		console.log("Starting or in battle");
		// 	}
		// }
		if(account === "pfg") {
			if(thisdata.battle_roundreview) {
				// "battle_roundreview":{"opp_hp":38,"opp_sp":30,"you_option":"h","opp_option":"","next_round":4212193}
				console.log(thisdata.battle_roundreview);
			}
			if(thisdata.int_defeated) {
				console.log(thisdata.int_defeated);
			}
			// console.log("pfg's sp: ", data.skills.sp, "/", data.skills.max_sp);
			// console.log(thisdata);
		}
		if(account === "toro") {
			// console.log("toro's hp: ", data.skills.hp, "/", data.skills.max_hp);
		// 	if(thisdata.battle_startround) {
		// 		console.log("Next round in "+(thisdata.battle_startround.next_round - fulldata.turn)+" turns")
		// 	}
		}
	}
	
	// console.log(account + "< ", {state: data.state}, thisdata);
	if(data.state === "travel") {
		if(account === "toro" && data.y < secret.y) {
			send({ action: "setDir", dir: "n", autowalk: false });
		}
	}
	if(data.state === "int") {
		if(data.int_here.find(pl => pl.username === "torogodude" && pl.online && !pl.in_battle)) {
			if(account === "pfg") {
				send({ action: "pvp-attack", option: "torogodude" });
			}
		} else if(account === "pfg") {
			if(thisdata.battle_start) {
				send({ action: "pvp-startready", weapon: "shovel" });
			}else{
				send({ action: "pvp-battleopt", option: "h" });
				send({ action: "pvp-execute" });
			}
		} else if (account === "toro") {
			if(thisdata.battle_start) {
				send({ action: "pvp-startready", weapon: "" });
			}
		}
	}
	if(data.state === "death") {
		if(account === "toro") {
			send({ action: "reincarnate" });
		}
	}
	// console.log(account);
}

function nocacherequire(path) {
	delete require.cache[require.resolve(path)];
	return require(path);
}