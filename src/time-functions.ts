import { NS } from '@ns'

export const HOUR = 3600000;
export const MINUTE = 60000;
export const SECOND = 1000;

export function milisToTime(milliseconds: number): string {
    const date = new Date(milliseconds);
    
    const hours: number = date.getUTCHours();
    const minutes: number = date.getUTCMinutes();
    const seconds: number = date.getUTCSeconds();

    return `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
}