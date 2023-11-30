import { NS } from '@ns'

export async function main(ns : NS) : Promise<void> {
    //Write current purchased server hostnames and RAM to file
    const servers : Array<string> = ns.getPurchasedServers();
    const serverRAM: number[] = [];

    for (let i = 0; i < servers.length; i++) {
    const server = ns.getServer(servers[i]);
    serverRAM.push(server.maxRam);
    }

    const combinedArray: { server: string; serverRAM: number }[] = servers.map((server, index) => ({
    server,
    serverRAM: serverRAM[index],
    }));

    combinedArray.sort((a, b) => a.serverRAM - b.serverRAM);
    await ns.writePort(1, Math.max(...serverRAM));
    ns.write("sortedPurServ.txt", JSON.stringify(combinedArray), "w");
}