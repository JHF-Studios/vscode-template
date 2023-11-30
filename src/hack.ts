import { NS } from '@ns'

export async function main(ns: NS): Promise<void> {
    // Hack target
    const flags = ns.flags([
      ['server', 'n00dles'],
      ['t', '1'],
    ]);
    const target = flags.server.toString();
    const hackResults = await ns.hack(target);
    await ns.writePort(9, hackResults);
}