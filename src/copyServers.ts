import { NS } from '@ns'

export async function main(ns : NS) : Promise<void> {
    //
    const servers: string[] = await ns.getPurchasedServers();

    servers.forEach(s => {
        ns.scp('hack.js', s, 'home');
        ns.scp('weaken.js', s, 'home');
        ns.scp('grow.js', s, 'home');
    })
}