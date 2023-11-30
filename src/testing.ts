import { NS } from '@ns'

export async function main(ns : NS) : Promise<void> {
    ns.exec('hack.js', 'home', 1, "--target", "foodnstuff", "--persist", true );
}