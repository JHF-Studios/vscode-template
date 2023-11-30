import { NS } from '@ns'
const HOUR = 3600000;
const MINUTE = 60000;
const SECOND = 1000;

//get all servers that currently have admin rights
function getServers(ns:NS, current='home', set=new Set()){
    const connections: string[] = ns.scan(current);
    const next = connections.filter(c => !set.has(c));
    next.forEach(n => {
        set.add(n);
        return getServers(ns, current=n, set);
    });
    return Array.from(set.keys())
}

export async function main(ns:NS) {
  let target = 'n00dles';
  while(true){
    //attempt to crack any previously uncracked servers
    //get list of servers 
    await ns.exec('spider.js', 'home');
    ns.print("Updating servers list...");
    let servers: string[] = (await getServers(ns) as string[]);
    ns.tprint(servers);
    //check for new target
    ns.print("Finding best target...")
    for(const server of servers){
        ns.tprint(`checking ${server} as possible target`)
        if(ns.getServerMaxMoney(server) > ns.getServerMaxMoney(target) && ns.getServerRequiredHackingLevel(server) < ns.getHackingLevel()){
            ns.print(`Target set to ${server} with max money of ${ns.getServerMaxMoney(server).toLocaleString("en-US", {style:"currency", currency:"USD"})}`);
            target = server;
        }
        
    }
    //set minSec to targets lowest security
    const MINSEC = ns.getServerMinSecurityLevel(target);

    //remove servers without root permission from list
    servers = servers.filter(c => {return ns.getServer(c).hasAdminRights && ns.getServerMaxRam(c) !== 0 && c !== 'home'})
    ns.tprint("Current available servers: " + servers)
    ns.tprint(`There should be ${servers.length} servers running`)
    //begin loop
    ns.print("Setting up game loop");
    const lastUpdate: number = Date.now();
    const maxMoney: number = await ns.getServerMaxMoney(target);
    while(true){
        const currentMoney: number = await ns.getServerMoneyAvailable(target);
        const currentSecurity: number = await ns.getServerSecurityLevel(target);
        let action = 'waiting';
        for (const server of servers){
            ns.tprint(`Currently setting action on server ${server}`)
        //get available threads for hacking
        const serverMaxRam: number = await ns.getServerMaxRam(server);
        const usedRam: number = await ns.getServerUsedRam(server);

        if (currentSecurity > MINSEC){
            const scriptCost = await ns.getScriptRam('weaken.js');
            ns.print("cost of action: " + Math.ceil(scriptCost));
            const threads = Math.floor((serverMaxRam - usedRam) / Math.ceil(scriptCost));
            action = 'weaken'
            if (threads == 0) {
            action = '';
            break; // Servers did not finish in time, sleep again
            }
            ns.exec('weaken.js', server, threads, '--target', target);
        } else if(currentMoney < maxMoney * 0.8){
            const scriptCost = await ns.getScriptRam('grow.js');
            ns.print("cost of action: " + Math.ceil(scriptCost));
            const threads: number = Math.floor((serverMaxRam - usedRam) / Math.ceil(scriptCost));
            action = 'grow';
            if (threads == 0) {
            action = '';
            break; // Servers did not finish in time, sleep again
            }
            ns.exec('grow.js', server, threads, '--target', target);
        } else{
            const scriptCost = await ns.getScriptRam('hack.js');
            ns.print("cost of action: " + Math.ceil(scriptCost));
            const threads: number = Math.floor((serverMaxRam - usedRam) / Math.ceil(scriptCost));
            action = 'hack';
            if (threads == 0) {
            action = '';
            break; // Servers did not finish in time, sleep again
            }
            ns.exec('hack.js', server, threads, '--target', target)
        } 
        }
        let sleepTime = 0;
        switch(action){
        case 'hack':
        ns.print("setting sleep to hack time")
            sleepTime = await ns.getHackTime(target) + SECOND;
            break;
        case 'weaken':
        ns.print("Setting sleep to weaken time") 
            sleepTime = await ns.getWeakenTime(target) + SECOND;
            break;
        case 'grow':
        ns.print("Setting sleep to grow time")
            sleepTime = await ns.getGrowTime(target) + SECOND;
            break;
        default:
            ns.print("Setting sleep to default time");
            action = 'waiting';
            sleepTime = MINUTE; //sleep for one minute by defualt
            break;
        }
        ns.print(`Going to sleep with current target information: money: ${Math.floor(currentMoney).toLocaleString("en-US", {style:"currency", currency:"USD"})} security: ${Math.floor(currentSecurity)}`);
        await ns.sleep(sleepTime+SECOND);
        if(lastUpdate + HOUR <= Date.now() && action !== 'waiting'){
            ns.print("An hour has passed. Updating information...")
            break; // an hour has passed, update information and restart loop
        }
        
    }
  }
  

    //find best target in list of cracked servers
    
    

}