const rl = require("readline");
const { createBot, generateWorldTileAt } = require("travelersapi");
const fs = require("fs");

async function readline(question) {
    const r = rl.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return await new Promise(rslv =>
        r.question(question, answer => {
            rslv(answer);
            r.close();
        }),
    );
}

(async () => {
    if(process.argv.length !== 3) {
        console.log("Usage: node index.js <botname>");
        process.exit(1);
    }
    const botname = process.argv[2];
    
    const accounts = require("./accounts.json");
    const botconfig = require("./bots/"+botname+"/botconfig.json");
    
    const botjsfile = "./bots/"+botname+"/bot.js";
    const sendrecvfile = "./bots/"+botname+"/sendrecv.log"
    
    for(const username of botconfig) {
        const bot = createBot();
        if(!accounts[username]) {
            console.log("Account not in accounts.json :: `"+username+"`");
            process.exit(1);
        }
        
        const bot_captcha = await readline(username+"'s SOCKET.captcha = ");
        const bot_data = await bot.login(accounts[username], bot_captcha);
        console.log("Logged In!");
        
        const send = msg => {
            fs.appendFileSync(sendrecvfile, "i> :: "+Date.now()+" :: "+JSON.stringify(msg)+"\n", "utf-8");
            bot.send(msg);
        };
        bot.on.update = msg => {
            fs.appendFileSync(sendrecvfile, "I< :: "+Date.now()+" :: "+JSON.stringify(msg)+"\n", "utf-8");
            Object.assign(bot_data.data, msg);
            require(botjsfile).runBot(username, bot_data, send, msg);
        };
    }
        
    while(true) {
        await readline("Enter to clear require cache");
        delete require.cache[require.resolve(botjsfile)];
    }
})();