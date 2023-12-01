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

function milisToTime(milliseconds: number): string {
    const date = new Date(milliseconds);
    
    const hours: number = date.getUTCHours();
    const minutes: number = date.getUTCMinutes();
    const seconds: number = date.getUTCSeconds();

    return `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
}

export async function main(ns:NS) {
    ns.disableLog('ALL');
    while(true){
        //attempt to crack all servers
        ns.print("Attempting to crack all servers...")
        await ns.exec('spider.js', 'home');
        ns.print("Updating essential information...");
        //set base variables
        let target = 'n00dles';
        let slist: string[] = (await getServers(ns) as string[]);
        const growCost = await ns.getScriptRam('grow.js');
        const weakenCost = await ns.getScriptRam('weaken.js');
        const hackCost = await ns.getScriptRam('hack.js');
        ns.print("Searching for best target at current level...")
        slist.forEach(s => {
            if (ns.getServerMaxMoney(s) > ns.getServerMaxMoney(target) && ns.getServerRequiredHackingLevel(s) <= ns.getHackingLevel()) target = s;
        })
        const minSec = ns.getServerMinSecurityLevel(target);
        const maxMoney = ns.getServerMaxMoney(target);
        ns.print(`Target has been set to ${target} with a minimum security of ${minSec} and a max money of ${maxMoney}`);

        ns.print("Filtering server list for root access");
        slist = slist.filter(s => {return ns.getServer(s).hasAdminRights && ns.getServerMaxRam(s) !== 0 && s !== 'home'});
        ns.print(`Current controlled servers: ${slist}`);
        ns.print(`${slist.length} servers available for hacking`);
        ns.print("Starting hacking loop...")
        const lastUpdate = Date.now();
        while(true){
            ns.print("Getting current target information...");
            const currentMoney: number = ns.getServerMoneyAvailable(target);
            const currentSecurity: number = ns.getServerSecurityLevel(target);
            let action = 'waiting';
            let sleepTime = MINUTE;
            const hackTime: number = ns.getHackTime(target);
            const weakenTime: number = ns.getWeakenTime(target);
            const growTime: number = ns.getGrowTime(target);
            ns.print("Information gathered. Determining best action...")
            if(currentSecurity > minSec)action = "weakening";
            else if (currentMoney < maxMoney) action = "growing";
            else action = 'hacking';
            ns.print(`now ${action} ${target}`);
            for(const server of slist){
                const serverMaxRam: number = await ns.getServerMaxRam(server);
                const usedRam: number = await ns.getServerUsedRam(server);
                let threads = 1;
                switch(action){
                    case 'weakening':
                        threads = Math.floor((serverMaxRam - usedRam) / Math.ceil(weakenCost));
                        sleepTime = weakenTime + SECOND;
                        ns.exec('weaken.js', server, threads, "--target", target);
                        break;
                    case 'growing':
                        threads = Math.floor((serverMaxRam - usedRam) / Math.ceil(weakenCost));
                        sleepTime = growTime + SECOND;
                        ns.exec('grow.js', server, threads, "--target", target);
                        break;
                    case 'hacking':
                        threads = Math.floor((serverMaxRam - usedRam) / Math.ceil(weakenCost));
                        sleepTime = hackTime + SECOND;
                        ns.exec('hack.js', server, threads, "--target", target);
                        break;
                    default:
                        ns.print(`${action} could not be completed. Sleeping for one minute`);
                        break;
                }
            }

            ns.print(`Current information:\n------\nSecurity:\ncurrent: ${currentSecurity.toFixed(3)}\nmin: ${minSec.toFixed(3)}\n------\nMoney:\nCurrent: ${Math.floor(currentMoney).toLocaleString("en-US", {style:"currency", currency:"USD"})}\nMax: ${maxMoney.toLocaleString("en-US", {style:"currency", currency:"USD"})}\nPercentage: ${((currentMoney / maxMoney) * 100).toFixed(4)}%\n`);
            ns.print(`${action} started on all servers. Sleeping for ${milisToTime(sleepTime)}`);
            await ns.sleep(sleepTime);
            if (lastUpdate + (2 * HOUR) <= Date.now()) {
                ns.print(`${milisToTime(Date.now() - lastUpdate)} since last update. Breaking Loop to update information...`);
                await ns.sleep(5 * SECOND);
                break;
            }
            
        }
    }
}