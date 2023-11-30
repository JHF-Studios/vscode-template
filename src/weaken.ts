import { NS } from '@ns'

export async function main(ns : NS) : Promise<void> {
    //Weaken target
    const flags = ns.flags([
        ['server', 'n00dles'],
        ['t', '1'],
    ]);
    const target = flags.server.toString();
    const weakenResults = await ns.weaken(target);
    await ns.writePort(10, weakenResults);
}