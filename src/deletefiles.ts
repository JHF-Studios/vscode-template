import { NS } from '@ns'

export async function main(ns : NS) : Promise<void> {
    //
    const servers : string[] = ns.getPurchasedServers();
    const files : string[] = ["hack.js", "run.js"];
    
    for (let i = 0; i < servers.length; i++) {
        ns.rm(files.toString(), servers[i]);
    }
}