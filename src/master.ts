import { NS } from '@ns'

export async function main(ns : NS) : Promise<void> {
    //
    const purchServers : string[] = ns.getPurchasedServers();
    const player = ns.getPlayer();
    const purchserverLimit = ns.getPurchasedServerLimit();
    let purchServerRamLimit = 0;
    let server = "";

    while (true) {
        ns.run("serverstats.js");
        

        if (purchServers.length < purchServerLimit) {
            ns.run("getservers.js")
        }

        for (let i = 0; i < purchServers.length; i++) {
            purchServerRamLimit = ns.getPurchasedServerMaxRam(purchServers[i]);
            server = ns.getServer(purchServers[i]);
               

        }
    }
}