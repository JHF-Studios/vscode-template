import { NS } from '@ns'

export async function main(ns : NS) : Promise<void> {
    //
    const flags = ns.flags([
        ['script', 'hack.js'],
        ['server', 'home']
    ]);
    const script = flags.script.toString();
    const server = flags.server.toString();
    const threads = 1; Math.floor((server.maxRam - server.ramUsed) / ns.getScriptRam(script));
    ns.exec(script, server, threads);
 }
