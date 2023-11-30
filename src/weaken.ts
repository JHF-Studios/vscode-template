import { NS } from '@ns'

export async function main(ns : NS) : Promise<void> {

    const args = ns.flags([
        ['target', 'n00dles'],
        ['persist', false],
    ])
    ns.print(`Target: ${args.target}, Persist: ${args.persist} with type: ${typeof(args.persist)}`)
    do{
        await ns.weaken(args.target.toString());
    }while(args.persist)

}