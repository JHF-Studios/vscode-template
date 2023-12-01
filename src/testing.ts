import { NS } from '@ns'

export async function main(ns : NS) : Promise<void> {
    const x = 1

    if(x == 1 ) await ns.hack('n00dles');
    else if (x == 2) await ns.grow('n00dles');
    else await ns.weaken('n00dles');
}