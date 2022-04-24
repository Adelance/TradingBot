const SteamUser = require('steam-user');
const SteamTotp = require('steam-totp');
const SteamCommunity = require('steamcommunity');
const TradeOfferManager = require('steam-tradeoffer-manager');

const config = require("../configs/ciastek435.json");


const client = new SteamUser();
const community = new SteamCommunity();
const manager = new TradeOfferManager({
    steam: client,
    community: community,
    language: config.language
});

client.logOn({
    accountName: config.username,
    password: config.password,
    twoFactorCode: SteamTotp.generateAuthCode(config.sharedSecret)
});

client.on('loggedOn', () => {
    console.log("Bot Logged On");
    console.log(`________________________________________`);
    client.setPersona(SteamUser.EPersonaState.Online);
    client.gamesPlayed(440);
});

client.on('webSession', (sessionid, cookies) => {
    manager.setCookies(cookies);
    community.setCookies(cookies);
    community.startConfirmationChecker(10000, config.identitySecret);

    manager.getInventoryContents(440, 2, false, (err, inventory) => {
        if (err) {
            throw err;
        } else {
            // for (item in inventory) {
            //     //console.log(inventory[item])
            //     // url = inventory[item].getLargeImageURL()
            //     // console.log(url)
            // }
            console.log(inventory)
        }
    });


});

client.on('emailInfo', (adress, validated) => {
    console.log(adress)
    console.log(validated)
})