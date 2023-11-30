import { NS } from '@ns'

export async function main(ns : NS) : Promise<void> {
    //
    const servers : Array<string> = ns.getPurchasedServers();
    const file = "hack.js";
    
    for (let i = 0; i < servers.length; i++) {
        await ns.scp(file, servers[i], "home");
    }
}