import { NS } from '@ns'

export async function main(ns : NS) : Promise<void> {
    //
    const player = ns.getPlayer();
    const money = player.money;
    const ramExponent = 1;
    const ram = 2 ** ramExponent;
    const newServer = ns.getPurchasedServerCost(ram);
    const serverMax = ns.getPurchasedServerLimit();
    const servers: Array<string> = ns.getPurchasedServers();
    let serverNum = servers.length;

    while (serverNum < serverMax) {
        
        if ((newServer < (money / 2))) {
            
            ns.purchaseServer("Jester"+serverNum, ram);
            serverNum++;
        }   
    }
}
