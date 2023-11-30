import { NS } from '@ns'

export async function main(ns : NS) : Promise<void> {
    //
    const ram = 2;
    const servers: Array<string> = ns.getPurchasedServers();
    let serverNum = servers.length;
    ns.purchaseServer("Jester"+serverNum, ram);
    serverNum++;
}
