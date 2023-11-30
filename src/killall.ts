import { NS } from '@ns'

export async function main(ns : NS) : Promise<void> {
    //
    const servers : string[] = ns.getPurchasedServers();
    
    for (let i = 0; i < servers.length; i++) {
        ns.killall(servers[i]);
    }   
}