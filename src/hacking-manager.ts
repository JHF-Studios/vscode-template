import { NS } from '@ns'
import * as time from 'time-functions';

//port constants
const INBOUNDPORT = 10;
const OUTBOUNDPORT = 2;


export async function main(ns : NS) : Promise<void> {
    ns.disableLog('ALL');
    //infinitely loop every second to see if there was an update
    while(true){
        while(ns.peek(INBOUNDPORT) !== 'NULL PORT DATA') {
            ns.print("Update received... Getting port update...");
            const update = JSON.parse((ns.peek(INBOUNDPORT) as string));
            let result = 0;
            ns.print(`Now executing ${update.action} on ${update.target}`);
            switch(update.action){
                case 'hack':
                    result = await ns.hack(update.target);
                    break;
                case 'weaken':
                    result = await ns.weaken(update.target);
                    break;
                case 'grow':
                    result = await ns.grow(update.target);
                    break;
                default:
                    ns.print("Invalid action!")
                    break;
            }
            ns.print(`${update.action} completed with result ${result}. Sending information back to controller`);
            const returnData = JSON.stringify({script: 'hacking-manager', result: result !== 0 ? 'success' : 'failure', data: {action: update.action, result: result}});
            let pushed = false;
            do{
                pushed = await ns.tryWritePort(OUTBOUNDPORT, returnData);
            } while(!pushed)
        }
        ns.print(`No update received... sleeping for ${time.milisToTime(time.SECOND)}`);
        await ns.sleep(time.SECOND)
    }
}