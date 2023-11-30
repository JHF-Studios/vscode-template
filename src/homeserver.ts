//mport { NS } from '@ns'
//
//xport async function main(ns : NS) : Promise<void> {
//   //
//   const player = ns.getPlayer();
//   const money = player.money;
//   const homeRamCost = ns.getUpgradeHomeRamCost();
//   const homeCPUCost = ns.getUpgradeHomeCoresCost();
//
//   while (true) {
//    
//       homeRamCost = ns.getUpgradeHomeRamCost();
//       homeCPUCost = ns.getUpgradeHomeCoresCost();
//
//       if ((homeRamCost < (player.money / 2)) || (homeCPUCost < (player.money / 2))) {
//           
//           if (homeRamCost < homeCPUCost) {
//               ns.upgradeHomeRam();
//               ns.tprint("Ram Upgraded!");
//           } else {
//               ns.upgradeHomeCores();
//               ns.tprint("CPU Upgraded!")
//           }
//       }   
//
//       ns.sleep(1800000)
//   }
//