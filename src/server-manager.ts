import { NS } from '@ns'
import { start } from 'repl';
import * as time from 'time-functions';

//port constants
const INBOUNDPORT = 5;
const OUTBOUNDPORT = 2;

//constants
const STARTINGRAM = 16;


export async function main(ns : NS) : Promise<void> {
    ns.disableLog('ALL');
    while(true){
        while(ns.peek(INBOUNDPORT) !== 'NULL PORT DATA') {
            ns.print("Update received... Getting port update");
            let result = 'nothing purchased';
            const update = JSON.parse((ns.peek(INBOUNDPORT) as string));
            if(update.action === 'update'){
                // get number of purchased servers
            const purchasedServers: string[] = await ns.getPurchasedServers();
            const numServers: number = purchasedServers.length;
            if(numServers > 0){
                    ns.print("At least one server detected... checking if any server need to be upgraded");
                    // get max number of servers allowed
                    const maxServers: number = await ns.getPurchasedServerLimit();
                    ns.print("Checking that all servers have same ram");                    
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
                        if (costToUpgrade <= update.playerMoney){
                            ns.print(`Upgrading ${toUpgrade}`);
                            await ns.upgradePurchasedServer(toUpgrade, desiredRam);
                            result = 'upgraded ram standard';
                        } else await ns.sleep(2 * time.SECOND); // wait for port to clear
                    } else {
                        ns.print("All ram was same on servers... Looking into purchasing new server")
                        //move on to purchasing servers
                        //calculate cost of purchasing server with same ram
                        let desiredRam: number = serverPairs[0][1]
                        const purchaseServerCost = await ns.getPurchasedServerCost(desiredRam);
                        //if cost is lower than current money then purchase server
                        if(purchaseServerCost <= update.playerMoney && numServers < maxServers){
                            ns.print("Purchasing server");
                            await ns.purchaseServer('hserver-' + (numServers +1 as number), desiredRam)
                            result = 'purchase additional';
                        } 
                        
                        //else check if it is possible to upgrade a server
                        else{
                            ns.print("Could not purchase server, attempting to upgrade to next ram level");
                            desiredRam *= 2;
                            if (desiredRam <= Math.pow(2, 20)){
                                const upgradeRamCost = await ns.getPurchasedServerUpgradeCost(serverPairs[0][0], desiredRam);
                                if(upgradeRamCost <= update.playerMoney){ 
                                    ns.print("Purchasing server")
                                    await ns.upgradePurchasedServer(serverPairs[0][0], desiredRam);
                                    result = 'upgraded ram new'
                                    await ns.sleep(time.MINUTE);
                                } else await ns.sleep(10 * time.SECOND); //wait for port to clear
                            }
                    }
                }
            } else{ //no servers yet purchased.. purchase a server with starting ram
                ns.print("Not enough servers, purchasing first server");
                if(await ns.getPurchasedServerCost(STARTINGRAM) <= update.playerMoney) {
                    ns.print("Purchasing server")
                    await ns.purchaseServer('hserver-1', STARTINGRAM);
                    result = 'purchase first';
                    await ns.sleep(time.MINUTE);
                }
                else await ns.sleep(10 * time.SECOND); // wait for port to clear
            }
            ns.print('sending result back to controller');
            const returnData = JSON.stringify({script: 'server-manager', result: result !== 'nothing purchased', data: result});
            let pushed = false;
            do{
                pushed = await ns.tryWritePort(OUTBOUNDPORT, returnData);
            } while(!pushed)
            } else{
                ns.print("Invalid action... sleeping till port cleared");
                await ns.sleep(10 * time.SECOND)
            }
        }
        ns.print(`No update received... sleeping for ${time.milisToTime(time.SECOND)}`);
        await ns.sleep(time.SECOND);
    }
}