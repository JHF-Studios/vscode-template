import { NS } from '@ns'

export async function main(ns : NS) : Promise<void> {
    //
    const servers : Array<string> = ns.getPurchasedServers();
    const files : string[] = ["hack.js", "grow.js", "weaken.js"]   
    for (let i = 0; i < servers.length; i++) {
        await ns.scp(files, servers[i], "home");
    }
}