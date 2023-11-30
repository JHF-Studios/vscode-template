import { NS } from '@ns'

export async function main(ns : NS) : Promise<void> {
    //
    const servers: Array<string> = ns.getPurchasedServers();
    const player = ns.getPlayer();

    for (let i = 0; i < servers.length; i++) {
        const server = ns.getServer(servers[i]);
        const maxRAM = ns.getPurchasedServerMaxRam(servers[i]);
        const ramUpgrade = ns.getPurchasedServerUpgradeCost(servers[i]);
        const upgradeCost = player.money - ramUpgrade
        let canUpgrade = false
        if (upgradeCost > 0) {
            canUpgrade = true
        ns.tprint("Hostname: " + server.hostname, " MaxRAM: " + server.maxRam, "Total RAM : " + maxRAM, "Can Upgrade: " + canUpgrade);
    }
    }
}