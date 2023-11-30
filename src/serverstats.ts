import { NS } from '@ns'

export async function main(ns : NS) : Promise<void> {
    //
    const servers: Array<string> = ns.getPurchasedServers();
    
    for (let i = 0; i < servers.length; i++) {
    const server = ns.getServer(servers[i]);
    ns.tprint("Hostname: " + server.hostname, " MaxRAM: " + server.maxRam)
    }
}