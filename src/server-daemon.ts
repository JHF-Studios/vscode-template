import { NS } from '@ns'
const HOUR = 3600000;
const MINUTE = 60000;
const SECOND = 1000;
const STARTINGRAM = 16;

export async function main(ns : NS) : Promise<void> {
    while(true){
        const persist = true;
        while(persist){
            //get current money            
            const currentMoney: number = await ns.getPlayer().money;
            // get number of purchased servers
            const purchasedServers: string[] = await ns.getPurchasedServers();
            const numServers: number = purchasedServers.length;
            if(numServers > 0){
                    ns.print("At least one server detected... checking if any server need to be upgraded");
                    // get max number of servers allowed
                    const maxServers: number = await ns.getPurchasedServerLimit();
                    
                    // if there are existing servers, check that all existing servers have equal ram
                    
                    //organize servers into key value pairs based on hostname and ram
                    const serverPairs: [string, number][] = []; 
                    purchasedServers.forEach(s => {
                        const ram: number = ns.getServerMaxRam(s);
                        serverPairs.push([s, ram]);
                    })
                    ns.print(serverPairs);
                    
                    //check if all ram values are the same
                    const sameRam:boolean = serverPairs.every(([, ramValue], index, array) => index === 0 || ramValue === array[index-1][1]);
                    //if not then sort so that lowest value is first and attempt to upgrade
                    if(!sameRam){
                        ns.print("At least one server needs upgrading... Sorting by ram");
                        serverPairs.sort((a, b) => a[1] - b[1]);
                        ns.print(serverPairs);
                        const desiredRam:number = serverPairs[serverPairs.length-1][1]
                        //server at index = now has lowest ram
                        const toUpgrade:string = serverPairs[0][0];
                        const costToUpgrade = await ns.getPurchasedServerUpgradeCost(toUpgrade, desiredRam); // last server in array should contain current ram standard
                        if (costToUpgrade <= currentMoney){
                            ns.print(`Upgrading ${toUpgrade}`);
                            await ns.upgradePurchasedServer(toUpgrade, desiredRam);
                        } else break; // not enough money
                    } else {
                        ns.print("All ram was same on servers... Looking into purchasing new server")
                        //move on to purchasing servers
                        //calculate cost of purchasing server with same ram
                        let desiredRam: number = serverPairs[0][1]
                        const purchaseServerCost = await ns.getPurchasedServerCost(desiredRam);
                        //if cost is lower than current money then purchase server
                        if(purchaseServerCost <= currentMoney && numServers < maxServers){
                            ns.print("Purchasing server");
                            await ns.purchaseServer('hserver-' + (numServers +1 as number), desiredRam)
                        } 
                        
                        //else check if it is possible to upgrade a server
                        else{
                            ns.print("Could not purchase server, attempting to upgrade to next ram level");
                            desiredRam *= 2;
                            if (desiredRam <= Math.pow(2, 20)){
                                const upgradeRamCost = await ns.getPurchasedServerUpgradeCost(serverPairs[0][0], desiredRam);
                                if(upgradeRamCost <= currentMoney){ 
                                    ns.print("Purchasing server")
                                    await ns.upgradePurchasedServer(serverPairs[0][0], desiredRam);
                                    await ns.sleep(MINUTE);
                                } else break; //out of money, wait for hacks to bring in more revenue
                            }
                    }
                }
            } else{ //no servers yet purchased.. purchase a server with starting ram
                ns.print("Not enough servers, purchasing first server");
                if(await ns.getPurchasedServerCost(STARTINGRAM) <= currentMoney) {
                    ns.print("Purchasing server")
                    await ns.purchaseServer('hserver-1', STARTINGRAM);
                    await ns.sleep(MINUTE);
                }
                else break; // out of money, wait for hacks to bring in more revenue
            }
        }   
        //update every hour
        await ns.sleep(HOUR);
        
    }
        
}