import { NS } from '@ns'

export async function main(ns : NS) : Promise<void> {
    //
    const serversOneLevel : string[] = ns.scan;
    const player = ns.getPlayer();
    let server
    for (let i = 0; i < serversOneLevel.length; i++) {
        const server = ns.getServer(serversOneLevel[i]);
        if (server.requiredHackingSkill < ns.getHackingLevel) {
            

    }
    
}