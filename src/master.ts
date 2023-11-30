import { NS } from '@ns'

export async function main(ns : NS) : Promise<void> {
    //
    const purchServers : string[] = ns.getPurchasedServers();
    const player = ns.getPlayer();
    const purchserverLimit = ns.getPurchasedServerLimit();
    let purchServerRamLimit = 0;
    let server = "";

    while (true) {
        await ns.run("serverstats.js");
        await ns.run("upgradeservers.js");
        if (purchServers.length < purchServerLimit) {
            ns.run("getservers.js")
        }

}