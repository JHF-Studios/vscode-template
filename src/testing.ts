import { NS } from '@ns'
import * as time from 'time-functions';

export async function main(ns : NS) : Promise<void> {
    const testTarget = JSON.stringify({action: 'update', playerMoney: await ns.getPlayer().money});
    ns.writePort(5, testTarget);
    await ns.sleep(1500);
    ns.clearPort(5);
    await ns.sleep(time.SECOND);
    ns.clearPort(5);
    await ns.sleep(3 * time.SECOND);
    ns.tprint(ns.readPort(2));
    ns.clearPort(2);
}