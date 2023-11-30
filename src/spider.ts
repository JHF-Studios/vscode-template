import { NS } from '@ns'
/*a small script to traverse to each server available and hack into them.
The script then copies hack, grow, and weaken onto the server
*/

function getServers(ns:NS, current='home', set=new Set()){
    const connections: string[] = ns.scan(current);
    const next = connections.filter(c => !set.has(c));
    next.forEach(n => {
        set.add(n);
        return getServers(ns, current=n, set);
    });
    return Array.from(set.keys())
}

async function sudo(ns: NS, target:string): Promise<boolean>{
    try{
        await ns.brutessh(target);
        await ns.ftpcrack(target);
        await ns.relaysmtp(target);
        await ns.httpworm(target);
        await ns.sqlinject(target);
    } catch{ ns.print(`Failed cracking at least one port on ${target}`)}

    try{
        await ns.nuke(target);
    } catch {ns.print(`Failed to nuke ${target}`);}

    return ns.getServer(target).hasAdminRights;
}

export async function main(ns : NS) : Promise<void> {
    const servers: string[] = (await getServers(ns) as string[]);
    ns.print(servers);
    for(const server of servers){
        ns.print(`Attempting to crack ${server}`);
        const success = await sudo(ns, server);
        if (success){
            ns.print(`Server ${server} successfully cracked. Copying files to server`)
        }
            await ns.scp('weaken.js', server, 'home');
            await ns.scp('grow.js', server, 'home');
            await ns.scp('hack.js', server, 'home');
        
    }
}

