import { NS } from '@ns'

export async function main(ns : NS) : Promise<void> {
    //
    const flags = ns.flags([
        ['script', 'hack.js'],
    ]);
    const servers : string[] = ns.getPurchasedServers();
    const script = flags.script.toString();
    let threads = 1;
    
    for (let i = 0; i < servers.length; i++) {
        const server = ns.getServer(servers[i]);
        threads = Math.floor((server.maxRam - server.ramUsed) / ns.getScriptRam(script));
        ns.exec(script, servers[i], threads);
    }
}