import { NS } from '@ns'

export async function main(ns : NS) : Promise<void> {
    //
    const flags = ns.flags([
        ['server', 'n00dles'],
        ['t', '1'],
    ]);
    const target = flags.server.toString();
    const growResults = await ns.grow(target);
    await ns.writePort(11, growResults);
}