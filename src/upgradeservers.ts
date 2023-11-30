import { NS } from '@ns'

export async function main(ns : NS) : Promise<void> {
    //
    const servers : Array<string> = ns.getPurchasedServers();
    let serverRAM = 2;
    const player = ns.getPlayer();
    const playerMoney = player.money;
    let serverUpgradeCost = 0;

    while (serverUpgradeCost <= playerMoney / 2) {
        for (let i = 0; i < servers.length; i++) {
            serverUpgradeCost = ns.getPurchasedServerUpgradeCost(servers[i], serverRAM);
            ns.upgradePurchasedServer(servers[i], serverRAM);
        }
    serverRAM = serverRAM * 2;
    }
}