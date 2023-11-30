import { NS } from '@ns'

export async function main(ns : NS) : Promise<void> {
    //
    const serverArray = JSON.parse(ns.read("sortedPurServ.txt"));
    const servers: string[] = serverArray.map((item) => item.server);
    const serverRAM: number[] = serverArray.map((item) => item.serverRAM);
    const maxRAM = ns.readPort(1);

    for (let i = 0; i < servers.length; i++) {
        if (serverRAM[i] < maxRAM) {
            ns.upgradePurchasedServer(servers[i], (serverRAM[i] * 2));
        } else if (serverRAM[i] == maxRAM) {
            ns.upgradePurchasedServer(servers[i], (serverRAM[i] * 2));
        }
    }
}